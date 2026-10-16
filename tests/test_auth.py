"""
Unit and Integration Tests for Customer Authentication & Account Management.
"""
import pytest
from starlette.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_login_demo_user_success():
    res = client.post("/api/v1/auth/login", json={
        "email": "jane.doe@example.com",
        "password": "password123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["name"] == "Jane Doe"
    assert data["user"]["email"] == "jane.doe@example.com"
    assert data["user"]["is_vip"] is True

def test_login_invalid_password_401():
    res = client.post("/api/v1/auth/login", json={
        "email": "jane.doe@example.com",
        "password": "wrongpassword"
    })
    assert res.status_code == 401
    prob = res.json()
    assert prob["error_code"] == "INVALID_CREDENTIALS"

def test_register_new_user_success():
    import time
    email = f"alex.tester_{int(time.time()*1000)}@example.com"
    res = client.post("/api/v1/auth/register", json={
        "name": "Alex Tester",
        "email": email,
        "password": "securepass123"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["name"] == "Alex Tester"
    assert data["user"]["email"] == email


def test_register_duplicate_email_409():
    res = client.post("/api/v1/auth/register", json={
        "name": "Jane Imposter",
        "email": "jane.doe@example.com",
        "password": "password123"
    })
    assert res.status_code == 409
    prob = res.json()
    assert prob["error_code"] == "EMAIL_ALREADY_REGISTERED"

def test_get_profile_with_bearer_token():
    # Login first
    login_res = client.post("/api/v1/auth/login", json={
        "email": "jane.doe@example.com",
        "password": "password123"
    })
    token = login_res.json()["access_token"]

    # Call /auth/me
    res = client.get("/api/v1/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "jane.doe@example.com"
    assert data["name"] == "Jane Doe"

def test_get_profile_unauthorized_401():
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401
    prob = res.json()
    assert prob["error_code"] == "UNAUTHORIZED"

def test_rbac_admin_role_access():
    # Login as Admin
    login_res = client.post("/api/v1/auth/login", json={
        "email": "admin@example.com",
        "password": "admin123"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert login_res.json()["user"]["role"] == "admin"

    # Access admin dashboard
    res = client.get("/api/v1/auth/admin-dashboard", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert "Welcome Admin!" in res.json()["message"]

def test_rbac_forbidden_role_403():
    # Login as Customer
    login_res = client.post("/api/v1/auth/login", json={
        "email": "jane.doe@example.com",
        "password": "password123"
    })
    token = login_res.json()["access_token"]

    # Customer attempts to access admin dashboard -> 403 Forbidden
    res = client.get("/api/v1/auth/admin-dashboard", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 403
    assert res.json()["error_code"] == "FORBIDDEN_ROLE"

def test_rbac_delivery_partner_access():
    # Login as Delivery Partner
    login_res = client.post("/api/v1/auth/login", json={
        "email": "delivery@example.com",
        "password": "delivery123"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert login_res.json()["user"]["role"] == "delivery_partner"

    # Access delivery dashboard
    res = client.get("/api/v1/auth/delivery-dashboard", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert "Welcome Delivery Partner!" in res.json()["message"]

