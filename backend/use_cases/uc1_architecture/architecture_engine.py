"""
USE CASE 1: AI-Assisted Requirements & Architecture Design Engine
Produces:
- Intent vs Instruction (Bad Prompt vs Good Prompt) analysis
- Architecture decomposition (Monolith vs Microservices)
- Structured JSON output with service boundaries, responsibilities, database models, and risks
- Requirement Traceability
"""
from typing import Dict, Any, List
import json
from ...core.models import ArchitectureSchema, ServiceBoundary

class ArchitectureEngine:
    def __init__(self):
        pass

    def compare_prompts(self) -> Dict[str, Any]:
        """Analyzes Bad Prompt (Intent only) vs Good Prompt (Context + Constraints + Structure)"""
        return {
            "bad_prompt": {
                "prompt": "Design an online shopping system.",
                "analysis": {
                    "intent_clarity": "Low - Leaves scope, scale, patterns, and output format undefined.",
                    "failure_modes": [
                        "Hallucinated tech stack without regard to organizational standards",
                        "Unbounded natural language output instead of actionable engineering artifacts",
                        "Missing concurrency limits, SLA constraints, and security boundaries"
                    ],
                    "token_efficiency": "Poor - Generates excessive boilerplate without actionable structure"
                }
            },
            "good_prompt": {
                "prompt": (
                    "You are a senior solution architect. Design a microservices-based online shopping system.\n"
                    "Constraints:\n"
                    "• Must support 10k concurrent users\n"
                    "• REST APIs only\n"
                    "• Use contract-first design\n"
                    "• Output in structured JSON with: services, responsibilities, API boundaries, risks."
                ),
                "analysis": {
                    "context_provided": "Senior Solution Architect role definition establishes domain depth.",
                    "constraints_enforced": "10k concurrent users, REST only, contract-first design.",
                    "schema_enforced": "Strict structured JSON output with precise keys.",
                    "predictability": "Deterministic, easily parseable into CI/CD and scaffolding tools."
                }
            }
        }

    def generate_architecture_json(self) -> ArchitectureSchema:
        """Produces the structured JSON architecture per Use Case 1 specification"""
        services = [
            ServiceBoundary(
                name="Product Catalog Service",
                responsibility="Manages product metadata, inventory counts, categories, and full-text search indexing.",
                api_boundary="/api/v1/products",
                database="Document DB (MongoDB / PostgreSQL JSONB) with Redis read cache for high-throughput reads.",
                risks=["Cache staleness during flash sales", "Read replica replication lag"]
            ),
            ServiceBoundary(
                name="Shopping Cart Service",
                responsibility="Stateful ephemeral cart management, coupon application, and Optimistic Concurrency Control (OCC).",
                api_boundary="/api/v1/cart",
                database="In-memory distributed key-value store (Redis / DynamoDB) with TTL expiration.",
                risks=["Abandoned cart memory bloat", "Multi-device concurrent modification race conditions"]
            ),
            ServiceBoundary(
                name="Order Management Service",
                responsibility="Checkout orchestration, state machine transitions (Pending -> Confirmed -> Shipped), and order history.",
                api_boundary="/api/v1/orders",
                database="Relational ACID database (PostgreSQL) enforcing transactional integrity.",
                risks=["Distributed transactions across microservices", "Partial saga failure during payment timeouts"]
            ),
            ServiceBoundary(
                name="Payment Processing Service",
                responsibility="Payment gateway integration (Stripe/PayPal), SLA timeout enforcement (1500ms), idempotency deduplication, and saga compensation.",
                api_boundary="/api/v1/payments",
                database="PostgreSQL with strict append-only financial audit ledger.",
                risks=["Upstream gateway latency spikes", "Duplicate payment replay attacks", "Network partitions during capture"]
            ),
            ServiceBoundary(
                name="User & Identity Service",
                responsibility="Authentication, authorization, OAuth2/OIDC token issuance, and customer profile management.",
                api_boundary="/api/v1/users",
                database="PostgreSQL / OpenID Connect Provider.",
                risks=["Token revocation latency", "Credential stuffing attacks"]
            )
        ]

        return ArchitectureSchema(
            system_name="NextGen Retail Online Shopping Platform",
            architecture_style="Microservices Architecture (Contract-First)",
            concurrent_users=10000,
            services=services,
            token_usage_estimated={
                "prompt_tokens": 142,
                "completion_tokens": 680,
                "total_tokens": 822
            },
            trade_off_analysis={
                "why_microservices": "Enables independent scaling of Catalog (read-heavy, 10k users) vs Payment/Order (write-heavy ACID). Prevents cart crashes from taking down payment settlement.",
                "database_strategy": "Database-per-service pattern prevents tight coupling, ensuring resilience against cascading outages."
            }
        )

    def get_traceability_matrix(self) -> List[Dict[str, str]]:
        """Maps business requirements to technical components and code modules"""
        return [
            {
                "req_id": "BR-01",
                "requirement": "Support high-traffic product browsing with sub-100ms latency",
                "tech_component": "Product Catalog Service",
                "implementation_module": "ecommerce_platform.backend.services.product_service",
                "verification": "test_api_endpoints.py::test_get_products"
            },
            {
                "req_id": "BR-02",
                "requirement": "Prevent cart overwrites from simultaneous mobile and web sessions",
                "tech_component": "Cart Service (OCC Versioning)",
                "implementation_module": "ecommerce_platform.backend.services.cart_service",
                "verification": "test_cart_service.py::test_concurrent_modification_conflict"
            },
            {
                "req_id": "BR-03",
                "requirement": "Enforce strict 1500ms payment SLA with automatic ledger compensation",
                "tech_component": "Payment Gateway Service",
                "implementation_module": "ecommerce_platform.backend.services.payment_service",
                "verification": "test_payment_service.py::test_payment_timeout_sla_breach"
            },
            {
                "req_id": "BR-04",
                "requirement": "Validate promo coupon codes against expiration and minimum cart spend",
                "tech_component": "Coupon Service",
                "implementation_module": "ecommerce_platform.backend.services.coupon_service",
                "verification": "test_cart_service.py::test_coupon_validation"
            }
        ]

architecture_engine = ArchitectureEngine()
