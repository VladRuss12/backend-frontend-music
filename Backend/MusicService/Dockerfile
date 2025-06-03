FROM python:3.10-slim

WORKDIR /app

# Устанавливаем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем миграции (чтобы кэшировалось)
COPY alembic.ini .
COPY migrations ./migrations

COPY . .

# Устанавливаем переменные окружения для Flask
ENV FLASK_APP=main:create_app
ENV FLASK_RUN_PORT=5002
ENV FLASK_ENV=development

# Открываем порт
EXPOSE 5002

# Выполняем миграции через Flask и запускаем приложение
CMD flask db upgrade && flask seed && flask run --host=0.0.0.0 --port=5002