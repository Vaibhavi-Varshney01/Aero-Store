"""
Automated Test Suite for Chatbot Interactive CRUD Operations
Validates:
1. Cart CRUD: Add item (Create), View cart (Read), Update quantity (Update), Remove item / Clear cart (Delete)
2. Product Catalog CRUD: Search/list (Read), View single (Read), Update stock (Update), Update price (Update), Create product (Create), Delete product (Delete)
3. Coupon CRUD: List coupons (Read), Apply coupon (Create/Update on Cart), Remove coupon (Delete from Cart)
4. RAG Removal: Ensures rag_augmented is False and sources is None across interactions
"""
import pytest
from starlette.testclient import TestClient
from backend.main import app
from backend.layers.tier3_bll.cart_service import cart_service
from backend.layers.tier3_bll.product_service import product_service

client = TestClient(app)

TEST_SESSION = "test_crud_session"


@pytest.fixture(autouse=True)
def setup_and_teardown():
    cart_service.clear_cart(TEST_SESSION)
    yield
    cart_service.clear_cart(TEST_SESSION)


def test_chatbot_help_menu():
    res = client.post("/api/v1/chat", json={"message": "/help", "session_id": TEST_SESSION})
    assert res.status_code == 200
    data = res.json()
    assert "CRUD" in data["reply"]
    assert "Cart CRUD Operations" in data["reply"]
    assert "Product Catalog CRUD Operations" in data["reply"]
    assert data["rag_augmented"] is False
    assert data["sources"] is None


# =========================================================================
# CART CRUD OPERATIONS VIA CHATBOT
# =========================================================================

def test_chatbot_cart_create_add_item():
    # Add headphones
    res = client.post("/api/v1/chat", json={
        "message": "add 2 headphones to cart",
        "session_id": TEST_SESSION
    })
    assert res.status_code == 200
    data = res.json()
    assert "Added to Cart" in data["reply"]
    assert data["action_type"] == "cart_update"
    cart_payload = data["action_payload"]["cart"]
    assert len(cart_payload["items"]) == 1
    assert cart_payload["items"][0]["quantity"] == 2
    assert cart_payload["items"][0]["product_id"] == "PROD-101"


def test_chatbot_cart_read_view_cart():
    # First add an item
    client.post("/api/v1/chat", json={"message": "add PROD-102 to cart", "session_id": TEST_SESSION})

    # Read cart
    res = client.post("/api/v1/chat", json={"message": "view cart", "session_id": TEST_SESSION})
    assert res.status_code == 200
    data = res.json()
    assert "Your Shopping Cart" in data["reply"]
    assert "ErgoFlow" in data["reply"]
    assert data["action_type"] == "cart_update"


def test_chatbot_cart_update_quantity():
    # Add initial item
    client.post("/api/v1/chat", json={"message": "add PROD-101 to cart", "session_id": TEST_SESSION})

    # Update quantity to 4
    res = client.post("/api/v1/chat", json={
        "message": "update PROD-101 quantity to 4",
        "session_id": TEST_SESSION
    })
    assert res.status_code == 200
    data = res.json()
    assert "Updated `PROD-101` quantity to **4**" in data["reply"]
    assert data["action_payload"]["cart"]["items"][0]["quantity"] == 4


def test_chatbot_cart_delete_remove_single_item():
    # Add items
    client.post("/api/v1/chat", json={"message": "add PROD-101 to cart", "session_id": TEST_SESSION})
    client.post("/api/v1/chat", json={"message": "add PROD-102 to cart", "session_id": TEST_SESSION})

    # Remove PROD-101
    res = client.post("/api/v1/chat", json={
        "message": "remove PROD-101 from cart",
        "session_id": TEST_SESSION
    })
    assert res.status_code == 200
    data = res.json()
    assert "Removed product `PROD-101`" in data["reply"]
    assert len(data["action_payload"]["cart"]["items"]) == 1
    assert data["action_payload"]["cart"]["items"][0]["product_id"] == "PROD-102"


def test_chatbot_cart_delete_clear_cart():
    # Add item
    client.post("/api/v1/chat", json={"message": "add PROD-101 to cart", "session_id": TEST_SESSION})

    # Clear cart
    res = client.post("/api/v1/chat", json={"message": "clear cart", "session_id": TEST_SESSION})
    assert res.status_code == 200
    data = res.json()
    assert "Cart Cleared" in data["reply"]
    assert len(data["action_payload"]["cart"]["items"]) == 0


