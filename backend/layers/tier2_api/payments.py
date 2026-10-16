"""
Payment Gateway REST Controller
"""
from fastapi import APIRouter
from ...core.models import PaymentRequest, PaymentResult
from ..tier3_bll.payment_service import payment_service

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.post("", response_model=PaymentResult, summary="Process payment with SLA & idempotency")
def process_payment(request: PaymentRequest):
    return payment_service.process_payment(request)
