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

    prompt = f"""
        Ты эксперт по кибербезопасности. Проанализируй эти логи Zeek и выдели:

        1. Подозрительную сетевую активность
        2. Потенциальные угрозы безопасности  
        3. Аномалии в трафике
        4. Рекомендации по реагированию

        Логи для анализа:
        {zeek_data[:8000]}  # Ограничиваем объем

        Ответь структурированно и кратко.

        Также сформируй ответ в виде JSON, который будет содержать:
        {{
          "Danger": "от 0 до 100%",
          "IPs": "уникальные IP в файле"
        }}
        """
    response = self.giga.chat(prompt)

    return response.choices[0].message.content
