FROM python:3.10-slim

WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь проект
COPY . .

# Устанавливаем переменные окружения
ENV FLASK_APP=main:create_app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5001
ENV FLASK_ENV=development

EXPOSE 5001

# Выполняем миграции и запускаем приложение
CMD flask db upgrade && flask seed && flask run --host=0.0.0.0 --port=5001