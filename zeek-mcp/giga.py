import os
from gigachat import GigaChat
from dotenv import load_dotenv  


load_dotenv()

# Configure GIGACHAT
GIGACHAT_API_KEY = os.getenv("GIGACHAT_API_KEY")
GIGACHAT_ACCESS_TOKEN_URL = os.getenv("GIGACHAT_ACCESS_TOKEN_URL")
GIGACHAT_SCOPE = os.getenv("GIGACHAT_SCOPE")
GIGACHAT_TEXT_GENERATION = os.getenv("GIGACHAT_TEXT_GENERATION")


class GigaChatService: 
    @staticmethod
    def analyze_security_logs(zeek_data: str):
        """Анализируем логи zeek через GigaChat"""
        
        # Для отладки проверим, загрузились ли переменные
        print(f"GIGACHAT_API_KEY exists: {bool(os.getenv('GIGACHAT_API_KEY'))}")
        print(f"All env vars: {[k for k in os.environ if 'GIGA' in k]}")
        
        credentials = os.getenv("GIGACHAT_API_KEY")
        print(credentials)
        if not credentials:
            return "Ошибка: GIGACHAT_API_KEY не установлен"
        
        try:
            # Инициализируем GigaChat с credentials
            giga = GigaChat(credentials=credentials, verify_ssl_certs=False)
            
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
            
            response = giga.chat(prompt)
            return response.choices[0].message.content
            
        except Exception as e:
            return f"Ошибка при анализе GigaChat: {str(e)}"