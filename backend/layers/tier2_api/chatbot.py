"""
AI Chatbot REST Controller
Powering interactive CRUD operations for Cart, Products, and Coupons,
plus developer Use Case 1-5 command engine.
RAG dependencies have been removed.
"""
import json
import re
from typing import Optional, List, Tuple, Dict, Any
from fastapi import APIRouter
from ...core.models import ChatRequest, ChatResponse, Product
from ...core.error_model import (
    OutOfStockException,
    InvalidQuantityException,
    ProductNotFoundException,
    CouponException,
    ConcurrentModificationException
)
from ..tier3_bll.product_service import product_service
from ..tier3_bll.coupon_service import coupon_service
from ..tier3_bll.cart_service import cart_service
from ..tier3_bll.order_service import order_service
from ..tier3_bll.auth_service import auth_service
from ..tier3_bll.ai_service import ai_service
from ...use_cases.uc1_architecture.architecture_engine import architecture_engine
from ...use_cases.uc2_api_scaffolding.openapi_generator import openapi_generator
from ...use_cases.uc3_frontend_risk.a11y_auditor import a11y_auditor
from ...use_cases.uc4_code_review.ai_reviewer import ai_reviewer
from ...use_cases.uc5_testing_edgecases.edge_case_simulator import edge_case_simulator
from ...use_cases.uc5_testing_edgecases.security_auditor import security_auditor
from ...use_cases.uc5_testing_edgecases.test_generator import test_generator
from ...use_cases.uc5_testing_edgecases.retry_reprompt_bench import retry_benchmark

router = APIRouter(prefix="/chat", tags=["AI Chatbot"])


def _extract_product_id(text: str) -> Optional[str]:
    """Matches product IDs like PROD-101 or fuzzy matches keywords."""
    prod_id_match = re.search(r"\b(prod-\d{3,4})\b", text, re.IGNORECASE)
    if prod_id_match:
        return prod_id_match.group(1).upper()
    
    # Keyword fallback mapping
    keyword_map = {
        "headphone": "PROD-101",
        "audio": "PROD-101",
        "hypersound": "PROD-101",
        "keyboard": "PROD-102",
        "ergoflow": "PROD-102",
        "monitor": "PROD-103",
        "ultravision": "PROD-103",
        "screen": "PROD-103",
        "watch": "PROD-104",
        "smartwatch": "PROD-104",
        "titanium": "PROD-104",
        "hoodie": "PROD-105",
        "cyberpunk": "PROD-105",
        "apparel": "PROD-105",
        "mouse": "PROD-106",
        "aerogrip": "PROD-106",
        "stand": "PROD-107",
        "studiopro": "PROD-107",
        "shoe": "PROD-108",
        "running": "PROD-108",
        "aerofit": "PROD-108",
        "sneaker": "PROD-108",
        "coffee": "PROD-109",
        "carafe": "PROD-109",
        "nordic": "PROD-109",
        "bottle": "PROD-110",
        "water bottle": "PROD-110",
        "flask": "PROD-110",
        "ecothermal": "PROD-110",
        "jacket": "PROD-111",
        "commuter": "PROD-111",
        "coat": "PROD-111",
        "diffuser": "PROD-112",
        "aromapure": "PROD-112",
        "aroma": "PROD-112",
        "essential oil": "PROD-112",
        "coffee bean": "PROD-113",
        "dark roast": "PROD-113",
        "colombian": "PROD-113",
        "beans": "PROD-113",
        "olive oil": "PROD-114",
        "extra virgin": "PROD-114",
        "cooking oil": "PROD-114",
        "oil": "PROD-114",
        "almond": "PROD-115",
        "cashew": "PROD-115",
        "nuts": "PROD-115",
        "snack": "PROD-115",
        "maple syrup": "PROD-116",
        "maple": "PROD-116",
        "syrup": "PROD-116",
        "cold brew": "PROD-117",
        "iced latte": "PROD-117",
        "nitro": "PROD-117",
        "latte": "PROD-117",
        "croissant": "PROD-118",
        "pastry": "PROD-118",
        "matcha": "PROD-119",
        "matcha latte": "PROD-119",
        "brownie": "PROD-120",
        "fudge": "PROD-120",
        "avocado toast": "PROD-121",
        "toast": "PROD-121",
        "yuzu": "PROD-122",
        "cooler": "PROD-122",
        "sparkling": "PROD-122",
    }
    for kw, pid in keyword_map.items():
        if kw in text.lower():
            return pid
    return None


def _resolve_product_id(text: Optional[str]) -> Optional[str]:
    """Resolves product ID from ID string, product title, or keyword."""
    if not text:
        return None
    m = re.search(r"\b(prod-\d{3,4})\b", str(text), re.IGNORECASE)
    if m:
        return m.group(1).upper()
    
    t_clean = str(text).lower().strip()
    try:
        for p in product_service.get_all():
            if t_clean in p.name.lower() or p.name.lower() in t_clean:
                return p.id
    except Exception:
        pass

    return _extract_product_id(str(text))


def _extract_quantity(text: str, default: int = 1) -> int:
    """Extracts positive integer quantity from text."""
    patterns = [
        r"(?:quantity|qty|count|to)\s*[:=]?\s*(\d+)",
        r"(?:add|insert)\s+(\d+)",
        r"\b(\d+)\s*(?:units?|items?|pieces?|x)\b",
    ]
    for pattern in patterns:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            return int(m.group(1))
    
    tokens = text.split()
    for t in tokens:
        if t.isdigit() and 1 <= int(t) <= 99:
            return int(t)
            
    return default


