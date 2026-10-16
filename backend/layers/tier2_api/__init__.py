"""
Tier 2: API Layer (REST Controllers & API Gateway)
Exposes HTTP endpoints, request validation, authentication filters,
and routes external client requests into Tier 3 (Business Logic Layer).
"""
from .products import router as products_router
from .cart import router as cart_router
from .checkout import router as checkout_router
from .payments import router as payments_router
from .auth import router as auth_router
from .chatbot import router as chatbot_router
from .rag_api import router as rag_router
from .use_cases_api import router as usecases_router

__all__ = [
    "products_router",
    "cart_router",
    "checkout_router",
    "payments_router",
    "auth_router",
    "chatbot_router",
    "rag_router",
    "usecases_router",
]
