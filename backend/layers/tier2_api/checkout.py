"""
Checkout REST Controller (Order Placement)
"""
from typing import Dict, Optional
from fastapi import APIRouter, Body, Header
from pydantic import BaseModel
from ...core.models import Order
from ...core.error_model import DomainException
from ..tier3_bll.order_service import order_service
from ..tier3_bll.auth_service import auth_service

router = APIRouter(prefix="/checkout", tags=["Checkout"])

class CheckoutPayload(BaseModel):
    cart_id: str = "default_cart"
    shipping_address: Dict[str, str] = {
        "full_name": "Jane Doe",
        "street": "100 Tech Blvd",
        "city": "Seattle",
        "state": "WA",
        "zip": "98101",
        "country": "USA"
    }
    simulate_timeout: bool = False
    simulate_failure: bool = False

@router.post("", response_model=Order, summary="Checkout cart and create order")
def perform_checkout(payload: CheckoutPayload, authorization: Optional[str] = Header(None)):
    # Enforce corporate policy: Administrative accounts cannot place retail orders
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ")[1].strip()
        user = auth_service.get_user_by_token(token)
        if user and user.role == "admin":
            raise DomainException(
                error_code="ADMIN_PURCHASE_RESTRICTED",
                title="Purchasing Restricted for Administrators",
                status=403,
                detail="Administrative accounts cannot place retail orders. Please sign in to or register a personal/business Customer account to purchase items."
            )

    return order_service.checkout(
        cart_id=payload.cart_id,
        shipping_address=payload.shipping_address,
        simulate_timeout=payload.simulate_timeout,
        simulate_payment_failure=payload.simulate_failure
    )
