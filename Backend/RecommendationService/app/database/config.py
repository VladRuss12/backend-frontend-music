import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://postgres:1111@localhost:5432/recommendation_service_db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False