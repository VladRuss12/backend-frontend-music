FROM python:3.10-slim

WORKDIR /app

# Устанавливаем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем миграции (для кэширования Docker-слоёв)
COPY alembic.ini .
COPY migrations ./migrations

# Копируем остальной код проекта
COPY . .

# Устанавливаем переменные окружения для Flask
ENV FLASK_APP=main.py
ENV FLASK_RUN_PORT=5003
ENV FLASK_ENV=development

# Открываем порт
EXPOSE 5003

# Выполняем миграции и запускаем приложение
CMD ["sh", "-c", "sleep 30 && flask db upgrade && flask seed && python main.py"]
