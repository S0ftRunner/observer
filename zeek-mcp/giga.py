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
                Ты специалист по анализу сетевой безопасности.
                Тебе предоставлены журналы сетевого трафика, сгенерированные системой Zeek.

                Задачи анализа:
                1. Выявить подозрительную или аномальную сетевую активность
                2. Определить потенциальные угрозы безопасности
                3. Кратко описать характер обнаруженных аномалий
                4. Сформировать рекомендации по реагированию

                Данные для анализа (фрагмент логов Zeek):
                {zeek_data[:8000]}

                Требования к ответу:

                1. Сначала выведи краткое текстовое резюме (не более 5–7 предложений).
                2. Затем выведи СТРОГО валидный JSON без комментариев и пояснений.
                3. JSON должен иметь следующий формат:

                {{
                    "Danger": number,          // целое число от 0 до 100
                     "IPs": [string]            // массив уникальных IP-адресов, связанных с аномальной активностью
                }}

                Дополнительные правила:
                - Не добавляй текст до или после JSON.
                - Если аномалий не обнаружено, Danger = 0, IPs = [].
            """

            
            response = giga.chat(prompt)
            return response.choices[0].message.content
            
        except Exception as e:
            return f"Ошибка при анализе GigaChat: {str(e)}"