# =========================================================================
# PRODUCT CATALOG CRUD OPERATIONS VIA CHATBOT
# =========================================================================

def test_chatbot_product_read_search_and_get():
    # Search
    res = client.post("/api/v1/chat", json={"message": "search keyboard", "session_id": TEST_SESSION})
    assert res.status_code == 200
    data = res.json()
    assert "Available Products" in data["reply"]
    assert "PROD-102" in data["reply"]

    # Get single product details
    res_get = client.post("/api/v1/chat", json={"message": "get PROD-101", "session_id": TEST_SESSION})
    assert res_get.status_code == 200
    data_get = res_get.json()
    assert "Product Details" in data_get["reply"]
    assert "HyperSound" in data_get["reply"]


def test_chatbot_product_update_stock_and_price():
    # Update stock
    res_stock = client.post("/api/v1/chat", json={
        "message": "update stock PROD-101 to 45",
        "session_id": TEST_SESSION
    })
    assert res_stock.status_code == 200
    data_stock = res_stock.json()
    assert "Stock Updated" in data_stock["reply"]
    assert product_service.get_by_id("PROD-101").stock == 45

    # Update price
    res_price = client.post("/api/v1/chat", json={
        "message": "update price PROD-101 to 189.99",
        "session_id": TEST_SESSION
    })
    assert res_price.status_code == 200
    data_price = res_price.json()
    assert "Price Updated" in data_price["reply"]
    assert product_service.get_by_id("PROD-101").price == 189.99


def test_chatbot_product_create_and_delete():
    # Create product
    res_create = client.post("/api/v1/chat", json={
        "message": "create product Test RGB Lightbar, price 49.99, stock 20, category Accessories",
        "session_id": TEST_SESSION
    })
    assert res_create.status_code == 200
    data_create = res_create.json()
    assert "Product Created Successfully" in data_create["reply"]
    new_prod = data_create["action_payload"]["product"]
    new_id = new_prod["id"]
    assert new_prod["name"] == "Test RGB Lightbar"
    assert new_prod["price"] == 49.99

    # Verify readable in catalog
    p = product_service.get_by_id(new_id)
    assert p.name == "Test RGB Lightbar"

    # Delete product
    res_delete = client.post("/api/v1/chat", json={
        "message": f"delete product {new_id}",
        "session_id": TEST_SESSION
    })
    assert res_delete.status_code == 200
    assert "Product Deleted" in res_delete.json()["reply"]

    # Verify deleted
    with pytest.raises(Exception):
        product_service.get_by_id(new_id)


# =========================================================================
# COUPON CRUD OPERATIONS VIA CHATBOT
# =========================================================================

def test_chatbot_coupon_crud():
    # 1. Read coupons
    res_list = client.post("/api/v1/chat", json={"message": "what coupons exist?", "session_id": TEST_SESSION})
    assert res_list.status_code == 200
    assert "SAVE20" in res_list.json()["reply"]

    # 2. Add enough items for minimum spend
    client.post("/api/v1/chat", json={"message": "add PROD-101 to cart", "session_id": TEST_SESSION})

    # 3. Apply coupon
    res_apply = client.post("/api/v1/chat", json={"message": "apply coupon SAVE20", "session_id": TEST_SESSION})
    assert res_apply.status_code == 200
    assert "Coupon `SAVE20` Applied Successfully" in res_apply.json()["reply"]
    assert res_apply.json()["action_payload"]["cart"]["applied_coupon"] == "SAVE20"

    # 4. Remove coupon
    res_remove = client.post("/api/v1/chat", json={"message": "remove coupon", "session_id": TEST_SESSION})
    assert res_remove.status_code == 200
    assert "Coupon Removed" in res_remove.json()["reply"]
    assert res_remove.json()["action_payload"]["cart"]["applied_coupon"] is None


def test_chatbot_no_rag_hallucination_or_sources():
    """Verify policy questions return direct assistant responses without RAG vector queries or source citations."""
    res = client.post("/api/v1/chat", json={
        "message": "What is the warranty policy on headphones?",
        "session_id": TEST_SESSION
    })
    assert res.status_code == 200
    data = res.json()
    assert data["rag_augmented"] is False
    assert data["sources"] is None


