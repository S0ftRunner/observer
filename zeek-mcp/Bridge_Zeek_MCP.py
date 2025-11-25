import argparse
import logging
import subprocess
import pandas as pd
from mcp.server.fastmcp import FastMCP
import os
import glob
import shutil
from giga import GigaChatService

# Configure module-level logger
logger = logging.getLogger(__name__)
mcp = FastMCP("Zeek-MCP")

def parse_zeek_log(path):
    """Parse a single Zeek .log file"""
    headers = []
    data_lines = []

    with open(path, "r") as f:
        for line in f:
            line = line.strip()
            if line.startswith("#"):
                headers.append(line)
            elif line:
                data_lines.append(line.split('\t'))

    field_line = next((h for h in headers if h.startswith("#fields")), None)
    if not field_line:
        raise ValueError(f"Missing '#fields' header in {path}")

    columns = field_line.replace("#fields\t", "").split('\t')
    df = pd.DataFrame(data_lines, columns=columns)
    return df

def parse_all_logs_as_str(directory="."):
    """Parse all Zeek log files in directory"""
    log_files = sorted(glob.glob(os.path.join(directory, "*.log")))
    parts = []

    for log_path in log_files:
        basename = os.path.basename(log_path)
        try:
            df = parse_zeek_log(log_path)
            table_str = df.to_string(index=False)
            part = f"=== {basename} ===\n\n{table_str}"
        except Exception as e:
            part = f"[ERR] {basename}: {e}"
        parts.append(part)

    return "\n\n".join(parts)

@mcp.tool()
def execzeek(pcap_path: str) -> str:
    """
    Run Zeek on a specified PCAP file using Docker container.
    """
    try:
        # Get absolute path
        abs_pcap_path = os.path.abspath(pcap_path)
        pcap_filename = os.path.basename(abs_pcap_path)
        
        logger.info(f"PCAP absolute path: {abs_pcap_path}")
        logger.info(f"PCAP filename: {pcap_filename}")
        logger.info(f"Current working directory: {os.getcwd()}")

        # Check if file exists
        if not os.path.exists(abs_pcap_path):
            return f"Error: PCAP file not found at {abs_pcap_path}"

        # Копируем PCAP файл в текущую рабочую директорию (которая монтирована в контейнер)
        target_pcap_path = os.path.join(os.getcwd(), pcap_filename)
        if abs_pcap_path != target_pcap_path:
            shutil.copy2(abs_pcap_path, target_pcap_path)
            logger.info(f"Copied PCAP file to: {target_pcap_path}")

        # Remove all existing .log files in the current directory
        for old in glob.glob("*.log"):
            try:
                os.remove(old)
                logger.info(f"Removed file: {old}")
            except Exception as e:
                logger.warning(f"Could not remove {old}: {e}")

        # Execute Zeek via Docker container
        cmd = [
            "docker", "exec",
            "-w", "/workspace",  # Работаем в монтированной директории
            "zeek-mcp-container",
            "zeek", "-C", "-r", f"/workspace/{pcap_filename}"
        ]
        
        logger.info(f"Running command: {' '.join(cmd)}")
        
        # Сначала проверяем, что контейнер запущен
        check_cmd = ["docker", "ps", "-f", "name=zeek-mcp-container", "-q"]
        check_result = subprocess.run(check_cmd, capture_output=True, text=True)
        
        if not check_result.stdout.strip():
            return "Error: zeek-mcp-container is not running. Start it with: docker-compose --profile zeek up -d"
        
        res = subprocess.run(cmd, check=False, capture_output=True, text=True, cwd=os.getcwd())
        
        logger.info(f"Zeek exit code: {res.returncode}")
        if res.stdout:
            logger.info(f"Zeek stdout: {res.stdout}")
        if res.stderr:
            logger.error(f"Zeek stderr: {res.stderr}")
        
        if res.returncode == 0:
            # Check for log files
            new_logs = glob.glob("*.log")
            if new_logs:
                logs_str = ", ".join(new_logs)
                logger.info(f"Generated log files: {logs_str}")
                return f"Generated the following files:\n{logs_str}"
            else:
                logger.warning("No .log files found after running Zeek.")
                return "No log files generated"
        else:
            error_msg = f"Zeek error: {res.stderr}" if res.stderr else f"Exit code {res.returncode}"
            logger.error(f"Zeek execution failed: {error_msg}")
            return f"Error: {error_msg}"
            
    except Exception as e:
        logger.error(f"Error running Zeek: {e}")
        return f"Execution error: {e}"

@mcp.tool()
def parselogs(logfile: str):
    """Parse a single log file"""
    return parse_zeek_log(logfile)

@mcp.tool()
def analyze_with_ai(pcap_path: str):
    """
    Запускает Zeek на PCAP файле и анализирует результаты через ИИ.
    """
    try:
        logger.info(f"Starting AI analysis for: {pcap_path}")
        
        # 1. Запускаем Zeek на PCAP
        zeek_result = execzeek(pcap_path)
        logger.info(f"Zeek execution completed: {zeek_result}")
        
        # 2. Парсим все созданные логи
        logs_text = parse_all_logs_as_str()
        logger.info(f"Parsed logs, length: {len(logs_text)}")
        
        # 3. Анализируем через GigaChat
        logger.info("Calling GigaChat analysis")
        ai_analysis = GigaChatService.analyze_security_logs(logs_text)
        logger.info("GigaChat analysis completed")
        
        return f"""
=== Zeek Analysis Complete ===

{zeek_result}

=== AI Security Analysis ===

{ai_analysis}
"""
        
    except Exception as e:
        logger.error(f"AI analysis error: {e}")
        return f"Ошибка при анализе с ИИ: {e}"

def main():
    parser = argparse.ArgumentParser(description="MCP server for mcp")
    parser.add_argument("--mcp-host", type=str, default="127.0.0.1",
                        help="Host to run MCP server on (only used for sse), default: 127.0.0.1")
    parser.add_argument("--mcp-port", type=int, default=8081,
                        help="Port to run MCP server on (only used for sse), default: 8081")
    parser.add_argument("--transport", type=str, default="sse", choices=["stdio", "sse"],
                        help="Transport protocol for MCP, default: sse")
    args = parser.parse_args()

    if args.transport == "sse":
        try:
            log_level = logging.INFO
            logging.basicConfig(level=log_level)
            logging.getLogger().setLevel(log_level)

            mcp.settings.log_level = "INFO"
            mcp.settings.host = args.mcp_host
            mcp.settings.port = args.mcp_port

            logger.info(f"Starting MCP server on http://{mcp.settings.host}:{mcp.settings.port}/sse")
            logger.info(f"Using transport: {args.transport}")

            mcp.run(transport="sse")
        except KeyboardInterrupt:
            logger.info("Server stopped by user")
    else:
        mcp.run()

if __name__ == "__main__":
    main()