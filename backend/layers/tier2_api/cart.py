"""
Shopping Cart REST Controller (Contract-First with OCC)
"""
from typing import Optional
from fastapi import APIRouter, Query, Body, Header
from pydantic import BaseModel, Field
from ...core.models import Cart
from ..tier3_bll.cart_service import cart_service
from ..tier3_bll.auth_service import auth_service

router = APIRouter(prefix="/cart", tags=["Cart"])

class AddItemPayload(BaseModel):
    cart_id: str = "default_cart"
    product_id: str
    quantity: int = Field(..., ge=1, le=99)
    expected_version: Optional[int] = None

class UpdateItemPayload(BaseModel):
    cart_id: str = "default_cart"
    quantity: int = Field(..., ge=0, le=99)
    expected_version: Optional[int] = None

class CouponPayload(BaseModel):
    cart_id: str = "default_cart"
    coupon_code: str

@router.get("", response_model=Cart, summary="Retrieve current cart")
def get_cart(cart_id: str = Query("default_cart")):
    return cart_service.get_or_create_cart(cart_id)

@router.post("/items", response_model=Cart, summary="Add item to cart")
def add_item_to_cart(
    payload: AddItemPayload,
    authorization: Optional[str] = Header(None)
):
    is_vip = False
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ")[1].strip()
        user = auth_service.get_user_by_token(token)
        if user and (getattr(user, "is_vip", False) or user.role in ("admin", "shipper")):
            is_vip = True

    return cart_service.add_item(
        cart_id=payload.cart_id,
        product_id=payload.product_id,
        quantity=payload.quantity,
        expected_version=payload.expected_version,
        is_vip_user=is_vip
    )

@router.put("/items/{product_id}", response_model=Cart, summary="Update item quantity")
def update_item_quantity(product_id: str, payload: UpdateItemPayload):
    return cart_service.update_item_quantity(
        cart_id=payload.cart_id,
        product_id=product_id,
        quantity=payload.quantity,
        expected_version=payload.expected_version
    )

@router.delete("/items/{product_id}", response_model=Cart, summary="Remove item from cart")
def remove_item_from_cart(
    product_id: str, 
    cart_id: str = Query("default_cart"),
    expected_version: Optional[int] = Query(None)
):
    return cart_service.remove_item(
        cart_id=cart_id,
        product_id=product_id,
        expected_version=expected_version
    )

@router.post("/coupon", response_model=Cart, summary="Apply coupon code")
def apply_coupon(payload: CouponPayload):
    return cart_service.apply_coupon(
        cart_id=payload.cart_id,
        coupon_code=payload.coupon_code
    )

@router.delete("/coupon", response_model=Cart, summary="Remove applied coupon")
def remove_coupon(cart_id: str = Query("default_cart")):
    return cart_service.remove_coupon(cart_id)
