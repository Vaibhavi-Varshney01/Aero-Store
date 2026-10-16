"""
Business Logic Tier (BLL) - Authentication & User Account Service
Provides secure PBKDF2 password hashing, bearer token issuance, role governance,
and user session management. Delegates persistence to Data Access Layer (UserRepository).
"""
import hashlib
import os
import secrets
import threading
from datetime import datetime, timezone, timedelta
from typing import Optional, Tuple
import jwt
from ...core.models import UserResponse
from ...core.error_model import DomainException
from ...core.config import settings
from ..tier4_dal.user_repository import user_repo, UserRepository



def parse_dt(val) -> datetime:
    if isinstance(val, datetime):
        return val
    return datetime.fromisoformat(str(val))


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class AuthService:
    """Domain service managing user identity, credential security, and role-based access."""

    def __init__(self, repository: Optional[UserRepository] = None):
        self._user_repo = repository or user_repo
        self._lock = threading.Lock()
        
        # Pre-seed demo accounts in data access layer
        self._seed_demo_users()

    def _hash_password(self, password: str, salt: Optional[bytes] = None) -> Tuple[str, str]:
        """Hashes password with PBKDF2-HMAC-SHA256 and 100,000 iterations."""
        if salt is None:
            salt = os.urandom(16)
        pwd_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
        return pwd_hash.hex(), salt.hex()

    def _verify_password(self, password: str, expected_hash: str, salt_hex: str) -> bool:
        """Constant-time comparison against stored PBKDF2 hash."""
        salt = bytes.fromhex(salt_hex)
        pwd_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
        return secrets.compare_digest(pwd_hash.hex(), expected_hash)

    def _seed_demo_users(self):
        """Pre-seeds demo accounts into the repository."""
        demo_accounts = [
            ("USER-1000", "Standard Customer", "customer@aerostore.io", "password123", "customer", 0),
            ("USER-1000-DEMO", "Standard Customer", "standard@example.com", "password123", "customer", 0),
            ("USER-1001", "Jane Doe", "vip@aerostore.io", "password123", "customer", 1),
            ("USER-1001-AERO", "Jane Doe", "jane.doe@example.com", "password123", "customer", 1),
            ("USER-1002", "System Admin", "admin@example.com", "admin123", "admin", 1),
            ("USER-1002-AERO", "System Admin", "admin@aerostore.io", "admin123", "admin", 1),
            ("USER-1003", "Delivery Partner John", "delivery@example.com", "delivery123", "delivery_partner", 0),
            ("USER-1003-AERO", "Delivery Driver John", "driver@aerostore.io", "driver123", "delivery_partner", 0),
            ("USER-1003-ALT", "Delivery Partner John", "delivery@aerostore.io", "delivery123", "delivery_partner", 0),
            ("USER-1004", "Warehouse Shipper Sam", "shipper@example.com", "shipper123", "shipper", 1),
            ("USER-1004-AERO", "Warehouse Shipper Sam", "shipper@aerostore.io", "shipper123", "shipper", 1),
        ]
        with self._lock:
            for user_id, name, email, raw_pwd, role, is_vip in demo_accounts:
                pwd_hash, salt_hex = self._hash_password(raw_pwd)
                self._user_repo.upsert_demo_user(
                    user_id=user_id,
                    name=name,
                    email=email,
                    password_hash=pwd_hash,
                    salt=salt_hex,
                    role=role,
                    is_vip=is_vip,
                    created_at=utc_now_iso()
                )

    def create_jwt_token(self, user_id: str, email: str, role: str, is_vip: bool) -> str:
        """Creates a signed JSON Web Token (JWT) with standard expiration and claims."""
        expire_minutes = getattr(settings.jwt, "access_token_expire_minutes", 1440)
        secret_key = getattr(settings.jwt, "secret_key", "aerostore-super-secure-jwt-secret-key-capgemini-2026")
        algorithm = getattr(settings.jwt, "algorithm", "HS256")

        now = datetime.now(timezone.utc)
        payload = {
            "sub": user_id,
            "email": email,
            "role": role,
            "is_vip": is_vip,
            "iat": int(now.timestamp()),
            "exp": int((now + timedelta(minutes=expire_minutes)).timestamp()),
            "jti": secrets.token_hex(16)
        }
        return jwt.encode(payload, secret_key, algorithm=algorithm)

    def decode_jwt_token(self, token: str) -> Optional[dict]:
        """Decodes and validates a JWT token signature and expiration."""
        secret_key = getattr(settings.jwt, "secret_key", "aerostore-super-secure-jwt-secret-key-capgemini-2026")
        algorithm = getattr(settings.jwt, "algorithm", "HS256")
        try:
            payload = jwt.decode(token, secret_key, algorithms=[algorithm])
            return payload
        except jwt.PyJWTError:
            return None

    def register(self, name: str, email: str, password: str, role: Optional[str] = "customer") -> Tuple[UserResponse, str]:
        """Registers a new user account and returns the profile with an active session token."""
        email_clean = email.strip().lower()
        if not name.strip():
            raise DomainException(
                error_code="INVALID_USER_NAME",
                title="Invalid Name",
                status=400,
                detail="Full name is required."
            )
        if len(password) < 6:
            raise DomainException(
                error_code="PASSWORD_TOO_SHORT",
                title="Password Too Short",
                status=400,
                detail="Password must be at least 6 characters."
            )

        # Validate Role
        valid_roles = {"customer", "admin", "delivery_partner"}
        clean_role = role.strip().lower() if (role and isinstance(role, str)) else "customer"
        if clean_role not in valid_roles:
            clean_role = "customer"

        with self._lock:
            # Check if email is already registered via DAL
            existing = self._user_repo.find_by_email(email_clean)
            if existing:
                raise DomainException(
                    error_code="EMAIL_ALREADY_REGISTERED",
                    title="User Registration Conflict",
                    status=409,
                    detail=f"An account with email '{email_clean}' is already registered."
                )

            pwd_hash, salt_hex = self._hash_password(password)
            user_id = f"USER-{secrets.randbelow(8999) + 1000}"
            now_str = utc_now_iso()

            self._user_repo.create_user(
                user_id=user_id,
                name=name.strip(),
                email=email_clean,
                password_hash=pwd_hash,
                salt=salt_hex,
                role=clean_role,
                is_vip=0,
                created_at=now_str
            )

            token = self.create_jwt_token(user_id=user_id, email=email_clean, role=clean_role, is_vip=False)
            self._user_repo.create_session(token=token, user_id=user_id, created_at=now_str)

            user_resp = UserResponse(
                id=user_id,
                name=name.strip(),
                email=email_clean,
                role=clean_role,
                is_vip=False,
                created_at=datetime.fromisoformat(now_str)
            )
            return user_resp, token

    def login(self, email: str, password: str) -> Tuple[UserResponse, str]:
        """Authenticates user credentials and issues a secure signed JWT access token."""
        email_clean = email.strip().lower()
        with self._lock:
            row = self._user_repo.find_by_email(email_clean)

            if not row or not self._verify_password(password, row["password_hash"], row["salt"]):
                raise DomainException(
                    error_code="INVALID_CREDENTIALS",
                    title="Authentication Failed",
                    status=401,
                    detail="Invalid email or password. Please verify your credentials."
                )

            now_str = utc_now_iso()
            self._user_repo.update_last_login(user_id=row["id"], last_login=now_str)

            token = self.create_jwt_token(
                user_id=row["id"],
                email=row["email"],
                role=row["role"],
                is_vip=bool(row["is_vip"])
            )
            self._user_repo.create_session(token=token, user_id=row["id"], created_at=now_str)

            user_resp = UserResponse(
                id=row["id"],
                name=row["name"],
                email=row["email"],
                role=row["role"],
                is_vip=bool(row["is_vip"]),
                created_at=parse_dt(row["created_at"])
            )
            return user_resp, token

    def get_user_by_token(self, token: str) -> Optional[UserResponse]:
        """Validates a JWT token or session bearer token and returns the authenticated user profile."""
        with self._lock:
            # 1. Try decoding as JWT
            payload = self.decode_jwt_token(token)
            if payload and "sub" in payload:
                # Validate that session hasn't been revoked/logged out
                session_user = self._user_repo.find_by_token(token)
                if session_user:
                    user_row = self._user_repo.find_by_id(payload["sub"]) if hasattr(self._user_repo, "find_by_id") else session_user
                    if user_row:
                        return UserResponse(
                            id=user_row["id"],
                            name=user_row["name"],
                            email=user_row["email"],
                            role=user_row["role"],
                            is_vip=bool(user_row["is_vip"]),
                            created_at=parse_dt(user_row["created_at"])
                        )

            # 2. Fallback to direct token lookup in database
            row = self._user_repo.find_by_token(token)
            if not row:
                return None

            return UserResponse(
                id=row["id"],
                name=row["name"],
                email=row["email"],
                role=row["role"],
                is_vip=bool(row["is_vip"]),
                created_at=parse_dt(row["created_at"])
            )

    def get_user_by_id(self, user_id: str) -> Optional[UserResponse]:
        """Retrieves a user profile by their ID via Data Access Layer."""
        with self._lock:
            row = self._user_repo.find_by_id(user_id)
            if not row:
                return None
            return UserResponse(
                id=row["id"],
                name=row["name"],
                email=row["email"],
                role=row["role"],
                is_vip=bool(row["is_vip"]),
                created_at=parse_dt(row["created_at"])
            )

    def get_user_by_email(self, email: str) -> Optional[UserResponse]:
        """Retrieves a user profile by their email via Data Access Layer."""
        with self._lock:
            row = self._user_repo.find_by_email(email)
            if not row:
                return None
            return UserResponse(
                id=row["id"],
                name=row["name"],
                email=row["email"],
                role=row["role"],
                is_vip=bool(row["is_vip"]),
                created_at=parse_dt(row["created_at"])
            )

    def upgrade_to_vip(self, user_id: str) -> Tuple[UserResponse, str]:
        """Upgrades a customer to VIP subscriber and re-issues refreshed JWT."""
        with self._lock:
            self._user_repo.upgrade_to_vip(user_id)
            row = self._user_repo.find_by_id(user_id)
            if not row:
                raise DomainException(
                    error_code="USER_NOT_FOUND",
                    title="User Not Found",
                    status=404,
                    detail=f"User '{user_id}' could not be located."
                )

            token = self.create_jwt_token(
                user_id=row["id"],
                email=row["email"],
                role=row["role"],
                is_vip=True
            )
            now_str = utc_now_iso()
            self._user_repo.create_session(token=token, user_id=row["id"], created_at=now_str)

            user_resp = UserResponse(
                id=row["id"],
                name=row["name"],
                email=row["email"],
                role=row["role"],
                is_vip=True,
                created_at=parse_dt(row["created_at"])
            )
            return user_resp, token

    def logout(self, token: str) -> bool:
        """Revokes an active session token via Data Access Layer."""
        with self._lock:
            return self._user_repo.delete_session(token)


# Singleton service instance
auth_service = AuthService()