# =========================================================================
# NEW CHATBOT OPERATIONS & EXPANDED VARIETY
# =========================================================================

def test_chatbot_diverse_catalog_categories():
    """Validates that diverse items (Fitness, Home & Living, Apparel) exist and are searchable via chatbot."""
    # Test fitness item (running shoes)
    res_shoe = client.post("/api/v1/chat", json={"message": "search running shoes", "session_id": TEST_SESSION})
    assert res_shoe.status_code == 200
    assert "PROD-108" in res_shoe.json()["reply"]

    # Test home item (coffee maker)
    res_coffee = client.post("/api/v1/chat", json={"message": "search coffee", "session_id": TEST_SESSION})
    assert res_coffee.status_code == 200
    assert "PROD-109" in res_coffee.json()["reply"]

    # Test grocery items (olive oil & maple syrup)
    res_oil = client.post("/api/v1/chat", json={"message": "search olive oil", "session_id": TEST_SESSION})
    assert res_oil.status_code == 200
    assert "PROD-114" in res_oil.json()["reply"]

    # Add grocery item to cart via chatbot
    res_add_maple = client.post("/api/v1/chat", json={"message": "add maple syrup to cart", "session_id": TEST_SESSION})
    assert res_add_maple.status_code == 200
    assert "PROD-116" in res_add_maple.json()["reply"]
    assert "Added to Cart" in res_add_maple.json()["reply"]

    # Test Cafe & Minutes delivery items (cold brew & croissant)
    res_minutes = client.post("/api/v1/chat", json={"message": "flipkart minutes", "session_id": TEST_SESSION})
    assert res_minutes.status_code == 200
    assert "AeroMinutes Instant Delivery" in res_minutes.json()["reply"]

    res_cafe = client.post("/api/v1/chat", json={"message": "cafe snacks and beverages", "session_id": TEST_SESSION})
    assert res_cafe.status_code == 200
    assert "AeroStore Cafe" in res_cafe.json()["reply"]

    # Add croissant from cafe
    res_add_croissant = client.post("/api/v1/chat", json={"message": "add croissant to cart", "session_id": TEST_SESSION})
    assert res_add_croissant.status_code == 200
    assert "PROD-118" in res_add_croissant.json()["reply"]
    assert "Added to Cart" in res_add_croissant.json()["reply"]


def test_chatbot_budget_filtering():
    """Validates budget filtering tool (items under $100)."""
    res = client.post("/api/v1/chat", json={"message": "items under $50", "session_id": TEST_SESSION})
    assert res.status_code == 200
    data = res.json()
    assert "Products Under $50.00" in data["reply"]
    assert data["action_type"] == "product_search"


def test_chatbot_user_profile():
    """Validates user account profile lookup."""
    res = client.post("/api/v1/chat", json={"message": "my profile", "session_id": TEST_SESSION})
    assert res.status_code == 200
    data = res.json()
    assert "Account Profile" in data["reply"]
    assert any(email in data["reply"] for email in ["jane.doe@example.com", "customer@aerostore.io", "vip@aerostore.io"])


def test_chatbot_checkout_and_order_tracking():
    """Validates full end-to-end checkout and tracking via chatbot."""
    # 1. Add non-electronic item (AeroFit running shoe)
    add_res = client.post("/api/v1/chat", json={"message": "add running shoe to cart", "session_id": TEST_SESSION})
    assert add_res.status_code == 200
    assert "Added to Cart" in add_res.json()["reply"]

    # 2. Checkout via chatbot
    checkout_res = client.post("/api/v1/chat", json={"message": "checkout", "session_id": TEST_SESSION})
    assert checkout_res.status_code == 200
    c_data = checkout_res.json()
    assert "Order Placed Successfully" in c_data["reply"]
    assert c_data["action_type"] == "cart_update"
    order_id = c_data["action_payload"]["order"]["order_id"]

    # 3. Track placed order
    track_res = client.post("/api/v1/chat", json={"message": f"track order {order_id}", "session_id": TEST_SESSION})
    assert track_res.status_code == 200
    assert "Order Tracking Details" in track_res.json()["reply"]
    assert order_id in track_res.json()["reply"]

    # 4. View order history
    orders_res = client.post("/api/v1/chat", json={"message": "my orders", "session_id": TEST_SESSION})
    assert orders_res.status_code == 200
    assert "Recent Orders" in orders_res.json()["reply"]

