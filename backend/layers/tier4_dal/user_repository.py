"""
Data Access Layer (DAL) - User Repository
Encapsulates all persistence, queries, and session management
for customer, admin, and courier accounts in Microsoft SQL Server (SSMS).
"""
import threading
from typing import Optional, Dict, Any, List
from .base_repository import BaseRepository


class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__()
        self._lock = threading.Lock()

    def find_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Retrieves a user account record by their unique email."""
        with self._lock:
            with self.transaction() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT id, name, email, password_hash, salt, role, is_vip, created_at
                    FROM users
                    WHERE email = ?
                """, (email.strip().lower(),))
                row = cursor.fetchone()
                if not row:
                    return None
                return dict(row)

    def find_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a user account record by their unique ID."""
        with self._lock:
            with self.transaction() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT id, name, email, password_hash, salt, role, is_vip, created_at
                    FROM users
                    WHERE id = ?
                """, (user_id,))
                row = cursor.fetchone()
                if not row:
                    return None
                return dict(row)

    def find_by_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Finds user associated with an active bearer session token."""
        with self._lock:
            with self.transaction() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT u.id, u.name, u.email, u.role, u.is_vip, u.created_at
                    FROM users u
                    JOIN sessions s ON u.id = s.user_id
                    WHERE s.token = ?
                """, (token,))
                row = cursor.fetchone()
                if not row:
                    return None
                return dict(row)

    def create_user(
        self,
        user_id: str,
        name: str,
        email: str,
        password_hash: str,
        salt: str,
        role: str,
        is_vip: int,
        created_at: str
    ) -> Dict[str, Any]:
        """Inserts a new user record into the database."""
        with self._lock:
            with self.transaction() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO users (id, name, email, password_hash, salt, role, is_vip, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    user_id,
                    name.strip(),
                    email.strip().lower(),
                    password_hash,
                    salt,
                    role,
                    is_vip,
                    created_at
                ))
        return {
            "id": user_id,
            "name": name,
            "email": email,
            "role": role,
            "is_vip": is_vip,
            "created_at": created_at
        }

    def upsert_demo_user(
        self,
        user_id: str,
        name: str,
        email: str,
        password_hash: str,
        salt: str,
        role: str,
        is_vip: int,
        created_at: str
    ):
        """Pre-seeds demo account credentials into the users table."""
        with self._lock:
            with self.transaction() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT id FROM users WHERE email = ? OR id = ?", (email, user_id))
                row = cursor.fetchone()
                if not row:
                    cursor.execute("""
                        INSERT INTO users (id, name, email, password_hash, salt, role, is_vip, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (user_id, name, email, password_hash, salt, role, is_vip, created_at))
                else:
                    cursor.execute("""
                        UPDATE users SET name = ?, email = ?, password_hash = ?, salt = ?, role = ?, is_vip = ? WHERE id = ?
                    """, (name, email, password_hash, salt, role, is_vip, row["id"]))

    def update_last_login(self, user_id: str, last_login: str):
        """Updates the last login timestamp for a user."""
        with self._lock:
            with self.transaction() as conn:
                cursor = conn.cursor()
                cursor.execute("UPDATE users SET last_login = ? WHERE id = ?", (last_login, user_id))

    def upgrade_to_vip(self, user_id: str) -> bool:
        """Upgrades an existing user to VIP subscriber status."""
        with self._lock:
            with self.transaction() as conn:
                cursor = conn.cursor()
                cursor.execute("UPDATE users SET is_vip = 1 WHERE id = ?", (user_id,))
                return cursor.rowcount > 0

    def create_session(self, token: str, user_id: str, created_at: str):
        """Records a new bearer session token."""
        with self._lock:
            with self.transaction() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO sessions (token, user_id, created_at)
                    VALUES (?, ?, ?)
                """, (token, user_id, created_at))

    def delete_session(self, token: str) -> bool:
        """Revokes a bearer session token upon logout."""
        with self._lock:
            with self.transaction() as conn:
                cursor = conn.cursor()
                cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
                return cursor.rowcount > 0


user_repo = UserRepository()
