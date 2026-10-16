"""
Data Access Layer (DAL) Package
Exposes repository singletons isolating all database queries, table interactions,
and connection transactions from the domain services and presentation layer.
"""
from .base_repository import BaseRepository
from .product_repository import ProductRepository, product_repo
from .order_repository import OrderRepository, order_repo
from .user_repository import UserRepository, user_repo
from .coupon_repository import CouponRepository, coupon_repo

__all__ = [
    "BaseRepository",
    "ProductRepository",
    "product_repo",
    "OrderRepository",
    "order_repo",
    "UserRepository",
    "user_repo",
    "CouponRepository",
    "coupon_repo"
]
