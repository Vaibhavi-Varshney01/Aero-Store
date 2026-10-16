"""
Automated Unit Tests for PaymentService
"""
import pytest
import uuid
from backend.layers.tier3_bll.payment_service import payment_service
from backend.core.models import PaymentRequest
from backend.core.error_model import PaymentTimeoutException

def test_payment_success():
    tx_id = f"tx-test-{uuid.uuid4().hex[:6]}"
    req = PaymentRequest(
        transaction_id=tx_id,
        cart_id="test_cart",
        amount=150.00
    )
    result = payment_service.process_payment(req)
    assert result.status == "SUCCESS"
    assert result.transaction_id == tx_id
    assert result.amount == 150.00

def test_payment_idempotency_duplicate():
    tx_id = f"tx-dup-{uuid.uuid4().hex[:6]}"
    req = PaymentRequest(
        transaction_id=tx_id,
        cart_id="test_cart",
        amount=99.99
    )
    res1 = payment_service.process_payment(req)
    assert res1.status == "SUCCESS"

    # Second call with same transaction ID
    res2 = payment_service.process_payment(req)
    assert res2.status == "IDEMPOTENT_DUPLICATE"

def test_payment_sla_timeout_breach():
    tx_id = f"tx-timeout-{uuid.uuid4().hex[:6]}"
    req = PaymentRequest(
        transaction_id=tx_id,
        cart_id="test_cart",
        amount=200.00,
        simulate_delay_ms=1600
    )
    with pytest.raises(PaymentTimeoutException) as excinfo:
        payment_service.process_payment(req, force_timeout=True)
    assert excinfo.value.error_code == "PAYMENT_GATEWAY_TIMEOUT"
