from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    HUGGINGFACE_API_KEY: str

    HUGGINGFACE_EMBEDDING_MODEL: str = (
        "sentence-transformers/all-MiniLM-L6-v2"
    )

    MISTRAL_API_KEY: str
    MISTRAL_MODEL: str

    QDRANT_URL: str
    QDRANT_API_KEY: str

    MONGODB_URI: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()