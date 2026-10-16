"""
API Integration Tests using FastAPI TestClient
"""
import pytest
from starlette.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_get_products():
    res = client.get("/api/v1/products")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 6
    assert any(p["id"] == "PROD-101" for p in data)

def test_get_product_by_id():
    res = client.get("/api/v1/products/PROD-101")
    assert res.status_code == 200
    assert res.json()["name"] == "HyperSound ANC Wireless Headphones"

def test_get_invalid_product_404():
    res = client.get("/api/v1/products/INVALID-ID")
    assert res.status_code == 404
    prob = res.json()
    assert prob["error_code"] == "PRODUCT_NOT_FOUND"

def test_cart_operations():
    # 1. Add item
    res = client.post("/api/v1/cart/items", json={
        "cart_id": "api_test_cart",
        "product_id": "PROD-102",
        "quantity": 2
    })
    assert res.status_code == 200
    cart = res.json()
    assert len(cart["items"]) == 1

    # 2. Get cart
    res_get = client.get("/api/v1/cart?cart_id=api_test_cart")
    assert res_get.status_code == 200
    assert res_get.json()["subtotal"] == 259.00

def test_chatbot_endpoint():
    res = client.post("/api/v1/chat", json={"message": "/help"})
    assert res.status_code == 200
    assert "Welcome" in res.json()["reply"]

def test_checkout_endpoint():
    # Put item in cart first
    client.post("/api/v1/cart/items", json={
        "cart_id": "checkout_test_cart",
        "product_id": "PROD-104",
        "quantity": 1
    })

    # Checkout
    res = client.post("/api/v1/checkout", json={
        "cart_id": "checkout_test_cart",
        "shipping_address": {
            "full_name": "Alice Tester",
            "street": "123 Main St",
            "city": "Boston",
            "state": "MA",
            "zip": "02108"
        }
    })
    assert res.status_code == 200
    order = res.json()
    assert order["status"] == "CONFIRMED"
    assert "ORD-" in order["order_id"]


def test_compare_products_endpoint():
    res = client.post("/api/v1/products/compare", json={
        "product_ids": ["PROD-101", "PROD-102"],
        "persona": "audiophile"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["persona"] == "audiophile"
    assert len(data["products"]) == 2
    assert "verdict" in data
    assert data["verdict"]["winner_id"] == "PROD-101"
    assert "value_score" in data["verdict"]


def test_compare_products_invalid_id_404():
    res = client.post("/api/v1/products/compare", json={
        "product_ids": ["NON-EXISTENT-ID"],
        "persona": "general"
    })
    assert res.status_code == 404