# CRUD Tool Schemas for Capgemini Generative Engine Function Calling
CRUD_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "add_to_cart",
            "description": "Add one or more units of a product to the user's shopping cart.",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_id": {
                        "type": "string",
                        "description": "Product ID (e.g. PROD-101) or product name keyword."
                    },
                    "quantity": {
                        "type": "integer",
                        "description": "Quantity to add. Defaults to 1."
                    }
                },
                "required": ["product_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "view_cart",
            "description": "View the user's shopping cart contents, line items, subtotal, tax, and total amount.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_cart_quantity",
            "description": "Update the quantity of an existing item in the shopping cart.",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_id": {
                        "type": "string",
                        "description": "Product ID (e.g. PROD-101) or product name."
                    },
                    "quantity": {
                        "type": "integer",
                        "description": "New quantity of items."
                    }
                },
                "required": ["product_id", "quantity"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "remove_from_cart",
            "description": "Remove a specific product completely from the user's shopping cart.",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_id": {
                        "type": "string",
                        "description": "Product ID (e.g. PROD-101) or product name."
                    }
                },
                "required": ["product_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "clear_cart",
            "description": "Clear all items from the shopping cart.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_products",
            "description": "Search or list products from the store catalog by keyword or category.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search keyword or term (e.g. 'keyboard', 'headphones')."
                    },
                    "category": {
                        "type": "string",
                        "description": "Product category (e.g. 'Audio', 'Electronics', 'Accessories')."
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_product",
            "description": "Get detailed specifications, price, rating, and stock for a specific product.",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_id": {
                        "type": "string",
                        "description": "Product ID (e.g. PROD-101) or product name."
                    }
                },
                "required": ["product_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_product_stock",
            "description": "Update the inventory stock level of a product in the catalog.",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_id": {
                        "type": "string",
                        "description": "Product ID (e.g. PROD-101)."
                    },
                    "stock": {
                        "type": "integer",
                        "description": "New available inventory stock count."
                    }
                },
                "required": ["product_id", "stock"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_product_price",
            "description": "Update the price of a product in the catalog.",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_id": {
                        "type": "string",
                        "description": "Product ID (e.g. PROD-101)."
                    },
                    "price": {
                        "type": "number",
                        "description": "New unit price in USD."
                    }
                },
                "required": ["product_id", "price"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_product",
            "description": "Create a new product in the store catalog.",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Product name."
                    },
                    "price": {
                        "type": "number",
                        "description": "Product price in USD."
                    },
                    "stock": {
                        "type": "integer",
                        "description": "Initial inventory stock count."
                    },
                    "category": {
                        "type": "string",
                        "description": "Category (e.g. Audio, Electronics, Wearables, Accessories)."
                    },
                    "description": {
                        "type": "string",
                        "description": "Short product description."
                    }
                },
                "required": ["name", "price", "stock"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "delete_product",
            "description": "Delete a product permanently from the catalog.",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_id": {
                        "type": "string",
                        "description": "Product ID (e.g. PROD-107)."
                    }
                },
                "required": ["product_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "apply_coupon",
            "description": "Apply a promotional discount coupon code to the shopping cart.",
            "parameters": {
                "type": "object",
                "properties": {
                    "code": {
                        "type": "string",
                        "description": "Coupon code (e.g. SAVE20, FLASH50, SAVE10, WELCOME5)."
                    }
                },
                "required": ["code"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "remove_coupon",
            "description": "Remove currently applied promotional coupon from the shopping cart.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_coupons",
            "description": "List all active promotional coupons, codes, and discount terms.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "checkout_cart",
            "description": "Complete the checkout process for the current cart, placing an order and generating an order confirmation.",
            "parameters": {
                "type": "object",
                "properties": {
                    "full_name": {
                        "type": "string",
                        "description": "Customer full name for shipping."
                    },
                    "street": {
                        "type": "string",
                        "description": "Shipping street address."
                    },
                    "city": {
                        "type": "string",
                        "description": "Shipping city."
                    },
                    "state": {
                        "type": "string",
                        "description": "Shipping state or province code (e.g. WA, CA, NY)."
                    },
                    "zip": {
                        "type": "string",
                        "description": "Postal or zip code."
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_user_orders",
            "description": "Retrieve order history and past purchases for the current user.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "track_order",
            "description": "Look up status, delivery, and item details for a specific order ID.",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "string",
                        "description": "Order ID (e.g. ORD-1001 or ORD-XXXXXXXX)."
                    }
                },
                "required": ["order_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "filter_products_by_budget",
            "description": "Find and filter products by maximum price or category (e.g. items under $100).",
            "parameters": {
                "type": "object",
                "properties": {
                    "max_price": {
                        "type": "number",
                        "description": "Maximum budget or price in USD."
                    },
                    "category": {
                        "type": "string",
                        "description": "Optional category filter (e.g. Electronics, Accessories, Wearables, Apparel, Fitness, Home & Living, Grocery)."
                    }
                },
                "required": ["max_price"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_user_profile",
            "description": "Retrieve active customer account information, loyalty tier, or role.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    }
]


def execute_crud_tool(tool_name: str, args: Dict[str, Any], cart_id: str) -> ChatResponse:
    """Executes a CRUD tool action triggered by Capgemini Generative Engine."""
    try:
        if tool_name == "add_to_cart":
            raw_pid = args.get("product_id", "")
            prod_id = _resolve_product_id(raw_pid) or str(raw_pid).upper()
            qty = int(args.get("quantity", 1))
            if qty < 1:
                qty = 1
            updated_cart = cart_service.add_item(cart_id, prod_id, qty)
            prod = product_service.get_by_id(prod_id)
            return ChatResponse(
                reply=(
                    f"✅ **Added to Cart**: {qty}x **{prod.name}** (`{prod.id}`) at ${prod.price:.2f} each.\n\n"
                    f"🛒 Cart now has {len(updated_cart.items)} item(s) • Total: **${updated_cart.total_amount:.2f}**."
                ),
                action_type="cart_update",
                action_payload={"cart": updated_cart.model_dump(), "operation": "add_item", "product_id": prod_id, "quantity": qty},
                suggested_commands=["View Cart", "Apply SAVE20", "Show Products"]
            )

        elif tool_name == "view_cart":
            cart = cart_service.get_or_create_cart(cart_id)
            if not cart.items:
                return ChatResponse(
                    reply="🛒 **Your shopping cart is currently empty.**\n\nTry asking me: *'add headphones'* or *'show products'*.",
                    action_type="cart_update",
                    action_payload={"cart": cart.model_dump()},
                    suggested_commands=["Show Products", "Add Headphones to Cart", "Active Coupons"]
                )
            items_desc = "\n".join([f"• **{i.name}** (`{i.product_id}`) - {i.quantity}x @ ${i.unit_price:.2f} = ${i.subtotal:.2f}" for i in cart.items])
            coupon_str = f" (Coupon: `{cart.applied_coupon}` -${cart.discount_amount:.2f})" if cart.applied_coupon else ""
            return ChatResponse(
                reply=(
                    f"🛒 **Your Shopping Cart ({len(cart.items)} item{'s' if len(cart.items) != 1 else ''}):**\n\n"
                    f"{items_desc}\n\n"
                    f"• Subtotal: **${cart.subtotal:.2f}**\n"
                    f"• Discount: **${cart.discount_amount:.2f}**{coupon_str}\n"
                    f"• Tax (8%): **${cart.tax_amount:.2f}**\n"
                    f"• **Total: ${cart.total_amount:.2f}** (Version {cart.concurrency_version})"
                ),
                action_type="cart_update",
                action_payload={"cart": cart.model_dump()},
                suggested_commands=["Apply SAVE20", "Clear Cart", "Show Products"]
            )

        elif tool_name == "update_cart_quantity":
            raw_pid = args.get("product_id", "")
            prod_id = _resolve_product_id(raw_pid) or str(raw_pid).upper()
            new_qty = int(args.get("quantity", 1))
            updated_cart = cart_service.update_item_quantity(cart_id, prod_id, new_qty)
            return ChatResponse(
                reply=f"✏️ Updated `{prod_id}` quantity to **{new_qty}**. Cart subtotal: **${updated_cart.subtotal:.2f}**, Total: **${updated_cart.total_amount:.2f}**.",
                action_type="cart_update",
                action_payload={"cart": updated_cart.model_dump(), "operation": "update_quantity", "product_id": prod_id, "quantity": new_qty},
                suggested_commands=["View Cart", "Checkout now", "Apply SAVE20"]
            )

        elif tool_name == "remove_from_cart":
            raw_pid = args.get("product_id", "")
            prod_id = _resolve_product_id(raw_pid) or str(raw_pid).upper()
            updated_cart = cart_service.remove_item(cart_id, prod_id)
            return ChatResponse(
                reply=f"🗑️ Removed product `{prod_id}` from your cart. Total items: {len(updated_cart.items)}. Cart total: **${updated_cart.total_amount:.2f}**.",
                action_type="cart_update",
                action_payload={"cart": updated_cart.model_dump(), "operation": "remove_item", "product_id": prod_id},
                suggested_commands=["View Cart", "Show Products", "Apply SAVE20"]
            )

        elif tool_name == "clear_cart":
            cart_service.clear_cart(cart_id)
            fresh_cart = cart_service.get_or_create_cart(cart_id)
            return ChatResponse(
                reply="🗑️ **Cart Cleared**: Your shopping cart is now empty.",
                action_type="cart_update",
                action_payload={"cart": fresh_cart.model_dump(), "operation": "clear"},
                suggested_commands=["Show Products", "Active Coupons", "/help"]
            )

        elif tool_name == "search_products":
            query = args.get("query")
            category = args.get("category")
            products = product_service.get_all(search=query, category=category)
            if not products:
                products = product_service.get_all()
            prod_summaries = [f"• **{p.name}** (`{p.id}`) - **${p.price:.2f}** (Stock: {p.stock} units, {p.category})" for p in products[:5]]
            return ChatResponse(
                reply=(
                    f"🛍️ **Available Products ({len(products)} found):**\n\n"
                    + "\n".join(prod_summaries)
                    + "\n\n💡 *Tip: You can say `add PROD-101 to cart` or `update stock PROD-101 to 20`!*"
                ),
                action_type="product_search",
                action_payload={"products": [p.model_dump() for p in products[:5]]},
                suggested_commands=["View Cart", "Active Coupons", "Add Headphones to Cart"]
            )

        elif tool_name == "get_product":
            raw_pid = args.get("product_id", "")
            prod_id = _resolve_product_id(raw_pid) or str(raw_pid).upper()
            p = product_service.get_by_id(prod_id)
            return ChatResponse(
                reply=(
                    f"📦 **Product Details:**\n\n"
                    f"• **{p.name}** (`{p.id}`)\n"
                    f"• **Price:** ${p.price:.2f}\n"
                    f"• **Stock:** {p.stock} units available\n"
                    f"• **Category:** {p.category} | **Rating:** ⭐ {p.rating}\n"
                    f"• **Description:** {p.description}"
                ),
                action_type="product_search",
                action_payload={"products": [p.model_dump()]},
                suggested_commands=[f"Add {p.id} to cart", f"update stock {p.id} to 20", "Show Products"]
            )

        elif tool_name == "update_product_stock":
            raw_pid = args.get("product_id", "")
            prod_id = _resolve_product_id(raw_pid) or str(raw_pid).upper()
            new_stock = int(args.get("stock", 0))
            updated_prod = product_service.set_stock(prod_id, new_stock)
            return ChatResponse(
                reply=f"📦 **Stock Updated**: **{updated_prod.name}** (`{prod_id}`) inventory set to **{updated_prod.stock}** units.",
                action_type="product_crud",
                action_payload={"operation": "update_stock", "product": updated_prod.model_dump()},
                suggested_commands=[f"Get {prod_id}", "Show Products"]
            )

        elif tool_name == "update_product_price":
            raw_pid = args.get("product_id", "")
            prod_id = _resolve_product_id(raw_pid) or str(raw_pid).upper()
            new_price = float(args.get("price", 0.0))
            updated_prod = product_service.set_price(prod_id, new_price)
            return ChatResponse(
                reply=f"💲 **Price Updated**: **{updated_prod.name}** (`{prod_id}`) price set to **${updated_prod.price:.2f}**.",
                action_type="product_crud",
                action_payload={"operation": "update_price", "product": updated_prod.model_dump()},
                suggested_commands=[f"Get {prod_id}", "Show Products"]
            )

        elif tool_name == "create_product":
            name = str(args.get("name", "New Product")).strip()
            price = float(args.get("price", 49.99))
            stock = int(args.get("stock", 10))
            category = str(args.get("category", "Accessories")).capitalize()
            description = str(args.get("description", f"High-quality {name} added via AI Chatbot Assistant."))
            existing_all = product_service.get_all()
            next_num = 101 + len(existing_all)
            new_id = f"PROD-{next_num}"
            while any(p.id == new_id for p in existing_all):
                next_num += 1
                new_id = f"PROD-{next_num}"
            new_prod = Product(
                id=new_id,
                name=name,
                description=description,
                price=round(price, 2),
                stock=stock,
                category=category,
                rating=5.0,
                image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
            )
            created = product_service.add_product(new_prod)
            return ChatResponse(
                reply=(
                    f"✨ **Product Created Successfully!**\n\n"
                    f"• **ID:** `{created.id}`\n"
                    f"• **Name:** {created.name}\n"
                    f"• **Price:** ${created.price:.2f}\n"
                    f"• **Stock:** {created.stock} units\n"
                    f"• **Category:** {created.category}"
                ),
                action_type="product_crud",
                action_payload={"operation": "create", "product": created.model_dump()},
                suggested_commands=[f"Get {created.id}", f"Add {created.id} to cart", "Show Products"]
            )

        elif tool_name == "delete_product":
            raw_pid = args.get("product_id", "")
            prod_id = _resolve_product_id(raw_pid) or str(raw_pid).upper()
            prod_info = product_service.get_by_id(prod_id)
            product_service.delete_product(prod_id)
            return ChatResponse(
                reply=f"🗑️ **Product Deleted**: Successfully removed **{prod_info.name}** (`{prod_id}`) from the catalog.",
                action_type="product_crud",
                action_payload={"operation": "delete", "product_id": prod_id},
                suggested_commands=["Show Products", "View Cart"]
            )

        elif tool_name == "apply_coupon":
            code = str(args.get("code", "")).upper().strip()
            updated_cart = cart_service.apply_coupon(cart_id, code)
            return ChatResponse(
                reply=(
                    f"🎉 **Coupon `{code}` Applied Successfully!**\n\n"
                    f"• Discount: **-${updated_cart.discount_amount:.2f}**\n"
                    f"• New Subtotal: ${updated_cart.subtotal:.2f}\n"
                    f"• New Cart Total: **${updated_cart.total_amount:.2f}**"
                ),
                action_type="cart_update",
                action_payload={"cart": updated_cart.model_dump(), "operation": "apply_coupon", "coupon": code},
                suggested_commands=["View Cart", "Checkout now"]
            )

        elif tool_name == "remove_coupon":
            updated_cart = cart_service.remove_coupon(cart_id)
            return ChatResponse(
                reply=f"🎟️ **Coupon Removed**: Disapplied coupon from your cart. New total is **${updated_cart.total_amount:.2f}**.",
                action_type="cart_update",
                action_payload={"cart": updated_cart.model_dump(), "operation": "remove_coupon"},
                suggested_commands=["Apply SAVE20", "View Cart"]
            )

        elif tool_name == "list_coupons":
            return ChatResponse(
                reply=(
                    "🎟️ **Active Store Promotional Coupons:**\n\n"
                    "• **`SAVE20`**: 20% discount on orders of $50 or more!\n"
                    "• **`FLASH50`**: 50% discount on orders over $200!\n"
                    "• **`SAVE10`**: 10% discount on orders over $50!\n"
                    "• **`WELCOME5`**: 5% discount on all orders!\n\n"
                    "*(Test Rejection Codes: `EXPIRED30` tests expired coupon error, `MINSPEND100` tests min spend).* \n\n"
                    "💡 *Say `apply coupon SAVE20` to activate!*"
                ),
                action_type="text",
                suggested_commands=["Apply SAVE20", "View Cart", "Show Products"]
            )

        elif tool_name == "checkout_cart":
            cart = cart_service.get_or_create_cart(cart_id)
            if not cart.items:
                return ChatResponse(
                    reply="🛒 **Your cart is empty.** Add items to your cart first before checking out!\n\nTry saying: *'show products'* or *'add running shoes'*.",
                    suggested_commands=["Show Products", "View Cart"]
                )
            shipping_addr = {
                "full_name": args.get("full_name") or "Valued Customer",
                "street": args.get("street") or "100 Tech Blvd",
                "city": args.get("city") or "Seattle",
                "state": args.get("state") or "WA",
                "zip": args.get("zip") or "98101",
                "country": "USA"
            }
            order = order_service.checkout(
                cart_id=cart_id,
                shipping_address=shipping_addr,
                user_id="USER-1001"
            )
            items_summary = "\n".join([f"• **{i.name}** ({i.quantity}x @ ${i.unit_price:.2f})" for i in order.items])
            return ChatResponse(
                reply=(
                    f"🎉 **Order Placed Successfully!**\n\n"
                    f"• **Order ID:** `{order.order_id}`\n"
                    f"• **Status:** `{order.status}`\n"
                    f"• **Total Paid:** **${order.total_amount:.2f}**\n"
                    f"• **Ship To:** {shipping_addr['full_name']}, {shipping_addr['street']}, {shipping_addr['city']}, {shipping_addr['state']} {shipping_addr['zip']}\n\n"
                    f"**Purchased Items:**\n{items_summary}\n\n"
                    f"🚚 Estimated Delivery: 2-3 business days. You can track this order anytime with `track order {order.order_id}`!"
                ),
                action_type="cart_update",
                action_payload={"order": order.model_dump(), "operation": "checkout", "cart": {"items": [], "total_amount": 0.0}},
                suggested_commands=[f"Track {order.order_id}", "My Orders", "Show Products"]
            )

        elif tool_name == "get_user_orders":
            orders = order_service.get_user_orders("USER-1001")
            if not orders:
                # Fallback to demo sample
                orders = order_service.get_all_orders()[:3]
            if not orders:
                return ChatResponse(
                    reply="📦 **No past orders found.** You haven't placed an order yet!",
                    suggested_commands=["Show Products", "View Cart"]
                )
            orders_text = "\n\n".join([
                f"• **Order `{o.get('order_id')}`** — Status: `{o.get('status')}` | Total: **${float(o.get('total_amount', 0)):.2f}** ({len(o.get('items', []))} item(s))"
                for o in orders[:5]
            ])
            return ChatResponse(
                reply=f"📦 **Your Recent Orders ({len(orders)} found):**\n\n{orders_text}\n\n💡 *Tip: Say `track order {orders[0].get('order_id')}` for full details!*",
                action_type="text",
                action_payload={"orders": orders[:5]},
                suggested_commands=[f"Track {orders[0].get('order_id')}", "Show Products", "View Cart"]
            )

        elif tool_name == "track_order":
            order_id = str(args.get("order_id", "")).strip().upper()
            found_order = order_service.get_order_by_id(order_id)
            if not found_order:
                # Try finding across all orders
                all_orders = order_service.get_all_orders()
                for o in all_orders:
                    if o.get("order_id", "").upper() == order_id:
                        found_order = o
                        break
            if not found_order:
                return ChatResponse(
                    reply=f"⚠️ Order `{order_id}` was not found. Please check your order reference ID.",
                    suggested_commands=["My Orders", "Show Products"]
                )
            addr = found_order.get("shipping_address") or {}
            addr_str = f"{addr.get('street', 'N/A')}, {addr.get('city', '')} {addr.get('state', '')}" if isinstance(addr, dict) else str(addr)
            return ChatResponse(
                reply=(
                    f"🚚 **Order Tracking Details:**\n\n"
                    f"• **Order ID:** `{found_order.get('order_id')}`\n"
                    f"• **Status:** `{found_order.get('status')}`\n"
                    f"• **Total Amount:** **${float(found_order.get('total_amount', 0)):.2f}**\n"
                    f"• **Destination:** {addr_str}\n"
                    f"• **Items:** {len(found_order.get('items', []))} line item(s)\n"
                    f"• **Created:** {found_order.get('created_at', 'Recently')}"
                ),
                action_type="text",
                action_payload={"order": found_order},
                suggested_commands=["My Orders", "View Cart", "Show Products"]
            )

        elif tool_name == "filter_products_by_budget":
            max_price = float(args.get("max_price", 100.0))
            cat = args.get("category")
            prods = product_service.get_all(category=cat)
            filtered = [p for p in prods if p.price <= max_price]
            if not filtered:
                return ChatResponse(
                    reply=f"🔍 No products found under **${max_price:.2f}** in `{cat or 'all categories'}`.",
                    suggested_commands=["Show Products", "View Cart"]
                )
            lines = [f"• **{p.name}** (`{p.id}`) - **${p.price:.2f}** ({p.category}, ⭐ {p.rating})" for p in filtered[:6]]
            return ChatResponse(
                reply=f"💰 **Products Under ${max_price:.2f} ({len(filtered)} found):**\n\n" + "\n".join(lines),
                action_type="product_search",
                action_payload={"products": [p.model_dump() for p in filtered[:6]]},
                suggested_commands=[f"Add {filtered[0].id} to cart", "View Cart", "Active Coupons"]
            )

        elif tool_name == "get_user_profile":
            user = auth_service.get_user_by_id("USER-1001") or auth_service.get_user_by_email("customer@aerostore.io")
            if user:
                user_display_name = getattr(user, "name", None) or getattr(user, "full_name", "Customer")
                return ChatResponse(
                    reply=(
                        f"👤 **Account Profile:**\n\n"
                        f"• **Name:** {user_display_name}\n"
                        f"• **Email:** `{user.email}`\n"
                        f"• **Role:** `{user.role.upper()}`\n"
                        f"• **Loyalty Status:** ⭐ AeroStore VIP Member\n"
                        f"• **Default Cart:** `{cart_id}`"
                    ),
                    action_type="text",
                    suggested_commands=["My Orders", "View Cart", "Show Products"]
                )
            return ChatResponse(
                reply=f"👤 **Guest Session Active** (Cart ID: `{cart_id}`). You can shop, apply discounts, and checkout anytime!",
                suggested_commands=["Show Products", "View Cart"]
            )

    except OutOfStockException as e:
        return ChatResponse(
            reply=f"⚠️ Cannot proceed: Item is out of stock or only {e.available} available.",
            suggested_commands=["Show Products", "View Cart"]
        )
    except ProductNotFoundException as e:
        return ChatResponse(
            reply=f"⚠️ Product not found in store catalog: {str(e)}",
            suggested_commands=["Show Products"]
        )
    except CouponException as e:
        return ChatResponse(
            reply=f"❌ **Coupon Error**: {e.detail}",
            suggested_commands=["Active Coupons", "View Cart"]
        )
    except Exception as e:
        return ChatResponse(
            reply=f"⚠️ Operation error: {str(e)}",
            suggested_commands=["View Cart", "Show Products"]
        )

    return ChatResponse(
        reply=f"⚠️ Unknown tool command: {tool_name}",
        suggested_commands=["View Cart", "Show Products"]
    )


@router.post("", response_model=ChatResponse, summary="Interact with E-Commerce Chatbot")
def chat(request: ChatRequest):
    msg = request.message.strip()
    m_lower = msg.lower()
    cart_id = request.session_id or "default_cart"

    # ----------------------------------------------------
    # 1. HELP & USE CASE COMMAND DISPATCHER
    # ----------------------------------------------------
    if m_lower in ("/help", "help", "commands", "what can you do"):
        return ChatResponse(
            reply=(
                "👋 **Welcome to the AeroStore Interactive CRUD Chatbot!**\n\n"
                "I can perform full **Create, Read, Update, and Delete (CRUD)** operations directly on your store session:\n\n"
                "🛒 **Cart CRUD Operations:**\n"
                "• **Create/Add:** `add PROD-101` or `add 2 headphones to cart` or `/add PROD-101 2`\n"
                "• **Read:** `view cart` or `show cart` or `/cart`\n"
                "• **Update:** `update PROD-101 quantity to 3` or `/update-qty PROD-101 3`\n"
                "• **Delete:** `remove PROD-101` or `delete headphones from cart` or `clear cart`\n\n"
                "📦 **Product Catalog CRUD Operations:**\n"
                "• **Read:** `show products`, `search keyboard`, `get PROD-101`\n"
                "• **Update:** `update stock PROD-101 to 25` or `update price PROD-102 to 119.99`\n"
                "• **Create:** `create product Gaming Chair, price 149.99, stock 10, category Accessories`\n"
                "• **Delete:** `delete product PROD-107`\n\n"
                "🎟️ **Coupon Operations:**\n"
                "• **Read:** `show coupons` or `what coupons exist?`\n"
                "• **Apply/Update:** `apply coupon SAVE20`\n"
                "• **Delete:** `remove coupon`\n\n"
                "💳 **Checkout & Order Operations:**\n"
                "• **Checkout:** `checkout`, `place order`, or `buy now`\n"
                "• **Order History:** `my orders` or `order history`\n"
                "• **Order Tracking:** `track order <ORD-ID>`\n"
                "• **Budget Filter:** `items under $100` or `best sellers under $50`\n"
                "• **User Profile:** `my profile` or `account info`\n\n"
                "⚡ **AI Use Case Commands:**\n"
                "• `/uc1` - Architecture & ADRs\n"
                "• `/uc2` - OpenAPI 3.0 YAML Scaffolding\n"
                "• `/uc3` - WCAG 2.1 AA Accessibility Audit\n"
                "• `/uc4` - AI Code Review & Sonar Governance\n"
                "• `/uc5` - Real-Time Edge Case Simulation\n"
                "• `/security` - Attack & Vulnerability Audit\n"
                "• `/tests` - AI-Generated Pytest Suite"
            ),
            action_type="help",
            suggested_commands=["View Cart", "Show Products", "Checkout", "My Orders", "Active Coupons"]
        )

    # Use Case 1
    if m_lower in ("/uc1", "/architecture", "show architecture", "requirements"):
        arch = architecture_engine.generate_architecture_json()
        return ChatResponse(
            reply=(
                f"🏛️ **USE CASE 1: AI Requirements & Architecture Decomposition**\n\n"
                f"**System Style:** {arch.architecture_style} (Target: {arch.concurrent_users:,} concurrent users)\n\n"
                f"**Key Microservice Boundaries:**\n"
                + "\n".join([f"• **{s.name}** ({s.api_boundary}): {s.responsibility}" for s in arch.services[:4]])
                + "\n\n📄 **ADR Documents Generated:**\n"
                "• `ADR-001`: Why Microservices for Online Shopping?\n"
                "• `ADR-002`: Why AI/LLMs are strictly forbidden in payment settlement logic.\n"
                f"\n💡 *Trade-off:* {arch.trade_off_analysis['why_microservices']}"
            ),
            action_type="use_case_execution",
            action_payload={"use_case": 1, "architecture": arch.model_dump()},
            suggested_commands=["/openapi", "/a11y", "/codereview", "/simulate"]
        )

    # RAG Knowledge Search Command (/rag <query> or "ask rag <query>")
    if m_lower.startswith("/rag") or m_lower.startswith("ask rag ") or m_lower == "rag":
        from ...rag.rag_engine import rag_engine
        rag_query = re.sub(r"^(/rag|ask rag)\s*", "", msg, flags=re.IGNORECASE).strip()
        if not rag_query:
            return ChatResponse(
                reply=(
                    "📚 **AeroStore RAG (Retrieval-Augmented Generation) Engine**\n\n"
                    "Ask factual questions grounded in authoritative store documentation and technical specifications:\n\n"
                    "• `/rag return policy` — 30-day RMA, refund timelines, and restocking terms\n"
                    "• `/rag warranty` — 2-year manufacturer hardware coverage and claims\n"
                    "• `/rag headphone specs` — 40mm beryllium drivers, ANC decibel isolation\n"
                    "• `/rag shipping slas` — Same-day dispatch rules and express transit\n"
                    "• `/rag why microservices` — Architectural Decision Record (ADR-001)\n\n"
                    "💡 *Type `/rag <your question>` to query the vector knowledge base!*"
                ),
                suggested_commands=["/rag return policy", "/rag warranty", "/rag headphone specs"]
            )
        rag_res = rag_engine.answer_query(rag_query)
        sources_md = ""
        if rag_res.sources:
            sources_md = "\n\n📚 **Authoritative Sources Cited:**\n" + "\n".join(
                [f"• **{s.title}** ({s.category}) — *Score: {s.relevance_score:.2f}*" for s in rag_res.sources]
            )
        return ChatResponse(
            reply=f"📖 **RAG Grounded Response:**\n\n{rag_res.answer}{sources_md}",
            action_type="text",
            suggested_commands=["/rag warranty", "/rag shipping slas", "View Cart"]
        )

    # Use Case 2
    if m_lower in ("/uc2", "/openapi", "/scaffold", "show openapi"):
        return ChatResponse(
            reply=(
                "📄 **USE CASE 2: Contract-First OpenAPI 3.0 Scaffolding**\n\n"
                "• Generated contract: `openapi.yaml` (OpenAPI 3.0.3)\n"
                "• Enforces RFC 7807 structured Problem Details error schema\n"
                "• Fully scaffolds `/api/v1/products` and `/api/v1/cart` controllers\n"
                "• Includes Token Limit Truncation safeguards and schema validation layers."
            ),
            action_type="use_case_execution",
            action_payload={"use_case": 2, "yaml_preview": openapi_generator.get_spec_yaml()[:400] + "..."},
            suggested_commands=["/a11y", "/codereview", "/simulate"]
        )

    # Use Case 3
    if m_lower in ("/uc3", "/a11y", "/frontend", "audit frontend"):
        return ChatResponse(
            reply=(
                "🎨 **USE CASE 3: Frontend Accessibility (WCAG 2.1 AA) & UI Risk Control**\n\n"
                "• **Accessibility Compliance Score: 100% (WCAG 2.1 AA)**\n"
                "• Screen reader ARIA landmarks: `<main>`, `<nav>`, `<header>`\n"
                "• Dynamic cart announcements via `aria-live='polite'`\n"
                "• **Mitigated UI Risks:** Double-click checkout races prevented, direct state mutations eliminated via immutable patterns."
            ),
            action_type="use_case_execution",
            action_payload={"use_case": 3},
            suggested_commands=["/codereview", "/simulate", "/security"]
        )

    # Use Case 4
    if m_lower in ("/uc4", "/codereview", "/review", "review code"):
        review = ai_reviewer.review_code()
        return ChatResponse(
            reply=(
                "🔍 **USE CASE 4: AI Code Review & Quality Governance Report**\n\n"
                f"**Overall Risk Level:** `{review.risk_level}`\n"
                f"**Complexity Score:** `{review.complexity_score}`\n\n"
                f"🚨 **Identified Vulnerabilities:**\n"
                + "\n".join([f"• {issue}" for issue in review.security_issues])
                + "\n\n🛠️ **Refactoring Recommendations:**\n"
                + "\n".join([f"• {sug}" for sug in review.refactor_suggestions[:3]])
            ),
            action_type="use_case_execution",
            action_payload={"use_case": 4, "review": review.model_dump()},
            suggested_commands=["/simulate", "/security", "/tests"]
        )

    # Use Case 5 - Simulations
    if m_lower in ("/uc5", "/simulate", "simulate", "run simulations"):
        stock_sim = edge_case_simulator.simulate_out_of_stock()
        timeout_sim = edge_case_simulator.simulate_payment_timeout()
        coupon_sim = edge_case_simulator.simulate_invalid_coupon()
        occ_sim = edge_case_simulator.simulate_concurrent_modification()
        return ChatResponse(
            reply=(
                "🧪 **USE CASE 5: Real-Time Edge Case Simulation Results**\n\n"
                f"1. **{stock_sim.title}**: Status `{stock_sim.final_status}`\n"
                f"   - Telemetry: {stock_sim.steps[-1].telemetry}\n\n"
                f"2. **{timeout_sim.title}**: Status `{timeout_sim.final_status}`\n"
                f"   - Telemetry: {timeout_sim.steps[-1].telemetry}\n\n"
                f"3. **{coupon_sim.title}**: Status `{coupon_sim.final_status}`\n"
                f"   - Telemetry: {coupon_sim.steps[-1].telemetry}\n\n"
                f"4. **{occ_sim.title}**: Status `{occ_sim.final_status}`\n"
                f"   - Telemetry: {occ_sim.steps[-1].telemetry}"
            ),
            action_type="use_case_execution",
            action_payload={"use_case": 5, "simulations": [stock_sim.model_dump(), timeout_sim.model_dump()]},
            suggested_commands=["/security", "/retry-demo", "/tests"]
        )

    if m_lower in ("/security", "security test", "run security"):
        audit = security_auditor.run_security_audit()
        return ChatResponse(
            reply=(
                f"🛡️ **USE CASE 5: Automated Security Scenario Audit**\n\n"
                f"**Overall Status:** `{audit['overall_status']}`\n\n"
                + "\n".join([f"• **{r['vector']}**: `{r['status']}`" for r in audit["results"]])
            ),
            action_type="use_case_execution",
            action_payload={"security_audit": audit},
            suggested_commands=["/retry-demo", "/tests", "/architecture"]
        )

    if m_lower in ("/retry-demo", "retry demo", "reprompt demo"):
        bench = retry_benchmark.get_benchmark_data()
        return ChatResponse(
            reply=(
                "📊 **USE CASE 5: Retry vs Re-prompt Benchmark**\n\n"
                "• **1st Attempt Success:** Naive Re-Prompt `35%` vs Targeted Retry `98%` (+63% boost)\n"
                "• **Token Efficiency:** 1,450 tokens vs 180 tokens (`87.6% savings`)\n"
                "• **Convergence Speed:** 4,200ms vs 650ms (`6.4x faster`)\n"
                "• **Root Cause:** Sending the JSON Schema error diff specifically directs LLM attention to the violated AST node."
            ),
            action_type="use_case_execution",
            action_payload={"benchmark": bench},
            suggested_commands=["/tests", "/simulate"]
        )

    if m_lower in ("/tests", "/generate", "generate tests", "run tests"):
        suite = test_generator.generate_cart_service_tests()
        return ChatResponse(
            reply=(
                f"🧪 **USE CASE 5: AI-Generated Pytest Suite ({suite.module_name})**\n\n"
                f"**Framework:** {suite.framework}\n"
                f"**Coverage:** {suite.coverage_score}\n\n"
                + "\n".join([f"• `{tc.test_name}`: {tc.scenario}" for tc in suite.test_cases])
            ),
            action_type="use_case_execution",
            action_payload={"test_suite": suite.model_dump()},
            suggested_commands=["/simulate", "/security"]
        )

    # ----------------------------------------------------
    # 2. CART CRUD OPERATIONS
    # ----------------------------------------------------
    # A. Clear Cart (Delete All)
    if any(k in m_lower for k in ["clear cart", "empty cart", "delete all items", "/clear-cart", "/clearcart"]):
        cart_service.clear_cart(cart_id)
        fresh_cart = cart_service.get_or_create_cart(cart_id)
        return ChatResponse(
            reply="🗑️ **Cart Cleared**: Your shopping cart is now empty.",
            action_type="cart_update",
            action_payload={"cart": fresh_cart.model_dump(), "operation": "clear"},
            suggested_commands=["Show Products", "Active Coupons", "/help"]
        )

    # B. Remove from Cart (Delete Single Item)
    if any(k in m_lower for k in ["remove from cart", "delete from cart", "/remove", "remove item", "drop from cart"]) or (
        m_lower.startswith("remove ") and "coupon" not in m_lower
    ):
        prod_id = _extract_product_id(msg)
        if not prod_id:
            return ChatResponse(
                reply="⚠️ Please specify which product to remove (e.g. `remove PROD-101` or `remove headphones`).",
                suggested_commands=["View Cart", "Show Products"]
            )
        try:
            updated_cart = cart_service.remove_item(cart_id, prod_id)
            return ChatResponse(
                reply=f"🗑️ Removed product `{prod_id}` from your cart. Total items: {len(updated_cart.items)}. Cart total: **${updated_cart.total_amount:.2f}**.",
                action_type="cart_update",
                action_payload={"cart": updated_cart.model_dump(), "operation": "remove_item", "product_id": prod_id},
                suggested_commands=["View Cart", "Show Products", "Apply SAVE20"]
            )
        except Exception as e:
            return ChatResponse(
                reply=f"⚠️ Could not remove `{prod_id}`: {str(e)}",
                suggested_commands=["View Cart"]
            )

    # C. Update Cart Item Quantity (Update)
    if any(k in m_lower for k in ["update quantity", "change quantity", "set quantity", "update qty", "change qty", "/update-qty"]) or (
        ("update " in m_lower or "change " in m_lower or "set " in m_lower)
        and any(w in m_lower for w in ["qty", "quantity", "count", "units", "items", "to "])
        and ("cart" in m_lower or _extract_product_id(msg) is not None)
        and not ("stock" in m_lower or "price" in m_lower)
    ):
        prod_id = _extract_product_id(msg)
        if not prod_id:
            return ChatResponse(
                reply="⚠️ Please specify the product ID and new quantity (e.g. `update PROD-101 quantity to 3`).",
                suggested_commands=["View Cart"]
            )
        new_qty = _extract_quantity(msg, default=-1)
        if new_qty < 0:
            return ChatResponse(
                reply=f"⚠️ Please specify a valid quantity for `{prod_id}` (e.g. `update {prod_id} quantity to 2`).",
                suggested_commands=["View Cart"]
            )
        try:
            updated_cart = cart_service.update_item_quantity(cart_id, prod_id, new_qty)
            return ChatResponse(
                reply=f"✏️ Updated `{prod_id}` quantity to **{new_qty}**. Cart subtotal: **${updated_cart.subtotal:.2f}**, Total: **${updated_cart.total_amount:.2f}**.",
                action_type="cart_update",
                action_payload={"cart": updated_cart.model_dump(), "operation": "update_quantity", "product_id": prod_id, "quantity": new_qty},
                suggested_commands=["View Cart", "Checkout now", "Apply SAVE20"]
            )
        except OutOfStockException as e:
            return ChatResponse(
                reply=f"⚠️ Cannot update quantity: Available stock for `{prod_id}` is only {e.available} units.",
                suggested_commands=["View Cart", "Show Products"]
            )
        except Exception as e:
            return ChatResponse(
                reply=f"⚠️ Update failed: {str(e)}",
                suggested_commands=["View Cart"]
            )

    # D. Add to Cart (Create Item in Cart)
    if any(k in m_lower for k in ["add to cart", "add item", "put in cart", "/add"]) or (
        m_lower.startswith("add ") and "coupon" not in m_lower
    ):
        prod_id = _extract_product_id(msg)
        if not prod_id:
            return ChatResponse(
                reply="⚠️ Please specify which product to add (e.g. `add PROD-101 to cart` or `add 2 headphones`).",
                suggested_commands=["Show Products", "View Cart"]
            )
        qty = _extract_quantity(msg, default=1)
        try:
            updated_cart = cart_service.add_item(cart_id, prod_id, qty)
            prod = product_service.get_by_id(prod_id)
            return ChatResponse(
                reply=(
                    f"✅ **Added to Cart**: {qty}x **{prod.name}** (`{prod.id}`) at ${prod.price:.2f} each.\n\n"
                    f"🛒 Cart now has {len(updated_cart.items)} item(s) • Total: **${updated_cart.total_amount:.2f}**."
                ),
                action_type="cart_update",
                action_payload={"cart": updated_cart.model_dump(), "operation": "add_item", "product_id": prod_id, "quantity": qty},
                suggested_commands=["View Cart", "Apply SAVE20", "Show Products"]
            )
        except OutOfStockException as e:
            return ChatResponse(
                reply=f"⚠️ Cannot add to cart: `{prod_id}` is out of stock or only {e.available} available.",
                suggested_commands=["Show Products", "View Cart"]
            )
        except Exception as e:
            return ChatResponse(
                reply=f"⚠️ Could not add item: {str(e)}",
                suggested_commands=["Show Products"]
            )

    # E. View Cart (Read Cart)
    if any(k in m_lower for k in ["view cart", "show cart", "my cart", "cart total", "/cart", "whats in my cart"]):
        cart = cart_service.get_or_create_cart(cart_id)
        if not cart.items:
            return ChatResponse(
                reply="🛒 **Your shopping cart is currently empty.**\n\nTry asking me: *'add headphones'* or *'show products'*.",
                action_type="cart_update",
                action_payload={"cart": cart.model_dump()},
                suggested_commands=["Show Products", "Add Headphones to Cart", "Active Coupons"]
            )
        items_desc = "\n".join([f"• **{i.name}** (`{i.product_id}`) - {i.quantity}x @ ${i.unit_price:.2f} = ${i.subtotal:.2f}" for i in cart.items])
        coupon_str = f" (Coupon: `{cart.applied_coupon}` -${cart.discount_amount:.2f})" if cart.applied_coupon else ""
        return ChatResponse(
            reply=(
                f"🛒 **Your Shopping Cart ({len(cart.items)} item{'s' if len(cart.items) != 1 else ''}):**\n\n"
                f"{items_desc}\n\n"
                f"• Subtotal: **${cart.subtotal:.2f}**\n"
                f"• Discount: **${cart.discount_amount:.2f}**{coupon_str}\n"
                f"• Tax (8%): **${cart.tax_amount:.2f}**\n"
                f"• **Total: ${cart.total_amount:.2f}** (Version {cart.concurrency_version})"
            ),
            action_type="cart_update",
            action_payload={"cart": cart.model_dump()},
            suggested_commands=["Apply SAVE20", "Clear Cart", "Show Products"]
        )

    # ----------------------------------------------------
    # 3. PRODUCT CATALOG CRUD OPERATIONS
    # ----------------------------------------------------
    # A. Delete Product (Delete from Catalog)
    if any(k in m_lower for k in ["delete product", "remove product", "/delete-product", "delete catalog item"]):
        prod_id = _extract_product_id(msg)
        if not prod_id:
            return ChatResponse(
                reply="⚠️ Please specify the product ID to delete (e.g. `delete product PROD-107`).",
                suggested_commands=["Show Products"]
            )
        try:
            prod_info = product_service.get_by_id(prod_id)
            product_service.delete_product(prod_id)
            return ChatResponse(
                reply=f"🗑️ **Product Deleted**: Successfully removed **{prod_info.name}** (`{prod_id}`) from the catalog.",
                action_type="product_crud",
                action_payload={"operation": "delete", "product_id": prod_id},
                suggested_commands=["Show Products", "View Cart"]
            )
        except ProductNotFoundException:
            return ChatResponse(
                reply=f"⚠️ Product `{prod_id}` not found in catalog.",
                suggested_commands=["Show Products"]
            )

    # B. Update Product Stock (Update Catalog Stock)
    if ("update stock" in m_lower or "set stock" in m_lower or "/update-stock" in m_lower or "/stock" in m_lower):
        prod_id = _extract_product_id(msg)
        new_stock = _extract_quantity(msg, default=-1)
        if not prod_id or new_stock < 0:
            return ChatResponse(
                reply="⚠️ Usage: `update stock <product_id> to <count>` (e.g. `update stock PROD-101 to 25`).",
                suggested_commands=["Show Products"]
            )
        try:
            updated_prod = product_service.set_stock(prod_id, new_stock)
            return ChatResponse(
                reply=f"📦 **Stock Updated**: **{updated_prod.name}** (`{prod_id}`) inventory set to **{updated_prod.stock}** units.",
                action_type="product_crud",
                action_payload={"operation": "update_stock", "product": updated_prod.model_dump()},
                suggested_commands=[f"Get {prod_id}", "Show Products"]
            )
        except ProductNotFoundException:
            return ChatResponse(
                reply=f"⚠️ Product `{prod_id}` does not exist.",
                suggested_commands=["Show Products"]
            )

    # C. Update Product Price (Update Catalog Price)
    if "update price" in m_lower or "set price" in m_lower or "/update-price" in m_lower:
        prod_id = _extract_product_id(msg)
        price_match = re.search(r"(?:price|to)\s*[:=]?\s*\$?(\d+(?:\.\d{1,2})?)", msg, re.IGNORECASE)
        if not prod_id or not price_match:
            return ChatResponse(
                reply="⚠️ Usage: `update price <product_id> to <price>` (e.g. `update price PROD-102 to 119.99`).",
                suggested_commands=["Show Products"]
            )
        new_price = float(price_match.group(1))
        try:
            updated_prod = product_service.set_price(prod_id, new_price)
            return ChatResponse(
                reply=f"💲 **Price Updated**: **{updated_prod.name}** (`{prod_id}`) price set to **${updated_prod.price:.2f}**.",
                action_type="product_crud",
                action_payload={"operation": "update_price", "product": updated_prod.model_dump()},
                suggested_commands=[f"Get {prod_id}", "Show Products"]
            )
        except ProductNotFoundException:
            return ChatResponse(
                reply=f"⚠️ Product `{prod_id}` does not exist.",
                suggested_commands=["Show Products"]
            )

    # D. Create Product (Insert New into Catalog)
    if any(k in m_lower for k in ["create product", "add product", "new product", "/create-product"]):
        # Parse fields: name, price, stock, category
        # example: "create product Gaming Chair, price 149.99, stock 10, category Accessories"
        name_match = re.search(r"(?:product|name)\s+([^,]+?)(?:,|$|\s+price)", msg, re.IGNORECASE)
        price_match = re.search(r"price\s*[:=]?\s*\$?(\d+(?:\.\d{1,2})?)", msg, re.IGNORECASE)
        stock_match = re.search(r"stock\s*[:=]?\s*(\d+)", msg, re.IGNORECASE)
        cat_match = re.search(r"category\s*[:=]?\s*([a-zA-Z]+)", msg, re.IGNORECASE)

        if not name_match:
            return ChatResponse(
                reply=(
                    "⚠️ To create a product, please provide details:\n"
                    "Format: `create product <Name>, price <Price>, stock <Stock>, category <Category>`\n"
                    "Example: `create product Studio Mic, price 89.99, stock 20, category Electronics`"
                ),
                suggested_commands=["Show Products"]
            )

        name = name_match.group(1).strip()
        price = float(price_match.group(1)) if price_match else 49.99
        stock = int(stock_match.group(1)) if stock_match else 10
        category = cat_match.group(1).capitalize() if cat_match else "Accessories"

        # Generate unique ID
        existing_all = product_service.get_all()
        next_num = 101 + len(existing_all)
        new_id = f"PROD-{next_num}"
        # Ensure uniqueness
        while any(p.id == new_id for p in existing_all):
            next_num += 1
            new_id = f"PROD-{next_num}"

        new_prod = Product(
            id=new_id,
            name=name,
            description=f"High-quality {name} added via AI Chatbot Assistant.",
            price=round(price, 2),
            stock=stock,
            category=category,
            rating=5.0,
            image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
        )
        created = product_service.add_product(new_prod)
        return ChatResponse(
            reply=(
                f"✨ **Product Created Successfully!**\n\n"
                f"• **ID:** `{created.id}`\n"
                f"• **Name:** {created.name}\n"
                f"• **Price:** ${created.price:.2f}\n"
                f"• **Stock:** {created.stock} units\n"
                f"• **Category:** {created.category}"
            ),
            action_type="product_crud",
            action_payload={"operation": "create", "product": created.model_dump()},
            suggested_commands=[f"Get {created.id}", f"Add {created.id} to cart", "Show Products"]
        )

    # E. Get Single Product (Read Single)
    if (m_lower.startswith("get ") or m_lower.startswith("view product ") or m_lower.startswith("/product ")) and _extract_product_id(msg):
        prod_id = _extract_product_id(msg)
        try:
            p = product_service.get_by_id(prod_id)
            return ChatResponse(
                reply=(
                    f"📦 **Product Details:**\n\n"
                    f"• **{p.name}** (`{p.id}`)\n"
                    f"• **Price:** ${p.price:.2f}\n"
                    f"• **Stock:** {p.stock} units available\n"
                    f"• **Category:** {p.category} | **Rating:** ⭐ {p.rating}\n"
                    f"• **Description:** {p.description}"
                ),
                action_type="product_search",
                action_payload={"products": [p.model_dump()]},
                suggested_commands=[f"Add {p.id} to cart", f"update stock {p.id} to 20", "Show Products"]
            )
        except ProductNotFoundException:
            return ChatResponse(reply=f"⚠️ Product `{prod_id}` not found.", suggested_commands=["Show Products"])

    # F. Product Search / List (Read Catalog Commands)
    is_explicit_catalog_query = any(m_lower.startswith(prefix) for prefix in [
        "search", "show products", "list products", "show catalog", "list catalog", 
        "view products", "get products", "show items", "list items", "catalog"
    ]) or m_lower in ["products", "items"] or "search " in m_lower
    
    if is_explicit_catalog_query:
        search_kw = None
        # Clean search query
        for noise in ["show", "list", "search", "find", "get", "products", "items", "all", "catalog"]:
            if noise in m_lower:
                m_lower_cleaned = re.sub(rf"\b{noise}\b", "", m_lower).strip()
                if m_lower_cleaned:
                    search_kw = m_lower_cleaned
                    break

        products = product_service.get_all(search=search_kw)
        if not products:
            products = product_service.get_all()

        prod_summaries = [f"• **{p.name}** (`{p.id}`) - **${p.price:.2f}** (Stock: {p.stock} units)" for p in products[:5]]
        return ChatResponse(
            reply=(
                f"🛍️ **Available Products ({len(products)} found):**\n\n"
                + "\n".join(prod_summaries)
                + "\n\n💡 *Tip: You can say `add PROD-101 to cart` or `update stock PROD-101 to 20`!*"
            ),
            action_type="product_search",
            action_payload={"products": [p.model_dump() for p in products[:5]]},
            suggested_commands=["View Cart", "Active Coupons", "Add Headphones to Cart"]
        )

    # ----------------------------------------------------
    # 4. COUPON CRUD OPERATIONS
    # ----------------------------------------------------
    # A. Remove Coupon (Delete Applied Coupon)
    if any(k in m_lower for k in ["remove coupon", "delete coupon", "/remove-coupon", "clear coupon"]):
        updated_cart = cart_service.remove_coupon(cart_id)
        return ChatResponse(
            reply=f"🎟️ **Coupon Removed**: Disapplied coupon from your cart. New total is **${updated_cart.total_amount:.2f}**.",
            action_type="cart_update",
            action_payload={"cart": updated_cart.model_dump(), "operation": "remove_coupon"},
            suggested_commands=["Apply SAVE20", "View Cart"]
        )

    # B. Apply Coupon (Create/Update Coupon on Cart)
    if any(k in m_lower for k in ["apply coupon", "use coupon", "apply code", "/apply-coupon", "enter coupon"]) or (
        m_lower.startswith("apply ")
    ):
        # Specific known code or token following 'coupon', 'code', or 'apply'
        code_match = re.search(r"\b(SAVE10|SAVE20|VIP20|WELCOME5|FLASH50|EXPIRED30|MINSPEND100)\b", msg, re.IGNORECASE)
        if not code_match:
            # Fallback: find word after 'coupon' or 'code' or 'apply'
            fallback_match = re.search(r"(?:coupon|code|apply)\s+([A-Za-z0-9_-]{4,15})", msg, re.IGNORECASE)
            if fallback_match and fallback_match.group(1).lower() not in ["coupon", "code", "the", "a"]:
                code = fallback_match.group(1).upper()
            else:
                return ChatResponse(
                    reply="⚠️ Please specify a valid coupon code (e.g. `apply coupon SAVE20`).",
                    suggested_commands=["Active Coupons", "View Cart"]
                )
        else:
            code = code_match.group(1).upper()

        try:
            updated_cart = cart_service.apply_coupon(cart_id, code)
            return ChatResponse(
                reply=(
                    f"🎉 **Coupon `{code}` Applied Successfully!**\n\n"
                    f"• Discount: **-${updated_cart.discount_amount:.2f}**\n"
                    f"• New Subtotal: ${updated_cart.subtotal:.2f}\n"
                    f"• New Cart Total: **${updated_cart.total_amount:.2f}**"
                ),
                action_type="cart_update",
                action_payload={"cart": updated_cart.model_dump(), "operation": "apply_coupon", "coupon": code},
                suggested_commands=["View Cart", "Checkout now"]
            )
        except CouponException as e:
            return ChatResponse(
                reply=f"❌ **Coupon Rejected**: {e.detail}",
                suggested_commands=["Active Coupons", "View Cart"]
            )
        except Exception as e:
            return ChatResponse(
                reply=f"⚠️ Could not apply coupon: {str(e)}",
                suggested_commands=["Active Coupons", "View Cart"]
            )

    # VIP Member Status & Benefits Intent
    if any(w in m_lower for w in ["vip", "membership", "subscriber", "subscription", "vip perks", "vip benefit"]):
        return ChatResponse(
            reply=(
                "👑 **AeroStore VIP Golden Membership — Active Benefits:**\n\n"
                "• 🎟️ **Exclusive VIP Coupon:** Use code **`VIP20`** at checkout for **20% off** orders $100+!\n"
                "• ⚡ **Zero-Fee AeroMinutes:** Instant 10-minute cafe & grocery delivery with **₹0 shipping fee**!\n"
                "• 💎 **5% Automatic Cashback:** Loyalty rebate automatically credited on all completed deliveries.\n"
                "• 🚀 **Early Access & Flash Sales:** Access to high-demand drops (AeroGrip Mice, Cyberpunk Hoodie).\n"
                "• 🤖 **VIP AI Concierge:** Real-time conversational order tracking, budget filtering, and cart checkout.\n\n"
                "💡 *Say `apply coupon VIP20` to instantly use your 20% member discount on your cart!*"
            ),
            action_type="text",
            suggested_commands=["Apply VIP20", "AeroMinutes Cafe", "My Orders", "View Cart"]
        )

    # C. List Coupons (Read Available Coupons)
    if any(w in m_lower for w in ["coupon", "discount", "promo", "voucher", "code"]):
        return ChatResponse(
            reply=(
                "🎟️ **Active Store Promotional Coupons:**\n\n"
                "• **`VIP20`**: Exclusive 20% discount for VIP subscribers on orders of $100+!\n"
                "• **`SAVE20`**: 20% discount on orders of $50 or more!\n"
                "• **`FLASH50`**: 50% discount on orders over $200!\n"
                "• **`SAVE10`**: 10% discount on orders over $50!\n"
                "• **`WELCOME5`**: 5% discount on all orders!\n\n"
                "*(Test Rejection Codes: `EXPIRED30` tests expired coupon error, `MINSPEND100` tests min spend).* \n\n"
                "💡 *Say `apply coupon VIP20` or `apply coupon SAVE20` to activate!*"
            ),
            action_type="text",
            suggested_commands=["Apply VIP20", "Apply SAVE20", "View Cart", "Show Products"]
        )

    # ----------------------------------------------------
    # 5. CHECKOUT & ORDER OPERATIONS
    # ----------------------------------------------------
    # A. Checkout Cart
    if any(k in m_lower for k in ["checkout", "place order", "buy now", "/checkout", "purchase cart", "complete order"]):
        return execute_crud_tool("checkout_cart", {}, cart_id)

    # B. Order History (My Orders)
    if any(k in m_lower for k in ["my orders", "past orders", "order history", "show orders", "view orders", "/orders"]):
        return execute_crud_tool("get_user_orders", {}, cart_id)

    # C. Track Specific Order
    track_match = re.search(r"(?:track|status|order)\s+(ord-[a-zA-Z0-9]+)", msg, re.IGNORECASE)
    if track_match or any(k in m_lower for k in ["track order", "order status", "/track"]):
        order_to_track = track_match.group(1).upper() if track_match else ""
        if not order_to_track:
            # Check for any standalone ORD-XXXX token
            token_match = re.search(r"\b(ord-[a-zA-Z0-9]+)\b", msg, re.IGNORECASE)
            if token_match:
                order_to_track = token_match.group(1).upper()
        if order_to_track:
            return execute_crud_tool("track_order", {"order_id": order_to_track}, cart_id)
        else:
            return ChatResponse(
                reply="⚠️ Please specify the order reference ID to track (e.g. `track order ORD-1001` or `track ORD-21A3B8`).",
                suggested_commands=["My Orders", "View Cart"]
            )

    # D. Unable to Receive Package / Delivery Rescheduling Intent
    if any(k in m_lower for k in [
        "not able to pickup", "cannot pickup", "can't pickup", "not at home", "not home", 
        "reschedule", "reschedule delivery", "change delivery", "leave with guard", "alternate contact", "missed delivery"
    ]):
        return ChatResponse(
            reply=(
                "📦 **Delivery Assistance & Alternative Pickup Options:**\n\n"
                "If you or your recipient cannot receive an active delivery in person, you can choose from these options:\n\n"
                "1. 📅 **Reschedule Delivery Window:** Move delivery to tonight (6 PM - 9 PM) or tomorrow morning with 0 extra charges.\n"
                "2. 🛡️ **Leave with Security Guard / Doorstep:** Driver will leave the package at your building gate/doorstep and upload a timestamped Proof-of-Delivery photo.\n"
                "3. 📲 **Delegate Delivery OTP:** Forward your verification code or designate a neighbor's phone number to accept the package.\n"
                "4. 🔐 **24/7 Smart AeroLocker:** Route package to a secure neighborhood locker to pick up anytime within 48 hours.\n\n"
                "💡 *You can select any of these directly on your active order card in the **Dashboard / My Orders** section!*"
            ),
            action_type="text",
            suggested_commands=["My Orders", "Track Order", "View Cart"]
        )

    # Customer Preferences & Most Loved Intent
    if any(k in m_lower for k in ["preference", "most loved", "top loved", "popular items", "what people love", "customer favorites", "best selling", "bestsellers", "charts"]):
        return ChatResponse(
            reply=(
                "❤️ **AeroStore Customer Preference & Most-Loved Index:**\n\n"
                "Here is what our verified customers are loving the most:\n\n"
                "1. 🏆 **#1 Loved Product:** `PROD-101` AeroSound Pro Headphones (98% Love Score, 4.9★)\n"
                "2. ⚡ **Fastest Re-Ordered:** `PROD-117` Nitro Cold Brew Iced Latte (~9-min Delivery)\n"
                "3. 🖱️ **Esports Choice:** `PROD-102` AeroGrip 58g Featherlight Gaming Mouse\n"
                "4. 🥐 **Cafe Favorite:** `PROD-118` Artisanal French Butter Croissant (Oven-Warmed)\n"
                "5. 🔥 **Streetwear Hit:** `PROD-105` Cyberpunk Tech Commuter Hoodie\n\n"
                "📊 **Top Loved Categories:** Studio Audio (34%), AeroMinutes Cafe (26%), Mechanical Keyboards (18%).\n"
                "⭐ **Overall Satisfaction:** 96.4% customer happiness rating.\n\n"
                "💡 *View interactive preference charts in the **Dashboard** or say `add headphones`!*"
            ),
            action_type="text",
            suggested_commands=["Add PROD-101 to cart", "Add Nitro Cold Brew", "View Cart"]
        )

    # D. Delivery in Minutes / Cafe & Beverages Quick Filters
    if any(k in m_lower for k in ["minute", "minutes", "instant delivery", "quick delivery", "fast delivery", "flipkart minutes", "aerominutes"]):
        minute_prods = [p for p in product_service.get_all() if "minute" in p.description.lower() or p.category.lower() == "cafe & beverages"]
        prod_lines = [f"• **{p.name}** (`{p.id}`) - **${p.price:.2f}** (⚡ Delivered in ~10 mins)" for p in minute_prods]
        return ChatResponse(
            reply=(
                f"⚡ **AeroMinutes Instant Delivery (Under 10 Minutes):**\n\n"
                f"Enjoy hyper-local rapid delivery straight from our local express hubs:\n\n"
                + "\n".join(prod_lines)
                + "\n\n💡 *Say `add nitro cold brew` or `add croissant` to get them delivered in minutes!*"
            ),
            action_type="product_search",
            action_payload={"products": [p.model_dump() for p in minute_prods]},
            suggested_commands=["Add Nitro Cold Brew", "Add Croissant", "View Cart", "Checkout"]
        )

    if any(k in m_lower for k in ["cafe", "beverage", "beverages", "snack", "snacks", "coffee", "croissant", "matcha", "brownie"]):
        cafe_prods = product_service.get_all(category="Cafe & Beverages")
        if not cafe_prods:
            cafe_prods = [p for p in product_service.get_all() if p.category.lower() == "cafe & beverages"]
        cafe_lines = [f"• **{p.name}** (`{p.id}`) - **${p.price:.2f}** (⭐ {p.rating})" for p in cafe_prods]
        return ChatResponse(
            reply=(
                f"☕ **AeroStore Cafe & Instant Refreshments:**\n\n"
                f"Freshly prepared artisan beverages, bakery items, and snacks ready for express delivery:\n\n"
                + "\n".join(cafe_lines)
                + "\n\n💡 *Tip: All Cafe items are prepared on-demand and delivered in ~10 minutes!*"
            ),
            action_type="product_search",
            action_payload={"products": [p.model_dump() for p in cafe_prods]},
            suggested_commands=["Add Nitro Cold Brew", "Add Matcha Latte", "Add Croissant", "View Cart"]
        )

    # E. Budget / Price Filtering (e.g. "items under $100", "under $50", "below 80")
    budget_match = re.search(r"(?:under|below|less than|max(?:imum)?)\s*\$?(\d+(?:\.\d{1,2})?)", msg, re.IGNORECASE)
    if budget_match:
        budget_val = float(budget_match.group(1))
        # Optional category detection
        detected_cat = None
        for cat_cand in ["Electronics", "Accessories", "Wearables", "Apparel", "Fitness", "Home & Living", "Grocery", "Cafe & Beverages"]:
            if cat_cand.lower() in m_lower:
                detected_cat = cat_cand
                break
        return execute_crud_tool("filter_products_by_budget", {"max_price": budget_val, "category": detected_cat}, cart_id)

    # F. User Profile / Account Status
    if any(k in m_lower for k in ["my profile", "user profile", "account info", "who am i", "my account", "/profile"]):
        return execute_crud_tool("get_user_profile", {}, cart_id)

    # ----------------------------------------------------
    # 6. CAPGEMINI GENERATIVE ENGINE LIVE AI CHATBOT & TOOL CALLING
    # Automatically augments with RAG knowledge chunks for any user question
    # ----------------------------------------------------
    # Retrieve real catalog context to empower GenAI answers
    try:
        all_prods = product_service.get_all()
        prod_catalog_summary = "\n".join([
            f"- {p.id}: {p.name} (${p.price:.2f}, Stock: {p.stock}, Category: {p.category}, Rating: {p.rating}★) - {p.description}"
            for p in all_prods[:25]
        ])
    except Exception:
        prod_catalog_summary = "Product catalog currently loaded in memory."

    # Automatically fetch relevant RAG knowledge chunks for the question
    rag_context_str = ""
    try:
        from ...rag.rag_engine import rag_engine
        rag_matches = rag_engine.retrieve(msg, top_k=2, min_score=0.10)
        if rag_matches:
            rag_blocks = [f"[{chunk.title} - {chunk.category}]:\n{chunk.content}" for chunk, _ in rag_matches]
            rag_context_str = "\n\nAUTHORITATIVE KNOWLEDGE BASE CONTEXT:\n" + "\n---\n".join(rag_blocks)
    except Exception:
        pass

    genai_system_prompt = (
        "You are AeroBot, the official enterprise AI assistant and shopping concierge for AeroStore.\n\n"
        "=== STRICT DOMAIN GUARDRAILS & POLICY ENFORCEMENT ===\n"
        "1. STRICT BOUNDARY: You MUST ONLY answer questions directly related to AeroStore:\n"
        "   - Store catalog products, hardware specifications, and inventory availability.\n"
        "   - Official store policies (30-day RMA returns, 2-year hardware warranty, shipping & delivery SLAs).\n"
        "   - Store operations (shopping cart, checkout, orders, tracking, coupons, account profile, VIP membership).\n"
        "   - System architecture (ADR architectural records, N-Tier architecture, Optimistic Concurrency Control).\n"
        "2. OUT-OF-SCOPE REFUSAL GUARDRAIL:\n"
        "   - If the user asks about ANY topic outside of AeroStore (such as general knowledge, world politics, history, "
        "geography, homework/coding help unrelated to the store, celebrity gossip, recipes, external companies, or unrelated advice), "
        "you MUST politely REFUSE to answer.\n"
        "   - Standard Polite Refusal: 'I am the dedicated AI concierge for AeroStore. I can only assist with questions regarding our store products, orders, shipping, warranty and return policies, and platform features. How can I help you with our store today?'\n"
        "3. PROHIBITION OF EXTERNAL FABRICATION:\n"
        "   - Do NOT invent or answer with information that is not grounded in the AeroStore catalog or retrieved knowledge base below.\n"
        "   - Never recommend non-existent products or external third-party stores.\n"
        "4. LIVE STORE ACTIONS:\n"
        "   - If the customer wants to add an item to their cart, view cart, check out, track an order, or apply a coupon, call the appropriate tool.\n\n"
        f"=== CURRENT AEROSTORE CATALOG ===\n{prod_catalog_summary}\n\n"
        "=== ACTIVE STORE PROMOTIONAL COUPONS ===\n"
        "- SAVE20: 20% off orders of $50+\n"
        "- FLASH50: 50% off orders of $200+\n"
        "- SAVE10: 10% off orders of $50+\n"
        "- WELCOME5: 5% off all orders\n"
        f"{rag_context_str}\n\n"
        "Keep responses helpful, professional, and strictly constrained within AeroStore boundaries (2-4 sentences)."
    )

    # 1. Attempt Tool-Calling via Capgemini GenAI
    try:
        tool_messages = [
            {"role": "system", "content": genai_system_prompt},
            {"role": "user", "content": msg}
        ]
        tool_choice_resp = ai_service.call_llm_with_tools(
            messages=tool_messages,
            tools=CRUD_TOOLS,
            tool_choice="auto",
            temperature=0.2
        )
        if tool_choice_resp:
            # Check if LLM requested tool execution
            tool_calls = tool_choice_resp.get("tool_calls")
            if tool_calls and len(tool_calls) > 0:
                first_tool = tool_calls[0]
                fn_name = first_tool.get("function", {}).get("name")
                raw_args = first_tool.get("function", {}).get("arguments", "{}")
                if isinstance(raw_args, str):
                    try:
                        parsed_args = json.loads(raw_args)
                    except Exception:
                        parsed_args = {}
                else:
                    parsed_args = raw_args or {}
                return execute_crud_tool(fn_name, parsed_args, cart_id)
            elif tool_choice_resp.get("content"):
                return ChatResponse(
                    reply=tool_choice_resp["content"].strip(),
                    suggested_commands=["View Cart", "Show Products", "Apply SAVE20"]
                )
    except Exception:
        pass

    # 2. Standard LLM Prompt Fallback
    try:
        genai_reply = ai_service.call_llm(
            prompt=msg,
            system_message=genai_system_prompt,
            temperature=0.3,
            max_tokens=600
        )
        if genai_reply and len(genai_reply.strip()) > 5:
            return ChatResponse(
                reply=genai_reply.strip(),
                suggested_commands=["View Cart", "Show Products", "Apply SAVE20"]
            )
    except Exception:
        pass

    return ChatResponse(
        reply=(
            f"I'm here to help with all your shopping needs! You can ask me anything about our products, "
            f"check your order status, ask about warranties and return policies, or ask me to add items to your cart."
        ),
        suggested_commands=["Show Products", "View Cart", "Checkout", "Active Coupons"]
    )
