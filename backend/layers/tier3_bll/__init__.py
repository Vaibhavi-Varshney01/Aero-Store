"""
Tier 3: Business Logic Layer (BLL / Domain Service Tier)
Encapsulates all domain workflows, SLA validations, inventory reservations,
order sagas, authentication, payment processing, and AI integrations.
Coordinates with Tier 4 (Data Access Layer) for all data persistence.
"""
from .product_service import product_service, ProductService
from .cart_service import cart_service, CartService
from .order_service import order_service, OrderService
from .payment_service import payment_service, PaymentService
from .coupon_service import coupon_service, CouponService
from .auth_service import auth_service, AuthService
from .ai_service import ai_service, AiService

__all__ = [
    "product_service", "ProductService",
    "cart_service", "CartService",
    "order_service", "OrderService",
    "payment_service", "PaymentService",
    "coupon_service", "CouponService",
    "auth_service", "AuthService",
    "ai_service", "AiService"
]
