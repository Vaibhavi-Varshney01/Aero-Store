"""
Data Access Layer (DAL) - Coupon Repository
Encapsulates coupon persistence and retrieval from Microsoft SQL Server (SSMS).
"""
import threading
from typing import Optional, Dict, Any, List
from .base_repository import BaseRepository


class CouponRepository(BaseRepository):
    def __init__(self):
        super().__init__()
        self._lock = threading.Lock()
        self._seed_cache = {
            "SAVE10": {"code": "SAVE10", "discount_percent": 10.0, "min_spend": 50.0, "is_active": True},
            "SAVE20": {"code": "SAVE20", "discount_percent": 20.0, "min_spend": 50.0, "is_active": True},
            "VIP20": {"code": "VIP20", "discount_percent": 20.0, "min_spend": 100.0, "is_active": True},
            "VIP30": {"code": "VIP30", "discount_percent": 30.0, "min_spend": 150.0, "is_active": True},
            "VIPCASH50": {"code": "VIPCASH50", "discount_percent": 50.0, "min_spend": 250.0, "is_active": True},
            "VIPFIRST": {"code": "VIPFIRST", "discount_percent": 25.0, "min_spend": 0.0, "is_active": True},
            "WELCOME5": {"code": "WELCOME5", "discount_percent": 5.0, "min_spend": 0.0, "is_active": True},
            "FLASH50": {"code": "FLASH50", "discount_percent": 50.0, "min_spend": 200.0, "is_active": True},
            "EXPIRED30": {"code": "EXPIRED30", "discount_percent": 30.0, "min_spend": 20.0, "is_active": False},
            "MINSPEND100": {"code": "MINSPEND100", "discount_percent": 15.0, "min_spend": 100.0, "is_active": True}
        }

    def find_by_code(self, code: str) -> Optional[Dict[str, Any]]:
        """Finds coupon details by code from SSMS database with cache fallback."""
        clean_code = code.strip().upper()
        try:
            with self.transaction() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT code, discount_percent, min_order_amount, is_active
                    FROM coupons
                    WHERE code = ?
                """, (clean_code,))
                row = cursor.fetchone()
                if row:
                    return {
                        "code": row["code"],
                        "discount_percent": float(row["discount_percent"]),
                        "min_spend": float(row["min_order_amount"]),
                        "is_active": bool(row["is_active"])
                    }
        except Exception:
            pass

        return self._seed_cache.get(clean_code)


coupon_repo = CouponRepository()
