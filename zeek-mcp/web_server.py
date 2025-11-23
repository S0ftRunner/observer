from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import tempfile
import os
import asyncio
from mcp import ClientSession
from mcp.client.sse import sse_client
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Zeek MCP API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MCPClient:
    def __init__(self):
        self.session = None
    
    async def start_session(self):
        """Запускает MCP сессию через SSE"""
        try:
            # Подключаемся к SSE серверу на порту 8081
            async with sse_client("http://localhost:8081/sse") as (read, write):
                async with ClientSession(read, write) as session:
                    await session.initialize()
                    self.session = session
                    logger.info("MCP SSE session started successfully")
                    
        except Exception as e:
            logger.error(f"Failed to start MCP SSE session: {e}")
            raise
    
    async def analyze_pcap(self, pcap_path: str) -> str:
        """Вызывает analyze_with_ai инструмент из MCP сервера"""
        if not self.session:
            await self.start_session()
        
        result = await self.session.call_tool(
            "analyze_with_ai",
            {"pcap_path": pcap_path}
        )
        return result.content

# Глобальный клиент MCP
mcp_client = MCPClient()

@app.on_event("startup")
async def startup_event():
    """Запускаем MCP клиент при старте сервера"""
    await mcp_client.start_session()

@app.get("/")
async def root():
    return {"message": "Zeek MCP API Server", "status": "running"}

@app.post("/analyze-pcap")
async def analyze_pcap(file: UploadFile = File(...)):
    """
    Загружает PCAP файл и анализирует его через MCP сервер
    """
    # Проверяем расширение файла
    if not file.filename.endswith(('.pcap', '.pcapng')):
        raise HTTPException(400, "File must be .pcap or .pcapng")
    
    # Сохраняем временный файл
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pcap") as tmp_file:
        content = await file.read()
        tmp_file.write(content)
        pcap_path = tmp_file.name
    
    try:
        # Анализируем через MCP сервер
        logger.info(f"Analyzing PCAP file: {file.filename}")
        analysis_result = await mcp_client.analyze_pcap(pcap_path)
        
        return {
            "status": "success",
            "filename": file.filename,
            "analysis": analysis_result
        }
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(500, f"Analysis failed: {str(e)}")
    finally:
        # Удаляем временный файл
        try:
            os.unlink(pcap_path)
        except:
            pass

@app.get("/health")
async def health_check():
    """Проверка статуса сервера"""
    return {
        "status": "healthy", 
        "mcp_connected": mcp_client.session is not None
    }

if __name__ == "__main__":
    uvicorn.run(
        "web_server:app",
        host="0.0.0.0",
        port=3002,
        reload=True
    )