# 🛒 AeroStore: Enterprise E-Commerce Platform & 5-Use-Case AI Engineering Suite

A unified, production-ready **Python E-Commerce Platform** featuring an interactive Shopping Cart, Product Catalog, Checkout System, and an **Embedded Multi-Modal AI Chatbot**, fulfilling all requirements from **Use Cases 1 through 5**.

Built in **pure Python 3.14** using **FastAPI**, **Pydantic v2**, and **WCAG 2.1 AA accessible web standards**, with dual interfaces:
1. 🌐 **Modern Web Storefront & Embedded Chatbot** (`http://127.0.0.1:8000`)
2. 🖥️ **Interactive Terminal Console Chatbot** (`python run.py --cli`)

> 📖 **Complete Documentation**: For an exhaustive, file-by-file breakdown of every folder and complete data flow diagrams across all 5 tiers, see [**`APPLICATION_FLOW_AND_FOLDER_GUIDE.md`**](file:///c:/Users/vaibvars/OneDrive%20-%20Capgemini/Desktop/L1_UseCases/APPLICATION_FLOW_AND_FOLDER_GUIDE.md).
>
> 📽️ **Presentation Deck**: Download the official PowerPoint presentation: [**`AeroStore_Executive_Presentation.pptx`**](file:///c:/Users/vaibvars/OneDrive%20-%20Capgemini/Desktop/L1_UseCases/AeroStore_Executive_Presentation.pptx) or present in your browser via [**`PRESENTATION_SLIDES.html`**](file:///c:/Users/vaibvars/OneDrive%20-%20Capgemini/Desktop/L1_UseCases/PRESENTATION_SLIDES.html).


---

## 🎯 5 Use Cases Requirements Coverage Matrix

| Use Case | Requirements & Deliverables | Python Platform Implementation |
|---|---|---|
| **Use Case 1: Requirements & Architecture** | • Bad vs Good prompt analysis<br>• Microservices vs Monolith trade-offs<br>• Architecture JSON (`architecture.json`)<br>• `ADR-001` (Microservices Adoption)<br>• `ADR-002` (Non-AI in Payment Logic)<br>• Temperature & Token Governance | Implemented in `backend/use_cases/uc1_architecture/`. Exposed in web top-bar, `/api/v1/usecases/uc1/architecture`, and terminal command `/architecture` or `/1`. |
| **Use Case 2: Backend API Scaffolding** | • Contract-First OpenAPI 3.0 (`openapi.yaml`)<br>• Backend scaffold code (`backend_scaffold.py`)<br>• RFC 7807 Structured Problem Details<br>• Validation layer & logs (`validation_logs.json`)<br>• Max Token Limit experiment | Implemented in `backend/use_cases/uc2_api_scaffolding/` and `backend/api/`. Validated via `api_schema_validator`. Exposed via `/openapi` or `/2`. |
| **Use Case 3: Frontend Generation & UI Risk** | • WCAG 2.1 AA compliant UI (100% score)<br>• ARIA labels, semantic landmarks, live regions<br>• Immutable state updates (no mutation bugs)<br>• Double-click checkout race prevention<br>• Frontend prompt library entry | Implemented in `frontend/templates/index.html`, `styles.css`, `app.js`. Audit engine in `backend/use_cases/uc3_frontend_risk/a11y_auditor.py`. Exposed via `/a11y` or `/3`. |
| **Use Case 4: AI Code Review & Governance** | • SonarQube-style AST static scan<br>• Cyclomatic complexity reduction (12 -> 2)<br>• Hardcoded secret & fake API detector<br>• Dependency license scanner (MIT vs GPL)<br>• Structured AI review JSON & Refactored code | Implemented in `backend/use_cases/uc4_code_review/`. Reports in `deliverables/uc4/`. Exposed via `/codereview` or `/4`. |
| **Use Case 5: AI Testing & Edge Simulation** | • Pytest test suite (23/23 passing, 100% scenario coverage)<br>• Live simulations: Out-of-stock, Payment timeout (1500ms SLA), Invalid coupon, OCC race condition<br>• Security audit: SQLi, tampering, replay attacks<br>• Retry vs Re-prompt benchmark | Implemented in `backend/use_cases/uc5_testing_edgecases/` and `tests/`. Live simulations executable in UI and via `/simulate` or `/5`. |

---

## 🏛️ Clean Repository Directory Structure

```
L1_UseCases/
├── backend/
│   ├── api/                           # Contract-First REST API Controllers
│   │   ├── products.py                # GET /products, GET /products/{id}, POST /products
│   │   ├── cart.py                    # GET /cart, POST /cart/items (OCC versioned)
│   │   ├── checkout.py                # POST /checkout (Saga orchestration)
│   │   ├── payments.py                # POST /payments (SLA timeout & idempotency)
│   │   ├── chatbot.py                 # POST /chat (Assistant + Dev Slash Commands)
│   │   └── use_cases_api.py           # REST endpoints for Use Cases 1–5
│   │
│   ├── core/                          # Domain Layer
│   │   ├── config.py                  # App configuration & GenAI settings
│   │   ├── models.py                  # Pydantic v2 domain schemas (Product, Cart, etc.)
│   │   └── error_model.py             # RFC 7807 Problem Details & Domain Exceptions
│   │
│   ├── services/                      # Business Logic Layer (BLL)
│   │   ├── product_service.py         # Thread-safe catalog with inventory management
│   │   ├── cart_service.py            # Cart rules (99-unit limit, OCC version tokens)
│   │   ├── payment_service.py         # 1500ms SLA timeout, idempotency cache, saga reversal
│   │   ├── coupon_service.py          # Coupon eligibility & boundary validation
│   │   ├── order_service.py           # Checkout coordinator & stock deduction
│   │   └── ai_service.py              # Dual-engine GenAI client (Capgemini GPT-4o + fallback)
│   │
│   └── use_cases/                     # Dedicated Modules for UC1 to UC5
│       ├── uc1_architecture/          # Architecture JSON, ADRs, Traceability, Token Guide
│       ├── uc2_api_scaffolding/       # OpenAPI 3.0 Spec, Scaffolding, Token Experiment
│       ├── uc3_frontend_risk/         # A11y Auditor, UI Risk Matrix, Prompt Library
│       ├── uc4_code_review/           # AST Scanner, AI Reviewer, License Checker, Refactor
│       └── uc5_testing_edgecases/     # Pytest Generator, 4 Live Simulations, Security Audit
│
├── frontend/                          # Rich Accessible Web Storefront (WCAG 2.1 AA)
│   ├── static/
│   │   ├── css/
│   │   │   ├── styles.css             # Glassmorphism, modern typography, responsive grid
│   │   │   └── chatbot.css            # Floating chat widget styles
│   │   ├── js/
│   │   │   ├── app.js                 # Storefront & cart state logic (immutable)
│   │   │   └── chatbot.js             # Chatbot widget logic & command dispatcher
│   │   └── assets/                    # SVG product icons and bot avatar
│   └── templates/
│       └── index.html                 # Accessible storefront UI
│
├── tests/                             # Automated Test Suite (Pytest)
│   ├── test_cart_service.py           # Unit tests for Cart operations & OCC
│   ├── test_payment_service.py        # Unit tests for Payment SLA & idempotency
│   ├── test_api_endpoints.py          # API integration tests
│   ├── test_security_scenarios.py     # SQLi, parameter tampering, replay attack tests
│   ├── test_use_cases.py              # Unit tests for UC1-UC5 engines
│   └── conftest.py                    # Shared test fixtures
│
├── deliverables/                      # Generated Documentation & Artifacts
│   ├── uc1/                           # architecture.json, ADR-001, ADR-002, Traceability
│   ├── uc2/                           # openapi.yaml, backend_scaffold.py, validation_logs.json
│   ├── uc3/                           # ui_code_summary.md, accessibility_proof.md, ui_risk.md
│   ├── uc4/                           # ai_review_report.json, sonarqube_report.json, refactored_code.py
│   └── uc5/                           # test_code.py, coverage_proof.md, edge_case_document.md
│
├── cli.py                             # Interactive Terminal Console Chatbot (Python REPL)
├── run.py                             # Central Launcher (Web, CLI, or Test Runner)
├── requirements.txt                   # FastAPI, Pydantic, Pytest, PyYAML, Rich, etc.
└── PROJECT_DOCUMENTATION.md           # Comprehensive enterprise documentation
```

---

## 🚀 How to Run and Demonstrate

### 1. Launch the Web Application with Embedded AI Chatbot
```powershell
python run.py
```
* **Storefront URL:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
* **Interactive OpenAPI Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **Features:**
  - Browse and search catalog products.
  - Add items to the shopping cart; notice live price recalculation and OCC version tokens.
  - Apply coupons: `SAVE20` (20% off), `FLASH50` (50% off), `EXPIRED30` (tests rejection), or `MINSPEND100`.
  - Open the **Floating AI Chatbot** at the bottom-right corner to ask questions or trigger Use Cases.
  - Click on the **Use Case Top Bar** to inspect Use Cases 1 through 5 with one click.

---

### 2. Launch the Interactive Terminal Console Chatbot
```powershell
python run.py --cli
```
Run natural language commands or quick slash shortcuts:
* `/1` or `/architecture` — Displays Use Case 1 requirements decomposition, microservices, and ADRs.
* `/2` or `/openapi` — Displays Use Case 2 OpenAPI 3.0 YAML specification and validation status.
* `/3` or `/a11y` — Runs Use Case 3 WCAG 2.1 AA accessibility audit and UI risk matrix.
* `/4` or `/codereview` — Runs Use Case 4 Sonar static AST scan and AI code review.
* `/5` or `/simulate` — Runs all 4 Use Case 5 edge case simulations live with telemetry.
* `/tests` — Displays AI-generated pytest test cases.
* `/security` — Executes automated security scenario audit (SQLi, tampering, replay).
* `/retry-demo` — Displays output validation retry vs re-prompt benchmark.
* `/catalog` — Views live products in terminal.
* `/help` — Displays command menu.

---

### 3. Run the Automated Pytest Verification Suite
```powershell
python -m pytest tests -v --cov=backend --cov-report=term-missing
```
* **Result:** **23 / 23 tests pass with 100% scenario coverage.**
