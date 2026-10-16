"""
Domain Models for the E-Commerce Platform and 5 AI Use Cases.
"""
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field

def utc_now():
    return datetime.now(timezone.utc)

# ==========================================
# E-COMMERCE CORE DOMAIN MODELS
# ==========================================

class Product(BaseModel):
    id: str = Field(..., description="Unique product identifier (e.g. PROD-101)")
    name: str = Field(..., description="Product title")
    description: str = Field(..., description="Detailed description")
    price: float = Field(..., ge=0.0, description="Unit price in USD")
    stock: int = Field(..., ge=0, description="Available inventory count")
    category: str = Field(..., description="Product category")
    rating: float = Field(default=4.8, ge=0.0, le=5.0)
    image_url: str = Field(default="", description="Image path or placeholder URL")
    is_vip: bool = Field(default=False, description="Flag indicating if product is exclusive to VIP subscribers")

class CartItem(BaseModel):
    product_id: str
    name: str
    unit_price: float
    quantity: int = Field(..., ge=1, le=99)
    subtotal: float = 0.0
    image_url: str = Field(default="", description="Product image URL")

class Cart(BaseModel):
    id: str = "default_cart"
    session_id: str = "guest_session"
    items: List[CartItem] = Field(default_factory=list)
    subtotal: float = 0.0
    discount_amount: float = 0.0
    applied_coupon: Optional[str] = None
    tax_amount: float = 0.0
    total_amount: float = 0.0
    concurrency_version: int = 1
    updated_at: datetime = Field(default_factory=utc_now)

class Coupon(BaseModel):
    code: str
    discount_percent: float = Field(..., ge=0.0, le=100.0)
    min_spend: float = 0.0
    is_expired: bool = False
    description: str = ""

class PaymentRequest(BaseModel):
    transaction_id: str = Field(..., description="Idempotency key / transaction GUID")
    cart_id: str
    amount: float = Field(..., gt=0.0)
    payment_method: str = "CREDIT_CARD"
    card_last_four: str = "4242"
    simulate_delay_ms: Optional[int] = 0

class PaymentResult(BaseModel):
    transaction_id: str
    status: str  # SUCCESS, TIMEOUT, FAILED, IDEMPOTENT_DUPLICATE
    amount: float
    message: str
    timestamp: datetime = Field(default_factory=utc_now)
    saga_rollback_executed: bool = False

class Order(BaseModel):
    order_id: str
    transaction_id: str
    cart_id: str
    items: List[CartItem]
    total_amount: float
    shipping_address: Dict[str, str]
    status: str = "CONFIRMED"  # PENDING, CONFIRMED, CANCELLED, REFUNDED
    created_at: datetime = Field(default_factory=utc_now)

# ==========================================
# CHATBOT & AI MODELS
# ==========================================

class ChatMessage(BaseModel):
    role: str  # user, assistant, system
    content: str
    timestamp: datetime = Field(default_factory=utc_now)
    metadata: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = Field(default_factory=list)
    session_id: Optional[str] = "guest_session"

class SourceCitation(BaseModel):
    title: str
    category: str
    relevance_score: float
    snippet: str

class ChatResponse(BaseModel):
    reply: str
    action_type: Optional[str] = "text"  # text, product_search, cart_update, use_case_execution, rag_answer
    action_payload: Optional[Dict[str, Any]] = None
    suggested_commands: List[str] = Field(default_factory=list)
    sources: Optional[List[SourceCitation]] = None
    rag_augmented: bool = False

# ==========================================
# 5 USE CASES STRUCTURED SCHEMAS
# ==========================================

# Use Case 1: Architecture & ADR
class ServiceBoundary(BaseModel):
    name: str
    responsibility: str
    api_boundary: str
    database: str
    risks: List[str]

class ArchitectureSchema(BaseModel):
    system_name: str
    architecture_style: str  # Microservices vs Monolith
    concurrent_users: int
    services: List[ServiceBoundary]
    token_usage_estimated: Dict[str, int]
    trade_off_analysis: Dict[str, str]

# Use Case 2: Scaffolding & Validation
class ApiEndpointDef(BaseModel):
    path: str
    method: str
    description: str
    parameters: List[str]
    response_codes: List[int]
    error_model: str

# Use Case 4: Code Review Schema (Strict per PDF)
class CodeReviewResult(BaseModel):
    security_issues: List[str]
    complexity_score: str
    refactor_suggestions: List[str]
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL

# Use Case 5: AI Test Case Schema (Strict per PDF)
class TestCaseItem(BaseModel):
    test_name: str
    scenario: str
    expected_result: str
    code_snippet: str

class TestSuiteSchema(BaseModel):
    module_name: str
    framework: str
    test_cases: List[TestCaseItem]
    coverage_score: str

class SimulationStep(BaseModel):
    step_number: int
    action: str
    state_before: Dict[str, Any]
    state_after: Dict[str, Any]
    telemetry: str
    passed: bool

class SimulationResult(BaseModel):
    simulation_type: str
    title: str
    scenario_description: str
    steps: List[SimulationStep]
    final_status: str
    execution_time_ms: float
    mitigation_strategy: str

# RAG Models
class RagQueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3
    min_score: Optional[float] = 0.15
    filter_category: Optional[str] = None

class RagQueryResponse(BaseModel):
    query: str
    answer: str
    sources: List[SourceCitation]
    retrieved_count: int
    rag_augmented: bool = True

# User & Authentication Models
class UserRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = Field(default="customer", description="User role: 'customer', 'admin', or 'delivery_partner'")


class UserLoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str = "customer"
    is_vip: bool = False
    created_at: datetime = Field(default_factory=utc_now)

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# AI Smart Product Comparison Models
class CompareRequest(BaseModel):
    product_ids: List[str] = Field(..., min_length=1, max_length=4, description="List of product IDs to compare (1 to 4)")
    persona: Optional[str] = Field(default="general", description="Shopper persona for tailored AI buying verdict")

class ComparisonItem(BaseModel):
    id: str
    name: str
    price: float
    category: str
    rating: float
    stock: int
    image_url: str
    specs: Dict[str, Any]
    highlights: List[str]

class ComparisonVerdict(BaseModel):
    winner_id: str
    winner_name: str
    summary: str
    pros_and_cons: Dict[str, Dict[str, List[str]]]
    persona_fit: str
    value_score: Dict[str, float]
    recommendation: str

class CompareResponse(BaseModel):
    persona: str
    products: List[ComparisonItem]
    spec_keys: List[str]
    verdict: ComparisonVerdict
