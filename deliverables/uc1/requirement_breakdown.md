# Use Case 1: Requirement Breakdown & Prompt Engineering Analysis

## 1. Intent vs Instruction Analysis (Prompting for Developers)

### Bad Prompt (Intent Only)
> *"Design an online shopping system."*

* **Deficiencies:**
  1. Undefined architectural boundaries (monolith vs microservices).
  2. No scale or traffic constraints (fails to specify 10k concurrent users).
  3. Format ambiguity: Generates conversational, non-deterministic paragraphs instead of machine-readable specifications.
  4. Missing security, consistency, and database models.

---

### Good Prompt (Context + Constraints + Structure)
> *"You are a senior solution architect. Design a microservices-based online shopping system.*
> *Constraints:*
> *• Must support 10k concurrent users*
> *• REST APIs only*
> *• Use contract-first design*
> *• Output in structured JSON with: services, responsibilities, API boundaries, risks."*

* **Advantages:**
  1. **Role Definition:** Sets authority and domain depth.
  2. **Bounded Constraints:** Enforces 10k concurrent users and REST-only protocols.
  3. **Strict Schema Enclosure:** Guarantees parseable JSON with predictable keys for automated CI/CD intake.

---

## 2. Requirement Traceability Matrix

| Requirement ID | Business Requirement | Technical Architecture Solution | Python Code Implementation | Automated Test Verification |
|---|---|---|---|---|
| **REQ-01** | High-concurrency product catalog browsing with sub-100ms latency | Product Catalog Service with Redis caching layer and read replicas | `ecommerce_platform.backend.services.product_service` | `test_api_endpoints.py::test_get_products` |
| **REQ-02** | Prevent lost updates and race conditions during simultaneous cart updates | Shopping Cart Service with Optimistic Concurrency Control (`concurrency_version`) | `ecommerce_platform.backend.services.cart_service` | `test_cart_service.py::test_concurrent_modification_occ` |
| **REQ-03** | Enforce 1500ms payment SLA with automatic ledger compensation | Payment Gateway Service with cancellation tokens and saga rollback | `ecommerce_platform.backend.services.payment_service` | `test_payment_service.py::test_payment_sla_timeout_breach` |
| **REQ-04** | Prevent coupon fraud (expired codes, minimum spend bypass) | Coupon Service with date invariant and spend threshold guards | `ecommerce_platform.backend.services.coupon_service` | `test_cart_service.py::test_apply_expired_coupon` |
| **REQ-05** | Standardized error reporting across all REST microservices | RFC 7807 Problem Details global exception handler | `ecommerce_platform.backend.core.error_model` | `test_api_endpoints.py::test_get_invalid_product_404` |
