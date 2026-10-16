# Tier 2: API / Controller Tier (Transport Layer)

## Overview
The API / Controller Tier handles all incoming HTTP traffic, parses JSON payloads, validates contracts via Pydantic models, checks authorization tokens, and translates service outcomes into HTTP status codes.

- **Technology**: FastAPI, Starlette, Pydantic V2.
- **Prefix**: `/api/v1`

## Routers & Controllers
1. **Products Controller** (`backend/api/products.py`):
   - `GET /api/v1/products`: Search and filter catalog items.
   - `GET /api/v1/products/{id}`: Detailed product specifications.
   - `POST /api/v1/products/compare`: Generates SmartMatch AI comparison matrix.
   - `POST /api/v1/products`: Admin catalog creation.
2. **Cart Controller** (`backend/api/cart.py`):
   - `GET /api/v1/cart`: Fetches shopping cart with OCC version token.
   - `POST /api/v1/cart/items`: Adds item with stock reservation checks.
   - `PUT /api/v1/cart/items/{id}`: Updates item quantities.
   - `POST /api/v1/cart/coupon`: Validates and applies promo codes.
3. **Checkout Controller** (`backend/api/checkout.py`):
   - `POST /api/v1/checkout`: Initiates 3-phase checkout transaction saga.
4. **Auth Controller** (`backend/api/auth.py`):
   - `POST /api/v1/auth/register`: Creates new customer or staff account.
   - `POST /api/v1/auth/login`: Authenticates credentials and issues bearer token.
   - `GET /api/v1/auth/profile`: Retrieves authenticated user profile.
   - `POST /api/v1/auth/dispatch-order/{id}`: Delivery driver status update.
5. **Chatbot Controller** (`backend/layers/tier2_api/chatbot.py`):
   - `POST /api/v1/chat`: AI concierge & interactive CRUD engine powered by Capgemini Generative Engine (GPT-4o).
