"""
Automated Unit Tests for CartService & Domain Rules
"""
import pytest
from backend.layers.tier3_bll.cart_service import cart_service
from backend.core.error_model import (
    InvalidQuantityException,
    OutOfStockException,
    ConcurrentModificationException,
    ProductNotFoundException,
    CouponException
)

def test_add_item_normal_flow():
    cart = cart_service.add_item("test_cart", "PROD-101", quantity=2)
    assert len(cart.items) == 1
    assert cart.items[0].product_id == "PROD-101"
    assert cart.items[0].quantity == 2
    assert cart.subtotal == 399.98
    assert cart.total_amount > cart.subtotal  # Includes tax

def test_add_item_exceeding_ceiling_quantity():
    with pytest.raises(InvalidQuantityException):
        cart_service.add_item("test_cart", "PROD-101", quantity=100)

def test_add_item_negative_quantity():
    with pytest.raises(InvalidQuantityException):
        cart_service.add_item("test_cart", "PROD-101", quantity=-1)

def test_add_item_out_of_stock():
    with pytest.raises(OutOfStockException):
        cart_service.add_item("test_cart", "PROD-105", quantity=5)  # Only 1 in stock

def test_add_invalid_product_id():
    with pytest.raises(ProductNotFoundException):
        cart_service.add_item("test_cart", "PROD-NON-EXISTENT", quantity=1)

def test_concurrent_modification_occ():
    cart1 = cart_service.add_item("test_cart", "PROD-101", quantity=1)
    v1 = cart1.concurrency_version

    # Client A updates with version v1
    cart_service.add_item("test_cart", "PROD-102", quantity=1, expected_version=v1)

    # Client B attempts update with stale version v1 -> conflict!
    with pytest.raises(ConcurrentModificationException):
        cart_service.add_item("test_cart", "PROD-104", quantity=1, expected_version=v1)

def test_apply_valid_coupon():
    cart_service.add_item("test_cart", "PROD-101", quantity=1)  # $199.99
    cart = cart_service.apply_coupon("test_cart", "SAVE20")
    assert cart.applied_coupon == "SAVE20"
    assert cart.discount_amount == 40.00  # 20% of $199.99 is ~40.00

def test_apply_expired_coupon():
    cart_service.add_item("test_cart", "PROD-101", quantity=1)
    with pytest.raises(CouponException) as excinfo:
        cart_service.apply_coupon("test_cart", "EXPIRED30")
    assert excinfo.value.error_code == "COUPON_EXPIRED"
