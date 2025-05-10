FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app


# Выполняем миграции при старте
CMD flask db upgrade && python main.py --host=0.0.0.0 --port=5001
