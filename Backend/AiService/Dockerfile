FROM python:3.10-slim

# Установка зависимостей системы для компиляции некоторых пакетов
RUN apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Установка рабочей директории
WORKDIR /app

# Копируем файл зависимостей
COPY requirements.txt .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt --timeout=300

# Копируем остальной код
COPY . .

# Открываем порт
EXPOSE 5004

# Запускаем uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5004"]
