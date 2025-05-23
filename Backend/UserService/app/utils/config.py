from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    JWT_TOKEN_LOCATION: List[str] = Field(default_factory=lambda: ['headers'])

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
