"""
Product Catalog REST Controller (Contract-First)
"""
from typing import List, Optional
from fastapi import APIRouter, Query, status
from ...core.models import Product, CompareRequest, CompareResponse
from ..tier3_bll.product_service import product_service

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[Product], summary="List products")
def list_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search term in name or description")
):
    return product_service.get_all(category=category, search=search)

@router.post("/compare", response_model=CompareResponse, summary="Compare products with AI verdict")
def compare_products(request: CompareRequest):
    return product_service.compare_products(request.product_ids, persona=request.persona or "general")

@router.get("/{product_id}", response_model=Product, summary="Get product by ID")
def get_product(product_id: str):
    return product_service.get_by_id(product_id)

@router.post("", response_model=Product, status_code=status.HTTP_201_CREATED, summary="Add new product")
def create_product(product: Product):
    return product_service.add_product(product)

@router.patch("/{product_id}/stock", response_model=Product, summary="Update product stock count")
def update_stock(product_id: str, stock: int = Query(..., ge=0, description="New available stock count")):
    return product_service.set_stock(product_id, stock)

