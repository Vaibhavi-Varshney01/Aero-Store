"""
Pytest configuration and shared fixtures for E-Commerce test suite.
"""
import sys
import os
import pytest

# Ensure root path is accessible
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.layers.tier3_bll.cart_service import cart_service
from backend.layers.tier3_bll.product_service import product_service

@pytest.fixture(autouse=True)
def reset_services():
    """Resets cart and product stock levels before each test"""
    cart_service.clear_cart("test_cart")
    cart_service.clear_cart("default_cart")
    product_service.set_stock("PROD-101", 15)
    product_service.set_stock("PROD-105", 1)
    yield
