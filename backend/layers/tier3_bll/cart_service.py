"""
Shopping Cart Service with Optimistic Concurrency Control (OCC)
Enforces quantity ceilings, stock checks, and concurrency conflict detection.
"""
from typing import Dict, Optional
import threading
from datetime import datetime, timezone
from ...core.models import Cart, CartItem
from ...core.error_model import (
    InvalidQuantityException,
    OutOfStockException,
    EmptyCartException,
    ConcurrentModificationException,
    ProductNotFoundException,
    VipAccessRequiredException
)
from .product_service import product_service
from .coupon_service import coupon_service

class CartService:
    def __init__(self):
        self._lock = threading.Lock()
        self._carts: Dict[str, Cart] = {}

    def get_or_create_cart(self, cart_id: str = "default_cart") -> Cart:
        with self._lock:
            if cart_id not in self._carts:
                self._carts[cart_id] = Cart(id=cart_id)
            return self._carts[cart_id].model_copy(deep=True)

    def add_item(
        self, 
        cart_id: str, 
        product_id: str, 
        quantity: int, 
        expected_version: Optional[int] = None,
        is_vip_user: bool = False
    ) -> Cart:
        if quantity <= 0:
            raise InvalidQuantityException("Quantity must be greater than zero.")
        if quantity > 99:
            raise InvalidQuantityException("Quantity exceeds the maximum ceiling limit of 99 units per item.")

        with self._lock:
            if cart_id not in self._carts:
                self._carts[cart_id] = Cart(id=cart_id)
            cart = self._carts[cart_id]

            # Optimistic Concurrency Control check
            if expected_version is not None and expected_version != cart.concurrency_version:
                raise ConcurrentModificationException(
                    current_version=cart.concurrency_version,
                    client_version=expected_version
                )

            # Check product exists & inventory
            product = product_service.get_by_id(product_id)
            
            # Find existing item if present
            existing = next((item for item in cart.items if item.product_id == product_id), None)
            new_total_qty = (existing.quantity if existing else 0) + quantity

            if new_total_qty > 99:
                raise InvalidQuantityException("Total item quantity cannot exceed 99 units.")
            if product.stock < new_total_qty:
                raise OutOfStockException(product_id, requested=new_total_qty, available=product.stock)

            if existing:
                existing.quantity = new_total_qty
                existing.subtotal = round(existing.unit_price * existing.quantity, 2)
            else:
                cart.items.append(CartItem(
                    product_id=product.id,
                    name=product.name,
                    unit_price=product.price,
                    quantity=quantity,
                    subtotal=round(product.price * quantity, 2),
                    image_url=product.image_url or ""
                ))

            cart.concurrency_version += 1
            cart.updated_at = datetime.now(timezone.utc)
            self._recalculate(cart)
            return cart.model_copy(deep=True)

    def update_item_quantity(
        self, 
        cart_id: str, 
        product_id: str, 
        quantity: int, 
        expected_version: Optional[int] = None
    ) -> Cart:
        if quantity < 0 or quantity > 99:
            raise InvalidQuantityException("Quantity must be between 0 and 99.")

        with self._lock:
            if cart_id not in self._carts:
                self._carts[cart_id] = Cart(id=cart_id)
            cart = self._carts[cart_id]

            if expected_version is not None and expected_version != cart.concurrency_version:
                raise ConcurrentModificationException(
                    current_version=cart.concurrency_version,
                    client_version=expected_version
                )

            if quantity == 0:
                cart.items = [i for i in cart.items if i.product_id != product_id]
            else:
                product = product_service.get_by_id(product_id)
                if product.stock < quantity:
                    raise OutOfStockException(product_id, requested=quantity, available=product.stock)

                item = next((i for i in cart.items if i.product_id == product_id), None)
                if item:
                    item.quantity = quantity
                    item.subtotal = round(item.unit_price * quantity, 2)
                else:
                    raise ProductNotFoundException(product_id)

            cart.concurrency_version += 1
            cart.updated_at = datetime.now(timezone.utc)
            self._recalculate(cart)
            return cart.model_copy(deep=True)

    def remove_item(
        self, 
        cart_id: str, 
        product_id: str, 
        expected_version: Optional[int] = None
    ) -> Cart:
        return self.update_item_quantity(cart_id, product_id, 0, expected_version)

    def apply_coupon(self, cart_id: str, coupon_code: str) -> Cart:
        with self._lock:
            if cart_id not in self._carts:
                self._carts[cart_id] = Cart(id=cart_id)
            cart = self._carts[cart_id]

            if not cart.items:
                raise EmptyCartException()

            coupon = coupon_service.validate_and_apply(coupon_code, cart.subtotal)
            cart.applied_coupon = coupon.code
            cart.concurrency_version += 1
            cart.updated_at = datetime.now(timezone.utc)
            self._recalculate(cart)
            return cart.model_copy(deep=True)

    def remove_coupon(self, cart_id: str) -> Cart:
        with self._lock:
            if cart_id not in self._carts:
                self._carts[cart_id] = Cart(id=cart_id)
            cart = self._carts[cart_id]
            cart.applied_coupon = None
            cart.concurrency_version += 1
            self._recalculate(cart)
            return cart.model_copy(deep=True)

    def clear_cart(self, cart_id: str):
        with self._lock:
            if cart_id in self._carts:
                self._carts[cart_id] = Cart(id=cart_id)

    def _recalculate(self, cart: Cart):
        subtotal = sum(item.subtotal for item in cart.items)
        cart.subtotal = round(subtotal, 2)

        if cart.applied_coupon:
            try:
                coupon = coupon_service.validate_and_apply(cart.applied_coupon, cart.subtotal)
                cart.discount_amount = coupon_service.calculate_discount(coupon, cart.subtotal)
            except Exception:
                cart.applied_coupon = None
                cart.discount_amount = 0.0
        else:
            cart.discount_amount = 0.0

        taxable = max(0.0, cart.subtotal - cart.discount_amount)
        cart.tax_amount = round(taxable * 0.08, 2)  # 8% sales tax
        cart.total_amount = round(taxable + cart.tax_amount, 2)

cart_service = CartService()
