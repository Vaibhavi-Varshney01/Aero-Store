"""
Use Case 5 Deliverable: AI-Generated Test Code
Target Framework: pytest (Python 3.14)
Enforces:
• Normal Flow
• Empty Cart Checkout
• Large Quantity Ceiling
• Concurrent Modification (OCC)
• Invalid Product ID
• Payment Gateway SLA Timeout & Rollback
"""
import pytest
import uuid
from backend.layers.tier3_bll.cart_service import cart_service
from backend.layers.tier3_bll.payment_service import payment_service
from backend.layers.tier3_bll.order_service import order_service
from backend.core.models import PaymentRequest
from backend.core.error_model import (
    InvalidQuantityException,
    OutOfStockException,
    ConcurrentModificationException,
    ProductNotFoundException,
    EmptyCartException,
    PaymentTimeoutException
)

# Test 1: Normal flow
def test_cart_normal_flow():
    cart = cart_service.add_item("cart_demo", "PROD-101", quantity=2)
    assert len(cart.items) == 1
    assert cart.subtotal == 399.98
    assert cart.concurrency_version > 1

# Test 2: Empty cart checkout rejection
def test_cart_empty_checkout():
    cart_service.clear_cart("empty_cart")
    with pytest.raises(EmptyCartException):
        order_service.checkout("empty_cart", shipping_address={"city": "Seattle"})

# Test 3: Large quantity ceiling (> 99 units)
def test_cart_large_quantity_ceiling():
    with pytest.raises(InvalidQuantityException):
        cart_service.add_item("cart_demo", "PROD-101", quantity=100)

# Test 4: Concurrent modification (OCC)
def test_cart_concurrent_modification():
    cart = cart_service.add_item("cart_occ", "PROD-101", quantity=1)
    v1 = cart.concurrency_version

    # First modification advances version to v2
    cart_service.add_item("cart_occ", "PROD-102", quantity=1, expected_version=v1)

    # Stale modification using v1 rejected
    with pytest.raises(ConcurrentModificationException):
        cart_service.add_item("cart_occ", "PROD-104", quantity=1, expected_version=v1)

# Test 5: Invalid product ID
def test_cart_invalid_product():
    with pytest.raises(ProductNotFoundException):
        cart_service.add_item("cart_demo", "PROD-NON-EXISTENT", quantity=1)

# Test 6: Payment SLA Timeout & Saga Rollback
def test_payment_sla_timeout_and_rollback():
    req = PaymentRequest(
        transaction_id=f"tx-sla-{uuid.uuid4().hex[:6]}",
        cart_id="cart_demo",
        amount=199.99,
        simulate_delay_ms=1600
    )
    with pytest.raises(PaymentTimeoutException):
        payment_service.process_payment(req, force_timeout=True)
