"""
Payment Gateway Service
Enforces SLA timeout limits (1500ms), idempotency deduplication, and saga compensation rollbacks.
"""
from typing import Dict
import time
import threading
from datetime import datetime, timezone
from ...core.models import PaymentRequest, PaymentResult
from ...core.error_model import PaymentTimeoutException
from ...core.config import settings

class PaymentService:
    def __init__(self):
        self._lock = threading.Lock()
        self._idempotency_cache: Dict[str, PaymentResult] = {}
        self._audit_log: list = []

    def process_payment(
        self, 
        request: PaymentRequest, 
        force_timeout: bool = False, 
        force_failure: bool = False
    ) -> PaymentResult:
        with self._lock:
            # 1. Check Idempotency Key (Prevents double billing / replay attacks)
            if request.transaction_id in self._idempotency_cache:
                cached = self._idempotency_cache[request.transaction_id]
                return PaymentResult(
                    transaction_id=request.transaction_id,
                    status="IDEMPOTENT_DUPLICATE",
                    amount=cached.amount,
                    message=f"Duplicate request detected for TransactionId: {request.transaction_id}. Returning cached response.",
                    timestamp=datetime.now(timezone.utc),
                    saga_rollback_executed=False
                )

        start_time = time.time()
        delay_ms = request.simulate_delay_ms or 0
        if force_timeout:
            delay_ms = 1800  # Exceeds 1500ms SLA

        # Simulate network latency
        if delay_ms > 0:
            time.sleep(min(delay_ms, 2000) / 1000.0)

        elapsed_ms = int((time.time() - start_time) * 1000)

        # 2. SLA Timeout Protection Check
        if elapsed_ms > settings.payment_sla_timeout_ms or force_timeout:
            # Execute Compensating Saga Rollback
            rollback_success = self._execute_compensating_saga_rollback(request.transaction_id, request.amount)
            timeout_result = PaymentResult(
                transaction_id=request.transaction_id,
                status="TIMEOUT",
                amount=request.amount,
                message=f"Gateway SLA breached ({elapsed_ms}ms > {settings.payment_sla_timeout_ms}ms). Compensating saga rollback completed.",
                timestamp=datetime.now(timezone.utc),
                saga_rollback_executed=rollback_success
            )
            with self._lock:
                self._idempotency_cache[request.transaction_id] = timeout_result
            raise PaymentTimeoutException(request.transaction_id, elapsed_ms)

        # 3. Simulate Gateway Rejection
        if force_failure:
            fail_result = PaymentResult(
                transaction_id=request.transaction_id,
                status="FAILED",
                amount=request.amount,
                message="Card declined by issuing bank: Insufficient funds or invalid CVV.",
                timestamp=datetime.now(timezone.utc),
                saga_rollback_executed=False
            )
            with self._lock:
                self._idempotency_cache[request.transaction_id] = fail_result
            return fail_result

        # 4. Successful Settlement
        success_result = PaymentResult(
            transaction_id=request.transaction_id,
            status="SUCCESS",
            amount=request.amount,
            message=f"Payment of ${request.amount:.2f} successfully captured via {request.payment_method} (Card ending in {request.card_last_four}).",
            timestamp=datetime.now(timezone.utc),
            saga_rollback_executed=False
        )

        with self._lock:
            self._idempotency_cache[request.transaction_id] = success_result
            self._audit_log.append({
                "transaction_id": request.transaction_id,
                "amount": request.amount,
                "status": "SUCCESS",
                "elapsed_ms": elapsed_ms,
                "timestamp": datetime.now(timezone.utc).isoformat()
            })

        return success_result

    def _execute_compensating_saga_rollback(self, transaction_id: str, amount: float) -> bool:
        """Simulates reversing pending ledger reservations and restoring inventory locks"""
        with self._lock:
            self._audit_log.append({
                "transaction_id": transaction_id,
                "action": "SAGA_COMPENSATING_REVERSAL",
                "amount": amount,
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
        return True

    def get_audit_log(self):
        with self._lock:
            return list(self._audit_log)

payment_service = PaymentService()
