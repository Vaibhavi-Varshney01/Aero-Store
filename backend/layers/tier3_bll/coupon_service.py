"""
Business Logic Tier (BLL) - Coupon & Promotion Service
Validates promotional discount codes, expiration dates, and minimum spend rules.
Delegates coupon persistence lookups to the Data Access Layer (CouponRepository).
"""
from typing import Optional
from ...core.models import Coupon
from ...core.error_model import CouponException
from ..tier4_dal.coupon_repository import coupon_repo, CouponRepository


class CouponService:
    """Domain service managing discount validation and promotional campaigns."""

    def __init__(self, repository: Optional[CouponRepository] = None):
        self._coupon_repo = repository or coupon_repo

    def validate_and_apply(self, code: str, cart_subtotal: float) -> Coupon:
        normalized_code = code.strip().upper()
        raw = self._coupon_repo.find_by_code(normalized_code)
        if not raw:
            raise CouponException(
                code=code,
                detail=f"Coupon code '{code}' does not exist.",
                error_code="COUPON_NOT_FOUND"
            )

        coupon = Coupon(
            code=raw["code"],
            discount_percent=raw["discount_percent"],
            min_spend=raw.get("min_spend", 0.0),
            is_expired=not raw.get("is_active", True),
            description=f"{raw['discount_percent']}% discount on qualifying orders"
        )

        if coupon.is_expired:
            raise CouponException(
                code=code,
                detail=f"Coupon code '{code}' has expired and is no longer valid.",
                error_code="COUPON_EXPIRED"
            )

        if cart_subtotal < coupon.min_spend:
            raise CouponException(
                code=code,
                detail=f"Cart subtotal (${cart_subtotal:.2f}) does not meet the minimum spend threshold of ${coupon.min_spend:.2f} for coupon '{code}'.",
                error_code="COUPON_MIN_SPEND_NOT_MET"
            )

        return coupon

    def calculate_discount(self, coupon: Coupon, cart_subtotal: float) -> float:
        return round(cart_subtotal * (coupon.discount_percent / 100.0), 2)


coupon_service = CouponService()
