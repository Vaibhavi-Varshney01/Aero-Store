"""
Tier 5: Database Tier (Persistence & Storage Layer) - Connection Manager
AeroStore Dedicated SSMS (Microsoft SQL Server) Database Management Module
Enforces complete segregation of data persistence strictly into SSMS / Microsoft SQL Server.
"""
import os
import logging
from typing import Generator, Any
from contextlib import contextmanager
from datetime import datetime
from ...core.config import settings

logger = logging.getLogger("aerostore.db")

def parse_dt(val) -> datetime:
    """Parse a datetime string or datetime object to a datetime instance."""
    if isinstance(val, datetime):
        return val
    return datetime.fromisoformat(str(val))


# Base directory & SQL script path for SSMS initialization
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DB_PATH = ""
SQL_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), "ssms_schema_and_seed.sql")
if not os.path.exists(SQL_SCRIPT_PATH):
    SQL_SCRIPT_PATH = os.path.join(BASE_DIR, "sql", "ssms_schema_and_seed.sql")

_mssql_initialized = False

class DictRow(dict):
    """Row wrapper providing both dictionary key indexing row['col'] and positional indexing row[0]."""
    def __getitem__(self, key):
        if isinstance(key, int):
            return list(self.values())[key]
        return super().__getitem__(key)

class MSSQLCursorWrapper:
    def __init__(self, raw_cursor):
        self._cursor = raw_cursor

    def execute(self, query: str, params=()):
        if params is None:
            params = ()
        return self._cursor.execute(query, params)

    def fetchone(self):
        row = self._cursor.fetchone()
        if row is None:
            return None
        cols = [column[0] for column in self._cursor.description]
        return DictRow(zip(cols, row))

    def fetchall(self):
        rows = self._cursor.fetchall()
        if not rows:
            return []
        cols = [column[0] for column in self._cursor.description]
        return [DictRow(zip(cols, r)) for r in rows]

    @property
    def rowcount(self):
        return self._cursor.rowcount

class MSSQLConnectionWrapper:
    def __init__(self, raw_conn):
        self._conn = raw_conn

    def cursor(self):
        return MSSQLCursorWrapper(self._conn.cursor())

    def commit(self):
        self._conn.commit()

    def rollback(self):
        self._conn.rollback()

    def close(self):
        self._conn.close()

def build_mssql_connection_string(database: str = None) -> str:
    """Builds explicit ODBC connection string for SSMS / MS SQL Server."""
    db_cfg = settings.db
    driver = db_cfg.mssql_driver
    server = db_cfg.mssql_server
    target_db = database or db_cfg.mssql_database
    
    if db_cfg.mssql_trusted_connection:
        return f"DRIVER={{{driver}}};SERVER={server};DATABASE={target_db};Trusted_Connection=yes;TrustServerCertificate=yes;"
    else:
        return f"DRIVER={{{driver}}};SERVER={server};DATABASE={target_db};UID={db_cfg.mssql_user};PWD={db_cfg.mssql_password};TrustServerCertificate=yes;"

def auto_init_mssql_db():
    """Automatically ensures AeroStoreDB database and tables exist in SSMS SQL Server instance."""
    global _mssql_initialized
    if _mssql_initialized:
        return

    import pyodbc
    target_db = settings.db.mssql_database
    
    # 1. Connect to master and ensure AeroStoreDB exists
    try:
        master_conn_str = build_mssql_connection_string(database="master")
        with pyodbc.connect(master_conn_str, autocommit=True) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sys.databases WHERE name = ?", (target_db,))
            if not cursor.fetchone():
                cursor.execute(f"CREATE DATABASE [{target_db}]")
                logger.info(f"[SSMS DEDICATED DB] Created database [{target_db}] on SQL Server.")
    except Exception as e:
        logger.warning(f"[SSMS INIT] Master connection status: {e}")

    # 2. Ensure Schema and Seed Data in AeroStoreDB
    try:
        db_conn_str = build_mssql_connection_string(database=target_db)
        with pyodbc.connect(db_conn_str, autocommit=True) as conn:
            cursor = conn.cursor()
            if os.path.exists(SQL_SCRIPT_PATH):
                with open(SQL_SCRIPT_PATH, "r", encoding="utf-8") as f:
                    sql_content = f.read()
                
                # Split T-SQL batches by GO statements
                batches = [b.strip() for b in sql_content.split("GO") if b.strip()]
                for batch in batches:
                    if "CREATE DATABASE" in batch.upper() or "USE " in batch.upper():
                        continue
                    try:
                        cursor.execute(batch)
                    except Exception:
                        pass
        _mssql_initialized = True
        logger.info(f"[SSMS DEDICATED DB] Segregated SSMS database [{target_db}] active and synchronized.")
    except Exception as e:
        logger.error(f"[SSMS ERROR] Dedicated SSMS database initialization failed: {e}")

@contextmanager
def get_db(db_path: str = None) -> Generator[Any, None, None]:
    """
    Context manager providing strict SSMS (Microsoft SQL Server) connection.
    Segregates all database operations exclusively to SSMS.
    """
    import pyodbc
    auto_init_mssql_db()
    
    conn_str = build_mssql_connection_string()
    try:
        raw_conn = pyodbc.connect(conn_str, autocommit=False, timeout=5)
    except Exception as err:
        logger.error(f"[SSMS FATAL ERROR] Failed to connect to dedicated SSMS SQL Server: {err}")
        raise RuntimeError(
            f"Dedicated SSMS Database Connection Failed. Please ensure SSMS / SQL Server instance '{settings.db.mssql_server}' is running. Details: {err}"
        ) from err

    conn = MSSQLConnectionWrapper(raw_conn)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
