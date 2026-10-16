"""
Data Access Layer (DAL) - Base Repository
Provides foundational database connection contexts, transaction lifecycle governance,
and common query execution patterns for Microsoft SQL Server (SSMS).
"""
import logging
from typing import Generator, Any, List, Optional, Tuple
from contextlib import contextmanager
from ..tier5_database.database import get_db, DB_PATH, DictRow

logger = logging.getLogger("aerostore.dal")


class BaseRepository:
    """
    Abstract Base Repository encapsulating database interaction,
    transaction boundary control, and query error handling.
    """

    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path

    @contextmanager
    def transaction(self) -> Generator[Any, None, None]:
        """
        Provides an active database transaction context manager.
        Automatically commits on successful block execution, rolls back on exception.
        """
        with get_db(self.db_path) as conn:
            yield conn

    def execute_query(self, query: str, params: Tuple = ()) -> List[DictRow]:
        """
        Executes a read query and returns all result rows as dictionary-like objects.
        """
        with self.transaction() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            return cursor.fetchall()

    def execute_scalar(self, query: str, params: Tuple = ()) -> Optional[Any]:
        """
        Executes a query returning a single scalar value.
        """
        with self.transaction() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            row = cursor.fetchone()
            if row:
                return row[0]
            return None

    def execute_non_query(self, query: str, params: Tuple = ()) -> int:
        """
        Executes an INSERT/UPDATE/DELETE statement and returns the affected row count.
        """
        with self.transaction() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            return cursor.rowcount
