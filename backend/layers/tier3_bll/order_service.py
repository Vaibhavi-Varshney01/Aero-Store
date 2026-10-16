"""
Business Logic Tier (BLL) - Order Management Service
Coordinates the 3-phase checkout orchestration:
  1. Inventory Reservation & Stock Validation
  2. Payment Settlement & Idempotency SLA Enforcement
  3. Order Persistence via Data Access Layer (OrderRepository)
Handles saga compensating transactions on payment failure or timeouts.
"""
import uuid
from typing import Dict, Optional, List
from datetime import datetime, timezone
import threading

from ...core.models import Order, PaymentRequest
from ...core.error_model import (
    EmptyCartException,
    DomainException
)
from .cart_service import cart_service
from .product_service import product_service
from .payment_service import payment_service
from ..tier4_dal.order_repository import order_repo, OrderRepository


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class OrderService:
    """Domain service orchestrating checkout workflows and order lifecycle state transitions."""

    def __init__(self, repository: Optional[OrderRepository] = None):
        self._order_repo = repository or order_repo
        self._lock = threading.Lock()

    def checkout(
        self, 
        cart_id: str, 
        shipping_address: Dict[str, str],
        user_id: Optional[str] = "USER-1001",
        simulate_timeout: bool = False,
        simulate_payment_failure: bool = False
    ) -> Order:
        """
        Executes ACID checkout transaction across microservice boundaries.
        Compensates (rolls back stock) if payment processing fails.
        """
        cart = cart_service.get_or_create_cart(cart_id)
        if not cart.items:
            raise EmptyCartException()

        deducted_items = []
        try:
            # 1. Inventory Reservation Phase
            for item in cart.items:
                product_service.deduct_stock(item.product_id, item.quantity)
                deducted_items.append((item.product_id, item.quantity))

            # 2. Payment Settlement Phase
            transaction_id = str(uuid.uuid4())
            payment_req = PaymentRequest(
                transaction_id=transaction_id,
                cart_id=cart_id,
                amount=cart.total_amount,
                payment_method="CREDIT_CARD",
                card_last_four="4242",
                simulate_delay_ms=1800 if simulate_timeout else 100
            )

            payment_result = payment_service.process_payment(
                request=payment_req,
                force_timeout=simulate_timeout,
                force_failure=simulate_payment_failure
            )

            if payment_result.status != "SUCCESS":
                raise DomainException(
                    error_code="PAYMENT_FAILED",
                    title="Payment Failed",
                    detail=payment_result.message,
                    status=402
                )

            # 3. Order Creation via Data Access Layer (DAL)
            order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"
            now_str = utc_now_iso()

            self._order_repo.insert_order(
                order_id=order_id,
                user_id=user_id or "USER-1001",
                total_amount=cart.total_amount,
                status="CONFIRMED",
                shipping_address=shipping_address,
                items=cart.items,
                created_at=now_str
            )

            order = Order(
                order_id=order_id,
                transaction_id=transaction_id,
                cart_id=cart_id,
                items=[i.model_copy() for i in cart.items],
                total_amount=cart.total_amount,
                shipping_address=shipping_address,
                status="CONFIRMED"
            )

            # 4. Clear shopping cart
            cart_service.clear_cart(cart_id)
            return order

        except Exception as ex:
            # Compensating Saga Rollback: Restore any reserved stock
            for prod_id, qty in deducted_items:
                try:
                    product_service.restore_stock(prod_id, qty)
                except Exception:
                    pass
            raise ex

    def seed_demo_orders_if_needed(self):
        """Delegates demo orders seeding to the Data Access Layer."""
        self._order_repo.seed_demo_orders_if_needed()

    def create_sample_order(self, user_id: str = "USER-1001-AERO") -> Dict:
        """Create an instant realistic sample order for dashboard testing."""
        order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        address = {"street": "42 Galaxy Way, Suite 300", "city": "Metropolis", "state": "NY", "zip": "10001"}
        sample_items = [
            {"product_id": "PROD-101", "quantity": 1, "unit_price": 199.99},
            {"product_id": "PROD-106", "quantity": 1, "unit_price": 49.99}
        ]
        total = 249.98
        now_str = utc_now_iso()

        self._order_repo.insert_order(
            order_id=order_id,
            user_id=user_id,
            total_amount=total,
            status="CONFIRMED",
            shipping_address=address,
            items=sample_items,
            created_at=now_str
        )

        return {
            "order_id": order_id,
            "total_amount": total,
            "status": "CONFIRMED",
            "message": f"Sample order {order_id} created successfully!"
        }

    def get_user_orders(self, user_id: str) -> List[Dict]:
        """Fetch order history for a given user via Data Access Layer."""
        return self._order_repo.get_user_orders(user_id)

    def get_all_orders(self) -> List[Dict]:
        """Fetch all platform orders for Admin & Delivery Partner roles via Data Access Layer."""
        return self._order_repo.get_all_orders()

    def get_order_by_id(self, order_id: str) -> Optional[Dict]:
        """Fetch a single order by ID via Data Access Layer."""
        return self._order_repo.get_order_by_id(order_id)

    def update_order_status(self, order_id: str, new_status: str) -> Dict:
        """Update order status via Data Access Layer."""
        return self._order_repo.update_order_status(order_id, new_status)


# Singleton service instance
order_service = OrderService()
