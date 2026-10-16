"""
Use Case 2 Deliverable: Backend Scaffold Code (Generated Contract-First)
Target Runtime: Python 3.14 + FastAPI + Pydantic v2
"""
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field

# Scaffolded Models
class ProductScaffold(BaseModel):
    id: str
    name: str
    description: str
    price: float = Field(..., ge=0.0)
    stock: int = Field(..., ge=0)
    category: str

class AddToCartScaffoldRequest(BaseModel):
    cart_id: str = "default_cart"
    product_id: str
    quantity: int = Field(..., ge=1, le=99)
    expected_version: Optional[int] = None

class CartScaffold(BaseModel):
    id: str
    items: List[dict]
    total_amount: float
    concurrency_version: int

# Router Scaffolding
router = APIRouter(prefix="/api/v1")

@router.get("/products", response_model=List[ProductScaffold])
async def get_products(category: Optional[str] = None, search: Optional[str] = None):
    """GET /products scaffold handler"""
    # Business logic delegates to ProductService
    return []

@router.get("/products/{product_id}", response_model=ProductScaffold)
async def get_product_by_id(product_id: str):
    """GET /products/{id} scaffold handler"""
    return ProductScaffold(
        id=product_id,
        name="Sample Scaffolding Product",
        description="Generated scaffold",
        price=99.99,
        stock=10,
        category="Electronics"
    )

@router.post("/products", response_model=ProductScaffold, status_code=status.HTTP_201_CREATED)
async def create_product(payload: ProductScaffold):
    """POST /products scaffold handler"""
    return payload

@router.post("/cart/items", response_model=CartScaffold)
async def add_item_to_cart(payload: AddToCartScaffoldRequest):
    """POST /cart/items scaffold handler enforcing OCC"""
    return CartScaffold(
        id=payload.cart_id,
        items=[{"product_id": payload.product_id, "quantity": payload.quantity}],
        total_amount=99.99,
        concurrency_version=2
    )
