"""Application configuration settings."""

from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    FRONTEND_URL: str = "http://localhost:5173"
    ENVIRONMENT: str = "development"
    PROJECT_NAME: str = "WanderWise AI API"
    API_V1_STR: str = "/api"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Return cached instance of application settings."""
    return Settings()


settings = get_settings()
