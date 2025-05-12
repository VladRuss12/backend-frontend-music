FROM python:3.10-slim

WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь проект
COPY . /app

# Устанавливаем переменные окружения
ENV FLASK_APP=app

EXPOSE 5001

# Выполняем миграции и запускаем приложение
CMD ["sh", "-c", "flask db upgrade && flask seed && python main.py"]
