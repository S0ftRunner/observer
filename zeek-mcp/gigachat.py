import os
import requests
from gigachat import GigaChat

# Configure GIGACHAT

GIGACHAT_API_KEY = os.getenv("GIGACHAT_API_KEY")

GIGACHAT_ACCESS_TOKEN_URL = os.getenv("GIGACHAT_ACCESS_TOKEN_URL")

GIGACHAT_SCOPE = os.getenv("GIGACHAT_SCOPE")

GIGACHAT_TEXT_GENERATION = os.getenv("GIGACHAT_TEXT_GENERATION")

class GigaChatService: 
  def __init__(self):
    self.giga = GigaChat(GIGACHAT_API_KEY)
    self.access_token = self.giga.get_token()

  def analyze_security_logs(self, zeek_data: str):
    """Анализируем логи zeek через GigaChat"""

