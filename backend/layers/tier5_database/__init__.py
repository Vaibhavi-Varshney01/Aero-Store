"""
Tier 5: Database Tier (Persistence & Storage Layer)
Provides dedicated Microsoft SQL Server (SSMS) database connectivity,
schema initialization, connection strings, and T-SQL seed scripts.
"""
from .database import (
    get_db,
    auto_init_mssql_db,
    build_mssql_connection_string,
    DictRow,
    DB_PATH,
    SQL_SCRIPT_PATH
)

__all__ = [
    "get_db",
    "auto_init_mssql_db",
    "build_mssql_connection_string",
    "DictRow",
    "DB_PATH",
    "SQL_SCRIPT_PATH"
]
