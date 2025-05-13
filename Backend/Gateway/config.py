from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    class Config:
        env_file = ".env"


SERVICE_MAP = {
    '/users': 'http://localhost:5001',
    '/music': 'http://localhost:5002',
    '/recommendations': 'http://localhost:5003',
    '/chat': 'http://localhost:5004'
}

'''SERVICE_MAP = {
    '/users': 'http://user-service:5001',
    '/music': 'http://music-service:5002',
    '/recommendations': 'http://recommendation-service:5003',
    '/chat': 'http://chat-service:5004'
}'''

@lru_cache()
def get_settings() -> Settings:
    return Settings()
