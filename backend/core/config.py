"""
Application Configuration & GenAI Settings
Supports live connection to Capgemini Generative Engine / OpenAI or local deterministic fallback.
"""
import os
from pydantic import BaseModel

class OpenAiSettings(BaseModel):
    base_url: str = os.getenv(
        "GENAI_BASE_URL", 
        "https://openai.generative.engine.capgemini.com/v1"
    )
    api_key: str = os.getenv(
        "GENAI_API_KEY", 
        "sk-ZsqmoW4CibgnRYUJa2olrg"
    )
    model: str = os.getenv("GENAI_MODEL", "openai.gpt-4o")
    timeout_seconds: float = 12.0
    temperature: float = 0.2
    max_tokens: int = 2048

class DatabaseSettings(BaseModel):
    engine: str = os.getenv("DB_ENGINE", "mssql")  # Explicitly defaults to SSMS / MS SQL Server ('mssql')
    sqlite_db_path: str = os.getenv("SQLITE_DB_PATH", "")
    
    # MSSQL / SSMS Configuration
    mssql_server: str = os.getenv("MSSQL_SERVER", r"localhost\SQLEXPRESS")
    mssql_database: str = os.getenv("MSSQL_DATABASE", "AeroStoreDB")
    mssql_driver: str = os.getenv("MSSQL_DRIVER", "ODBC Driver 18 for SQL Server")
    mssql_trusted_connection: bool = os.getenv("MSSQL_TRUSTED_CONNECTION", "true").lower() in ("true", "1", "yes")
    mssql_user: str = os.getenv("MSSQL_USER", "sa")
    mssql_password: str = os.getenv("MSSQL_PASSWORD", "")


class JwtSettings(BaseModel):
    secret_key: str = os.getenv("JWT_SECRET_KEY", "aerostore-super-secure-jwt-secret-key-capgemini-2026")
    algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 hours


class RagSettings(BaseModel):
    chunk_size: int = int(os.getenv("RAG_CHUNK_SIZE", "500"))
    chunk_overlap: int = int(os.getenv("RAG_CHUNK_OVERLAP", "100"))
    top_k: int = int(os.getenv("RAG_TOP_K", "4"))
    similarity_threshold: float = float(os.getenv("RAG_SIMILARITY_THRESHOLD", "0.10"))
    embedding_model: str = os.getenv("RAG_EMBEDDING_MODEL", "text-embedding-3-small")
    llm_model: str = os.getenv("RAG_LLM_MODEL", "openai.gpt-4o")
    rate_limit_per_minute: int = int(os.getenv("RAG_RATE_LIMIT_PER_MIN", "30"))
    storage_dir: str = os.getenv("RAG_STORAGE_DIR", "data/rag_storage")

class AppSettings(BaseModel):
    app_name: str = "Enterprise E-Commerce AI Platform"
    version: str = "1.0.0"
    host: str = "127.0.0.1"
    port: int = 8000
    debug: bool = True
    
    # Business Logic Rules
    max_cart_item_quantity: int = 99
    payment_sla_timeout_ms: int = 1500
    currency: str = "USD"
    
    # Database Settings
    db: DatabaseSettings = DatabaseSettings()
    
    # GenAI Settings
    openai: OpenAiSettings = OpenAiSettings()

    # JWT Authentication Settings
    jwt: JwtSettings = JwtSettings()

    # RAG Settings
    rag: RagSettings = RagSettings()

settings = AppSettings()

