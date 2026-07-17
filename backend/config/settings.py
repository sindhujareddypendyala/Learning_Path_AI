import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Centralized configuration management for LearnPath-AI.
    Validates and loads environment variables cleanly with strict typing.
    """

    # Application Core Settings
    PROJECT_NAME: str = "LearnPath-AI"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False

    # Security & Authentication
    SECRET_KEY: str = "CHANGE_THIS_SUPER_SECRET_KEY_IN_PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Relational Database (SQLite by default as per architecture)
    _base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    _db_path = os.path.join(_base_dir, 'database', 'sqlite.db').replace("\\", "/")
    DATABASE_URL: str = f"sqlite:///{_db_path}"

    # AI Agents & Vector DB Settings
    GROQ_API_KEY: str = ""
    CHROMA_DB_DIR: str = os.path.join(_base_dir, 'database', 'chroma_db').replace("\\", "/")
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"

    # Pydantic v2 configuration for loading the .env file
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    """
    Dependency injection for configuration settings.
    Uses lru_cache to ensure settings are parsed from the .env file exactly once,
    preventing disk I/O overhead on every request.
    """
    return Settings()

settings = get_settings()

