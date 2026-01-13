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
        self.read_stream = None
        self.write_stream = None
        self.sse_context = None
    
    async def start_session(self):
        """Запускает MCP сессию через SSE и сохраняет её"""
        try:
            if self.session is not None:
                return  # Сессия уже запущена
                
            # Сохраняем контекстные менеджеры как атрибуты класса
            self.sse_context = sse_client("http://localhost:8081/sse")
            self.read_stream, self.write_stream = await self.sse_context.__aenter__()
            
            session_context = ClientSession(self.read_stream, self.write_stream)
            self.session = await session_context.__aenter__()
            
            await self.session.initialize()
            logger.info("MCP SSE session started successfully")
            
        except Exception as e:
            logger.error(f"Failed to start MCP SSE session: {e}")
            # Очищаем ресурсы в случае ошибки
            await self.close_session()
            raise
    
    async def close_session(self):
        """Закрывает MCP сессию"""
        try:
            if self.session:
                await self.session.__aexit__(None, None, None)
                self.session = None
            
            if self.sse_context:
                await self.sse_context.__aexit__(None, None, None)
                self.sse_context = None
                self.read_stream = None
                self.write_stream = None
                
            logger.info("MCP session closed")
        except Exception as e:
            logger.error(f"Error closing MCP session: {e}")
    
    async def analyze_pcap(self, pcap_path: str) -> str:
        """Вызывает analyze_with_ai инструмент из MCP сервера"""
        try:
            # Убеждаемся, что сессия активна
            if not self.session:
                await self.start_session()
            
            logger.info(f"Calling MCP tool 'analyze_with_ai' with path: {pcap_path}")
            
            # Используем абсолютный путь к файлу
            absolute_path = os.path.abspath(pcap_path)
            
            result = await self.session.call_tool(
                "analyze_with_ai",
                {"pcap_path": absolute_path}
            )
            
            logger.info("MCP tool executed successfully")
            return result.content
            
        except Exception as e:
            logger.error(f"Error in analyze_pcap: {str(e)}", exc_info=True)
            # При ошибке закрываем сессию и пробуем переподключиться
            await self.close_session()
            return f"Error analyzing PCAP: {str(e)}"

# Глобальный клиент MCP
mcp_client = MCPClient()

@app.on_event("startup")
async def startup_event():
    """Запускаем MCP клиент при старте сервера"""
    try:
        await mcp_client.start_session()
    except Exception as e:
        logger.error(f"Failed to start MCP client on startup: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Закрываем MCP сессию при завершении работы сервера"""
    await mcp_client.close_session()

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
    
    # Создаем временную директорию для PCAP файлов
    temp_dir = tempfile.mkdtemp()
    pcap_path = os.path.join(temp_dir, file.filename)
    
    try:
        # Сохраняем файл
        content = await file.read()
        with open(pcap_path, "wb") as f:
            f.write(content)
        
        # Анализируем через MCP сервер
        logger.info(f"Analyzing PCAP file: {file.filename}")
        logger.info(f"pcap path: {pcap_path}")
        
        analysis_result = await mcp_client.analyze_pcap(pcap_path)
        
        return {
            "status": "success",
            "filename": file.filename,
            "analysis": analysis_result
        }
        
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(500, f"Analysis failed: {e}")
    finally:
        # Удаляем временную директорию и файл
        try:
            import shutil
            shutil.rmtree(temp_dir, ignore_errors=True)
        except Exception as e:
            logger.warning(f"Failed to clean up temp directory: {e}")

@app.get("/health")
async def health_check():
    """Проверка статуса сервера"""
    return {
        "status": "healthy", 
        "mcp_connected": mcp_client.session is not None
    }

@app.post("/reconnect-mcp")
async def reconnect_mcp():
    """Переподключает MCP клиент"""
    try:
        await mcp_client.close_session()
        await mcp_client.start_session()
        return {"status": "success", "message": "MCP client reconnected"}
    except Exception as e:
        return {"status": "error", "message": f"Reconnection failed: {e}"}

if __name__ == "__main__":
    uvicorn.run(
        "web_server:app",
        host="0.0.0.0",
        port=3002,
        reload=True
    )