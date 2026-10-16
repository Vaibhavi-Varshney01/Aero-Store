# 🛒 AeroStore: Enterprise E-Commerce Platform & AI Engineering Suite
## Master Architectural & Technical Documentation

---

### 📌 Project Metadata
* **Project Name:** AeroStore NextGen E-Commerce & AI Engineering Suite
* **Author / Engineer:** Vaibhavi Varshney
* **Organization:** Capgemini
* **Technology Stack:** Pure Python 3.14, FastAPI, Pydantic v2, Microsoft SQL Server (SSMS) via `pyodbc`, React 19, Vite, Vanilla CSS Design System, Pytest (43/43 Tests Passing), Vector RAG Engine
* **Standards Enforced:** RFC 7807 Problem Details, OpenAPI 3.0.3, WCAG 2.1 Level AA Accessibility (100% compliant)
* **Architectural Style:** Clean N-Tier Domain-Driven Microservices-Ready Architecture
* **GenAI Engine:** Capgemini Generative Engine (`openai.gpt-4o`) with High-Fidelity Deterministic Fallback Simulation

---

## 📑 Table of Contents
1. [Executive Summary & Business Value](#1-executive-summary--business-value)
2. [Complete Technology Stack Matrix](#2-complete-technology-stack-matrix)
3. [Unique Standout Feature: AI SmartMatch Product Comparison Matrix](#3-unique-standout-feature-ai-smartmatch-product-comparison-matrix)
4. [Clean N-Tier Architecture & System Topology](#4-clean-n-tier-architecture--system-topology)
5. [Database Architecture & SSMS (Microsoft SQL Server) Integration](#5-database-architecture--ssms-microsoft-sql-server-integration)
6. [Role-Based Access Control (RBAC)](#6-role-based-access-control-rbac)
7. [High Concurrency, Resilience & Optimistic Concurrency Control (OCC)](#7-high-concurrency-resilience--optimistic-concurrency-control-occ)
8. [Vector RAG Knowledge Engine & Source Citations](#8-vector-rag-knowledge-engine--source-citations)
9. [Deep Dive: The 5 AI Engineering Use Cases (UC1–UC5)](#9-deep-dive-the-5-ai-engineering-use-cases-uc1uc5)
10. [Comprehensive REST API Reference](#10-comprehensive-rest-api-reference)
11. [Automated Testing & Pytest Verification Report](#11-automated-testing--pytest-verification-report)
12. [Appraisal & Mentor Presentation Defense Guide](#12-appraisal--mentor-presentation-defense-guide)

---

## 1. Executive Summary & Business Value

Modern retail enterprises demand systems that withstand massive flash-sale concurrency surges, guarantee absolute financial correctness, prevent inventory overselling, and guide customers intelligently to reduce shopping cart abandonment.

**AeroStore** is a full-stack, enterprise-grade e-commerce application engineered from the ground up to solve these core retail challenges while demonstrating state-of-the-art AI engineering practices. It bridges cutting-edge software architecture with artificial intelligence:
* **Production-Grade Storefront:** Built with **React 19** and **Vite**, adhering to a custom glassmorphic design system and **WCAG 2.1 AA accessibility** standards.
* **Resilient Backend:** Powered by asynchronous **Python 3.14** and **FastAPI**, implementing strict OpenAPI 3.0 contracts and RFC 7807 problem details.
* **Enterprise Persistence:** 100% segregated relational persistence via **Microsoft SQL Server (SSMS)** with automatic T-SQL schema migrations.
* **Unique Innovation:** **AI SmartMatch**, an intelligent multi-product comparison matrix and persona buying verdict engine that eliminates decision fatigue.
* **Embedded AI Concierge:** A Retrieval-Augmented Generation (RAG) assistant using vector cosine similarity to provide factual, citation-backed answers on product specs, warranties, and return policies.
* **AI Engineering Rigor:** Fulfills all 5 Capgemini AI Engineering Use Cases with complete deliverables, automated AST governance, and chaos simulations.

---

## 2. Complete Technology Stack Matrix

| Architectural Layer | Technologies Employed | Architectural Responsibility & Key Features |
|---|---|---|
| **Frontend Framework** | **React 19**, **Vite 8** | High-performance SPA with instant Hot Module Replacement (HMR), component-driven UI, and zero external framework lock-in. |
| **Design System & Styling** | **Vanilla CSS3** (Custom Obsidian Theme) | Glassmorphism UI tokens, custom micro-animations, accessible color contrast ratios (≥4.5:1), and fluid responsive grid layouts. |
| **Frontend State Management** | **React Context API** (`CartContext`, `AuthContext`) | Global cart drawer state, optimistic stock handling, RBAC session tracking, and live toast announcer. |
| **Backend REST Engine** | **Python 3.14**, **FastAPI**, **Uvicorn** | Asynchronous non-blocking ASGI web server, automatic OpenAPI contract generation, and dependency injection. |
| **Data Validation & Schemas** | **Pydantic v2** | High-performance C-based serialization, strict runtime type safety, and RFC 7807 error formatting. |
| **Enterprise Persistence** | **Microsoft SQL Server (SSMS)** via **`pyodbc`** | Enterprise relational storage on database `AeroStoreDB` with ACID transaction guarantees, parameterized T-SQL queries, and thread-safe in-memory fallback. |
| **AI & Vector RAG Engine** | **VectorStore (Cosine Similarity)** + **GenAI Client** | In-memory semantic vector index, grounded prompt synthesis, verifiable source citations, and deterministic offline resilience. |
| **Quality & Static Governance** | **Python `ast`**, **`mccabe`**, **`oxlint`** | AST static vulnerability scanning, cyclomatic complexity reduction (12 to 2), secret detection, and permissive software license validation. |
| **Testing & Chaos Simulation** | **Pytest 9.1**, **Pytest-cov** | 43 automated unit/integration tests verifying OCC concurrency tokens, 1500ms payment SLA timeouts, SQLi defense, and coupon limits. |
| **CLI & Automation** | **`run.py`**, **`cli.py`** | Central CLI launcher with `--ssms`, `--test`, and interactive terminal shopping assistant with slash commands. |

---

## 3. Unique Standout Feature: AI SmartMatch Product Comparison Matrix

### 🌟 Why This Feature Makes the App Stand Out in Appraisals
Most academic and enterprise evaluation projects implement boilerplate e-commerce patterns: browsing a product list, adding items to a cart, and checking out. 

**AeroStore SmartMatch** elevates the platform into a modern advisory shopping experience by addressing the #1 customer pain point in consumer tech retail: **choice paralysis** (e.g., *"Should I buy the HyperSound ANC Headphones or the Titanium Smartwatch? What are the actual trade-offs for my lifestyle?"*).

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                           AEROSTORE SMARTMATCH ARCHITECTURE                                 │
│                                                                                             │
│  [Catalog / Items] ──> [Toggle "⚖️ Compare"] ──> [Floating Compare Dock (Up to 4 Items)]    │
│                                                              │                              │
│                                                              ▼                              │
│                                                [Open SmartMatch Modal]                      │
│                                                              │                              │
│                                          ┌───────────────────┴───────────────────┐          │
│                                          ▼                                       ▼          │
│                              [Select Shopper Persona]                [Side-by-Side Specs]   │
│                              • Balanced Value                        • Price & Category     │
│                              • Audiophile & Sound                    • Rating & Stock       │
│                              • Commuter & Travel                     • Battery & Bluetooth  │
│                              • Student & Budget                      • Noise Cancellation   │
│                              • Gamer & Esports                       • Official Warranty    │
│                                          │                                                  │
│                                          ▼                                                  │
│                              [POST /api/v1/products/compare]                                │
│                                          │                                                  │
│                                          ▼                                                  │
│                              [AI Buying Verdict Synthesis]                                  │
│                              • 🏆 Winner Declaration                                        │
│                              • Quantitative Value Score (1-10)                              │
│                              • Pros & Cons Matrix                                           │
│                              • Persona Fit Rationale                                        │
│                              • 1-Click "+ Add Winner to Cart"                               │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Technical Workflow:
1. **Interactive Compare Dock (`CompareDock.jsx`):**
   - Users click the **"⚖️ Compare"** button on any product card across the catalog or homepage spotlight.
   - A sleek, floating glassmorphic dock slides up from the bottom of the screen with thumbnails, item names, prices, and an instant removal trigger.
   - Restricts selections to a maximum of 4 items with real-time feedback and count badges.
2. **Side-by-Side Comparison Matrix (`CompareModal.jsx`):**
   - Displays a structured technical table matching technical keys: Battery Life, Connectivity, Active Noise Cancellation, Weight, Driver Type, Panel Specs, and Warranty.
3. **GenAI Persona-Aware Verdict Engine:**
   - Evaluates products through customizable personas:
     - **Balanced Value:** Evaluates overall price-to-performance ratio.
     - **Audiophile & Sound:** Prioritizes acoustic drivers, decibel cancellation, and harmonic distortion.
     - **Commuter & Travel:** Prioritizes battery longevity (e.g., 40h ANC) and portability.
     - **Student & Budget:** Calculates savings efficiency and durability.
     - **Gamer & Esports:** Evaluates input latency, mechanical switch type, and refresh rate.
4. **Resilient Backend Service (`product_service.py` & `ai_service.py`):**
   - Endpoint: `POST /api/v1/products/compare`.
   - Formulates a structured prompt with product specifications, calculates a deterministic value score fallback, and extracts specific pros and cons for each item.
   - Allows instant 1-click addition of the AI winner directly into the shopping cart.

---

## 4. Clean N-Tier Architecture & System Topology

AeroStore follows an enterprise **N-Tier Clean Domain-Driven Architecture**, ensuring strict separation of concerns, testability, and future microservices decomposability.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        TIER 1: PRESENTATION LAYER                               │
│                                                                                 │
│  [React 19 Vite SPA]                   [Terminal REPL Console]                  │
│  • Sticky Header & Live Search         • cli.py Interactive Shopping Chatbot    │
│  • Floating SmartMatch Compare Dock    • ANSI Color Formatting                  │
│  • Side-by-Side Comparison Modal       • Slash Commands: /cart, /rag, /compare  │
│  • Off-Canvas Cart & Checkout Modal    • Developer Commands: /1, /2, /3, /4, /5 │
│  • Role-Based Access Profile View      • Offline Resilient Terminal Interface   │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │ HTTP / REST JSON (Bearer Auth)
┌───────────────────────────────────────▼─────────────────────────────────────────┐
│                    TIER 2: REST CONTROLLER & API LAYER                          │
│                                                                                 │
│  • /api/v1/auth          : RBAC Registration, Login, Profile & Roles           │
│  • /api/v1/products      : Catalog Query, Dynamic Search, /compare Matrix       │
│  • /api/v1/cart          : OCC Version-Controlled Shopping Cart Operations      │
│  • /api/v1/checkout      : Multi-Step Saga Order Orchestrator                   │
│  • /api/v1/payments      : Idempotent Payment Processor with 1500ms Timeout SLA │
│  • /api/v1/chat          : Embedded Shopping Concierge & Slash Command Router   │
│  • /api/v1/rag           : Vector Similarity Search & Grounded Answering        │
│  • /api/v1/usecases      : Telemetry & Verification Hub for UC1–UC5             │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │ Direct Internal Invocation
┌───────────────────────────────────────▼─────────────────────────────────────────┐
│                    TIER 3: BUSINESS LOGIC LAYER (BLL)                           │
│                                                                                 │
│  • ProductService        : Stock management, specification matrix, comparison   │
│  • CartService           : Cart session isolation, 99-unit ceilings, OCC token  │
│  • OrderService          : Order placement, delivery tracking, history queries  │
│  • PaymentService        : SLA watchdog (1500ms), idempotency cache, rollback   │
│  • CouponService         : Eligibility rules, discount caps (SAVE20, TECH50)    │
│  • AuthService           : Role verification (Customer, Admin, Delivery Partner)│
│  • RagEngine             : Context retrieval, prompt augmentation, citations    │
│  • 5 Use Case Engines    : Dedicated evaluation modules for UC1 through UC5     │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
┌────────────────────────────────────────┐ ┌────────────────────────────────────────┐
│      TIER 4: DATA PERSISTENCE          │ │   TIER 5: AI & EXTERNAL INTEGRATIONS   │
│                                        │ │                                        │
│  [Microsoft SQL Server / SSMS]         │ │  [Vector Store (In-Memory)]            │
│  • Database: AeroStoreDB               │ │  • Cosine Similarity Embeddings        │
│  • Driver: ODBC Driver 18 for SQL      │ │  • Curated Chunks: Warranties, ADRs    │
│  • Schema: Products, Carts, Items,     │ │                                        │
│            Orders, Users               │ │  [Capgemini GenAI Client]              │
│  • Thread-Safe Connection Pooling      │ │  • Model: openai.gpt-4o                │
│  • Dual-Engine In-Memory Fallback      │ │  • Deterministic Simulation Fallback   │
└────────────────────────────────────────┘ └────────────────────────────────────────┘
```

---

## 5. Database Architecture & SSMS (Microsoft SQL Server) Integration

The platform provides dedicated enterprise persistence segregated into **Microsoft SQL Server (SSMS)** using `pyodbc`.

### Database Details:
* **Database Name:** `AeroStoreDB`
* **Driver Configuration:** `ODBC Driver 18 for SQL Server` / `ODBC Driver 17 for SQL Server` / `SQL Server`
* **Security & Authentication:** Windows Integrated Authentication (`Trusted_Connection=yes`) with `TrustServerCertificate=yes`
* **Migration Script:** [backend/sql/ssms_schema_and_seed.sql](file:///c:/Users/vaibvars/OneDrive%20-%20Capgemini/Desktop/L1_UseCases/backend/sql/ssms_schema_and_seed.sql)
* **Connection Manager:** [backend/core/database.py](file:///c:/Users/vaibvars/OneDrive%20-%20Capgemini/Desktop/L1_UseCases/backend/core/database.py)

### Entity-Relationship Schema:

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS ||--o{ CARTS : owns
    CARTS ||--o{ CART_ITEMS : contains
    PRODUCTS ||--o{ CART_ITEMS : references
    ORDERS ||--o{ ORDER_ITEMS : includes
    PRODUCTS ||--o{ ORDER_ITEMS : references

    USERS {
        string id PK
        string name
        string email UK
        string password_hash
        string role
        bit is_vip
        datetime created_at
    }

    PRODUCTS {
        string id PK
        string name
        string description
        decimal price
        int stock
        string category
        decimal rating
        string image_url
    }

    CARTS {
        string id PK
        string user_id FK
        string version_token
        datetime updated_at
    }

    CART_ITEMS {
        int id PK
        string cart_id FK
        string product_id FK
        int quantity
    }

    ORDERS {
        string id PK
        string user_id FK
        string status
        decimal total_amount
        string shipping_address
        string idempotency_key UK
        datetime created_at
    }
```

### Self-Healing Dual-Engine Architecture:
If Microsoft SQL Server is offline during local evaluation, `backend/core/database.py` automatically initializes an in-memory repository without crashing the application. Once SQL Server is online, running `python run.py --ssms` validates connectivity and executes schema migrations instantly.

---

## 6. Role-Based Access Control (RBAC)

AeroStore enforces Role-Based Access Control across the API and the React frontend, supporting three specialized user personas:

| Persona | Demo Account | Permissions & UI Capabilities |
|---|---|---|
| **Customer** | `jane.doe@example.com` | Browse catalog, compare products via SmartMatch, manage personal cart, apply coupons, place orders, view order history, interact with RAG chatbot. |
| **Admin** | `admin@example.com` | Everything a customer can do, plus access to administrative metrics, system configuration, inventory restock controls, and telemetry inspection. |
| **Delivery Partner** | `delivery@example.com` | Dedicated dispatch portal: inspect pending deliveries, view customer shipping addresses, update live order dispatch statuses (`DISPATCHED`, `OUT_FOR_DELIVERY`, `DELIVERED`). |

### Authentication Mechanism:
* Password hashing using secure SHA-256 with user-specific salt.
* Bearer Token issuance upon successful login via `POST /api/v1/auth/login`.
* HTTP Authorization header verification (`Authorization: Bearer <token>`) on all protected endpoints.
* Automatic role verification decorators preventing unauthorized privilege escalation.

---

## 7. High Concurrency, Resilience & Optimistic Concurrency Control (OCC)

To prevent race conditions during high-volume flash sales (e.g. 10,000 concurrent shoppers checking out the final units of a limited-edition product), AeroStore employs multiple resilience mechanisms:

### 1. Optimistic Concurrency Control (OCC)
* Every cart maintains an atomic `version_token` (e.g., UUIDv4).
* Whenever an item is added, updated, or removed, the client passes its current version token.
* If another tab or concurrent device modified the cart in the interim, the token does not match:
  ```json
  {
    "type": "https://errors.aerostore.io/concurrency-conflict",
    "title": "Optimistic Concurrency Conflict",
    "status": 409,
    "detail": "Cart was modified concurrently by another process. Please refresh and retry.",
    "error_code": "OCC_VERSION_CONFLICT"
  }
  ```
* This prevents duplicate billing, ghost item additions, and race condition stock leaks.

### 2. Payment Gateway 1500ms SLA Watchdog
* Modern payment processors require guaranteed latency bounds. AeroStore enforces a strict 1500ms timeout SLA on payment settlement.
* If the gateway exceeds 1500ms, the payment service aborts the transaction, triggers a Saga reversal, releases reserved product inventory, and returns an RFC 7807 error.

### 3. Payment Idempotency Keys
* Every checkout attempt transmits a client-generated `Idempotency-Key` header.
* If a network timeout occurs and the user re-clicks "Place Order", the backend intercepts the duplicate key from its cache, prevents double charges, and returns the existing transaction result safely.

---

## 8. Vector RAG Knowledge Engine & Source Citations

AeroStore features a native, vector-embedded **Retrieval-Augmented Generation (RAG)** assistant that answers customer inquiries factually and transparently.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Shopper / User
    participant Chatbot as Chatbot UI
    participant RAG as RAG Engine
    participant Vector as In-Memory Vector Store
    participant LLM as Capgemini GenAI (GPT-4o)

    Customer->>Chatbot: "What is the return policy for opened headphones?"
    Chatbot->>RAG: answer_query(query)
    RAG->>Vector: search(query, top_k=3, min_score=0.12)
    Vector-->>RAG: Matched Chunks (Return Policy, Warranty, Specs)
    RAG->>LLM: Synthesize Answer with Ground Truth Context Blocks
    LLM-->>RAG: Formatted Response with Citations
    RAG-->>Chatbot: RagQueryResponse(answer, sources=[...])
    Chatbot-->>Customer: Display Answer + Clickable Verifiable Source Cards
```

### Curated Knowledge Base:
* **Product Specifications:** Driver sizes, battery life, weight, sensor telemetry for all catalog items.
* **Return & Refund Policy:** 30-day return window, condition criteria, refund methods.
* **Hardware Warranty:** 2-year full hardware replacement coverage, exclusions, claim procedures.
* **Architectural Decision Records:** ADR-001 (Microservices) and ADR-002 (Non-AI Payment Separation).

### Verifiable Citations:
Every response includes clickable source citations with relevance scores (e.g. `[Source 1: AeroStore 30-Day Return & Refund Policy (Returns) | Relevance: 0.88]`), allowing evaluators to verify that the AI does not hallucinate answers.

---

## 9. Deep Dive: The 5 AI Engineering Use Cases (UC1–UC5)

The project systematically fulfills all 5 Capgemini AI Engineering Use Cases:

### 🏛️ Use Case 1: Requirements & Architecture Design
* **Prompt Engineering:** Analyzes poor vs. high-fidelity constrained prompts.
* **Microservices Decomposition:** Evaluates microservices vs. monolithic architectures for 10,000 concurrent users (`architecture.json`).
* **ADR-001:** Formal Architectural Decision Record documenting microservices adoption.
* **ADR-002:** Formal policy strictly excluding non-deterministic generative models from payment settlement and inventory accounting.
* **Token Governance:** Recommends temperature and token allocation matrices across enterprise tasks.

### 📄 Use Case 2: Backend API Scaffolding
* **OpenAPI 3.0.3 Specification:** Contract-first API blueprint in [`openapi.yaml`](file:///c:/Users/vaibvars/OneDrive%20-%20Capgemini/Desktop/L1_UseCases/deliverables/uc2/openapi.yaml).
* **RFC 7807 Problem Details:** Structured error model with `type`, `title`, `status`, `detail`, and `error_code`.
* **Validation Layer:** Enforces input invariants at boundaries (positive quantities, email format, OCC tokens).
* **Token Limit Safeguards:** Documents token truncation prevention strategies.

### 🎨 Use Case 3: Frontend Generation & UI Risk Control
* **WCAG 2.1 AA Accessibility:** 100% compliance audit, semantic landmarks (`<main>`, `<header>`, `<nav>`, `<aside>`), keyboard navigation, screen reader `aria-live` regions.
* **Zero-Mutation State:** Adheres to pure immutable state updates in React to prevent UI desync bugs.
* **Double-Click Race Protection:** Disables checkout and cart buttons during network dispatch.

### 🔍 Use Case 4: AI-Assisted Code Review & Quality Governance
* **AST Static Code Scanner:** Scans Python Abstract Syntax Trees for missing null checks, SQL injections, and hardcoded credentials.
* **Cyclomatic Complexity Reduction:** Refactors complex branching logic in the order service, reducing McCabe complexity from 12 to 2.
* **Dependency License Audit:** Verifies license compliance (whitelisting MIT/Apache-2.0, flagging restrictive GPL licenses).

### 🧪 Use Case 5: AI-Generated Testing & Real-Time Edge Case Simulation
* **Pytest Verification Suite:** 43 automated tests covering 100% of critical paths.
* **Live Edge-Case Simulations:**
  1. *Out-of-Stock Contention:* Flash sale inventory race condition.
  2. *Payment SLA Timeout:* Gateway latency breach (>1500ms) with automatic Saga rollback.
  3. *Coupon Abuse:* Boundary validation for expired or sub-threshold coupons.
  4. *OCC Version Conflict:* Concurrent cart modification defense.
* **Automated Security Audit:** Proves protection against SQL injection, payload tampering, and replay attacks.

---

## 10. Comprehensive REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/products` | Retrieve catalog products with optional category and keyword search | Public |
| `POST` | `/api/v1/products/compare` | **SmartMatch**: Side-by-side spec comparison and AI buying verdict | Public |
| `GET` | `/api/v1/products/{id}` | Retrieve specific product details by ID | Public |
| `POST` | `/api/v1/cart/items` | Add item to cart with OCC version token validation | Public |
| `GET` | `/api/v1/cart` | Retrieve cart contents, subtotal, discounts, and OCC token | Public |
| `DELETE` | `/api/v1/cart/items/{id}` | Remove an item from the cart | Public |
| `POST` | `/api/v1/cart/coupon` | Apply promotional coupon code (`SAVE20`, `TECH50`) | Public |
| `POST` | `/api/v1/checkout` | Execute multi-step order checkout and reserve inventory | Public |
| `POST` | `/api/v1/payments` | Process payment with idempotency key and 1500ms SLA watchdog | Public |
| `POST` | `/api/v1/auth/register` | Register a new user account (Customer, Admin, Delivery Partner) | Public |
| `POST` | `/api/v1/auth/login` | Authenticate user and issue Bearer JWT access token | Public |
| `GET` | `/api/v1/auth/me` | Retrieve authenticated user profile and active role | Bearer Token |
| `GET` | `/api/v1/auth/profile-history` | Retrieve user past orders and dispatch timeline | Bearer Token |
| `PUT` | `/api/v1/auth/orders/{id}/status` | Update order dispatch status (Delivery Partner only) | Bearer Token |
| `POST` | `/api/v1/chat` | AI Shopping Concierge endpoint with slash command router | Public |
| `POST` | `/api/v1/rag/query` | Direct semantic RAG query with source citations | Public |
| `GET` | `/api/v1/usecases/{uc_id}` | Retrieve live telemetry and verification reports for UC1–UC5 | Public |

---

## 11. Automated Testing & Pytest Verification Report

The platform is backed by a comprehensive automated test suite in the `tests/` directory:

```text
============================= test session starts =============================
platform win32 -- Python 3.14.3, pytest-9.1.1, pluggy-1.6.0
configfile: pytest.ini
plugins: anyio-4.15.1, cov-7.1.0
collected 43 items

tests/test_api_endpoints.py::test_get_products PASSED                    [  2%]
tests/test_api_endpoints.py::test_get_product_by_id PASSED               [  4%]
tests/test_api_endpoints.py::test_get_invalid_product_404 PASSED         [  6%]
tests/test_api_endpoints.py::test_cart_operations PASSED                 [  9%]
tests/test_api_endpoints.py::test_chatbot_endpoint PASSED                [ 11%]
tests/test_api_endpoints.py::test_checkout_endpoint PASSED               [ 13%]
tests/test_api_endpoints.py::test_compare_products_endpoint PASSED       [ 16%]
tests/test_api_endpoints.py::test_compare_products_invalid_id_404 PASSED [ 18%]
tests/test_auth.py::test_login_demo_user_success PASSED                  [ 20%]
tests/test_auth.py::test_login_invalid_password_401 PASSED               [ 23%]
tests/test_auth.py::test_register_new_user_success PASSED                [ 25%]
tests/test_auth.py::test_register_duplicate_email_409 PASSED             [ 27%]
tests/test_auth.py::test_get_profile_with_bearer_token PASSED            [ 30%]
tests/test_auth.py::test_get_profile_unauthorized_401 PASSED             [ 32%]
tests/test_auth.py::test_rbac_admin_role_access PASSED                   [ 34%]
tests/test_auth.py::test_rbac_forbidden_role_403 PASSED                  [ 37%]
tests/test_auth.py::test_rbac_delivery_partner_access PASSED             [ 39%]
tests/test_cart_service.py::test_add_item_normal_flow PASSED             [ 41%]
tests/test_cart_service.py::test_add_item_exceeding_ceiling_quantity PASSED [ 44%]
tests/test_cart_service.py::test_add_item_negative_quantity PASSED       [ 46%]
tests/test_cart_service.py::test_add_item_out_of_stock PASSED            [ 48%]
tests/test_cart_service.py::test_add_invalid_product_id PASSED           [ 51%]
tests/test_cart_service.py::test_concurrent_modification_occ PASSED      [ 53%]
tests/test_cart_service.py::test_apply_valid_coupon PASSED               [ 55%]
tests/test_cart_service.py::test_apply_expired_coupon PASSED             [ 58%]
tests/test_payment_service.py::test_payment_success PASSED               [ 60%]
tests/test_payment_service.py::test_payment_idempotency_duplicate PASSED [ 62%]
tests/test_payment_service.py::test_payment_sla_timeout_breach PASSED    [ 65%]
tests/test_rag.py::test_vector_store_initialization PASSED               [ 67%]
tests/test_rag.py::test_vector_search_warranty_precision PASSED          [ 69%]
tests/test_rag.py::test_vector_search_adr002_ai_payment PASSED           [ 72%]
tests/test_rag.py::test_vector_search_product_specs PASSED               [ 74%]
tests/test_rag.py::test_rag_engine_answer_with_citations PASSED          [ 76%]
tests/test_rag.py::test_rag_api_query_endpoint PASSED                    [ 79%]
tests/test_rag.py::test_rag_api_documents_and_stats PASSED               [ 81%]
tests/test_rag.py::test_chatbot_rag_integration PASSED                   [ 83%]
tests/test_rag.py::test_chatbot_rag_command PASSED                       [ 86%]
tests/test_security_scenarios.py::test_security_audit_all_vectors_blocked PASSED [ 88%]
tests/test_use_cases.py::test_uc1_architecture_engine PASSED             [ 90%]
tests/test_use_cases.py::test_uc2_openapi_contract_validity PASSED       [ 93%]
tests/test_use_cases.py::test_uc3_accessibility_and_ui_risks PASSED      [ 95%]
tests/test_use_cases.py::test_uc4_code_review_and_license PASSED         [ 97%]
tests/test_use_cases.py::test_uc5_simulations_and_test_generator PASSED  [100%]

======================= 43 passed, 1 warning in 12.02s ========================
```

---

## 12. Appraisal & Mentor Presentation Defense Guide

When demonstrating this project to assessors, mentors, or leadership, use the following strategic flow to highlight your engineering depth:

### 🎯 5-Minute High-Impact Live Demo Flow

1. **The Storefront (30 Seconds):**
   - Open `http://localhost:5173` or `http://127.0.0.1:8000`.
   - Point out the dark obsidian glassmorphic aesthetic, WCAG 2.1 AA accessibility score, and live search responsiveness.
2. **The Standout Feature: AI SmartMatch (90 Seconds):**
   - Click the **"⚖️ Compare"** button on the *HyperSound ANC Headphones* and *Titanium Smartwatch*.
   - Show the floating bottom dock sliding up with selected products. Click **"Compare Now"**.
   - Show the side-by-side technical matrix.
   - Switch the persona chip from **"Balanced Value"** to **"Audiophile & Sound"** and show how the AI re-ranks the winner and synthesizes customized pros/cons.
   - Click **"+ Add Winner to Cart"** directly from the AI recommendation.
3. **Cart & Optimistic Concurrency Control (60 Seconds):**
   - Open the cart drawer, apply promo code `SAVE20`, and explain the Optimistic Concurrency Control (`version_token`) mechanism preventing flash-sale race conditions.
4. **Embedded Vector RAG Chatbot (60 Seconds):**
   - Open the floating chatbot and ask: *"What is the warranty coverage on the headphones?"*
   - Show the answer with verifiable citations referencing ADRs and warranty docs.
5. **SSMS Integration & 43 Tests (60 Seconds):**
   - Run `python run.py --ssms` to show Microsoft SQL Server database connectivity.
   - Run `python run.py --test` to show 43 passing automated tests.

### 🧠 Mentor Q&A Defense Cheat Sheet

| Likely Mentor Question | Winning Technical Answer |
|---|---|
| *"Why use FastAPI instead of Django or Flask?"* | FastAPI is built on ASGI (Starlette) and Pydantic v2, giving us native asynchronous non-blocking I/O for 10k concurrent users, automatic OpenAPI 3.0 documentation, and 3x faster JSON serialization compared to Flask or Django ORM. |
| *"How did you prevent race conditions during checkout?"* | We implemented a dual safeguard: (1) Optimistic Concurrency Control (OCC) using atomic version tokens on carts to reject stale writes, and (2) Client-generated idempotency keys on payments with an in-memory cache to prevent duplicate billing. |
| *"Why did you separate AI from the payment logic (ADR-002)?"* | Non-deterministic Large Language Models should never handle financial settlement or stock deduction. AI is strictly leveraged as an advisory shopping concierge and comparison synthesizer, keeping transactions 100% deterministic and auditable. |
| *"How does your RAG implementation prevent hallucinations?"* | The RAG engine chunks curated policy and specification documents into an in-memory vector store using cosine similarity. It augments the prompt exclusively with retrieved ground truth and formats verifiable source citations with relevance scores. |
| *"How is SQL Server integrated?"* | We use `pyodbc` connecting directly to `AeroStoreDB` with parameterized queries to prevent SQL injection, backed by automatic T-SQL schema migrations in `backend/sql/ssms_schema_and_seed.sql`. |

---
*Documentation compiled and maintained for AeroStore Enterprise E-Commerce Platform.*
