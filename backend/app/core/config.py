from typing import Any, Dict, List, Optional
from pydantic import AnyHttpUrl, DirectoryPath
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Book Store"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "your-secret-key-here"  # Replace in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database settings
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "bookstore"
    POSTGRES_PORT: str = "5432"
    DATABASE_URI: Optional[str] = None

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.DATABASE_URI:
            return self.DATABASE_URI
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # Upload settings
    UPLOAD_DIR: DirectoryPath = "uploads"
    MAX_UPLOAD_SIZE: int = 5_242_880  # 5MB

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()