# Tier 3: Business Logic Tier (BLL / Application Services)

## Overview
The Business Logic Tier encapsulates all business rules, calculations, validation constraints, and transaction orchestration. It is strictly separated from presentation controllers (Tier 2) and persistence queries (Tier 4).

## Domain Services
1. **Order Service** (`OrderService`):
   - Implements the 3-phase checkout saga: (1) Inventory Reservation $\to$ (2) Payment Settlement $\to$ (3) Persistence.
   - Executes compensating rollback transactions if payment fails or times out.
2. **Product Service** (`ProductService`):
   - Validates inventory stock levels and prevents overselling.
   - Orchestrates multi-brand comparison matrices with AI persona weighting.
3. **Cart Service** (`CartService`):
   - Ephemeral cart lifecycle governance.
   - Optimistic Concurrency Control (OCC) version tracking.
4. **Auth Service** (`AuthService`):
   - PBKDF2-HMAC-SHA256 password hashing (100,000 iterations).
   - Secure bearer session token issuance and revocation.
5. **Payment Service** (`PaymentService`):
   - Payment gateway integration with 1500ms SLA timeout enforcement and idempotency deduplication.
6. **Coupon Service** (`CouponService`):
   - Validates promo codes, active dates, and minimum order spend thresholds.
7. **AI Service** (`AiService`):
   - Persona-tailored hardware recommendations (Balanced Value, Audiophile, Commuter, Student/Budget, Gamer).
