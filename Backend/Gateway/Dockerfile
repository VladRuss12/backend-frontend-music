FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt


COPY . .

ENV FLASK_APP=gateway.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5005
ENV FLASK_ENV=development

EXPOSE 5005

CMD ["flask", "run"]
