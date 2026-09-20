"""Core Application Configuration Settings."""

from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Face Attendance AI API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    # CORS origins permitted to interact with the backend
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # Model and artifact paths
    EMBEDDINGS_FILE_PATH: str = "ai/data/embeddings/known_embeddings.pkl"
    KNOWN_FACES_DIR: str = "ai/data/known_faces"

    class Config:
        case_sensitive = True


settings = Settings()
