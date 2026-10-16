# Tier 1: Presentation Tier (Client Layer)

## Overview
The Presentation Tier is the client-facing user interface of the AeroStore application. It interacts strictly with the API / Controller Tier (Tier 2) over standard HTTP/REST endpoints.

- **Physical Project Path**: [`frontend-react/`](file:///c:/Users/vaibvars/OneDrive%20-%20Capgemini/Desktop/L1_UseCases/frontend-react)
- **Technology Stack**: React 18, Vite, Vanilla CSS Design System, Context API.
- **Entrypoint**: [`frontend-react/src/main.jsx`](file:///c:/Users/vaibvars/OneDrive%20-%20Capgemini/Desktop/L1_UseCases/frontend-react/src/main.jsx)
- **API Transport Service**: [`frontend-react/src/services/api.js`](file:///c:/Users/vaibvars/OneDrive%20-%20Capgemini/Desktop/L1_UseCases/frontend-react/src/services/api.js)

## Core Submodules
1. **Views & Pages** (`frontend-react/src/pages/`):
   - `HomePage.jsx`: Hero showcase, featured products, VIP promotional banner.
   - `ItemsPage.jsx`: Full hardware catalog with search, category filtering, and brand comparison triggers.
   - `CartPage.jsx`: Interactive shopping bag with OCC version tracking and coupon codes.
   - `DashboardPage.jsx`: Role-tailored dashboards for Customer, Administrator, and Delivery Courier.
   - `AuthPage.jsx`: Secure member login and registration portal.
2. **Components** (`frontend-react/src/components/`):
   - `CompareModal.jsx`: Multi-brand shootout matrix comparing same-item brands side-by-side.
   - `CompareDock.jsx`: Persistent bottom dock for active brand comparisons.
   - `Header.jsx`: Responsive navigation header with role-tailored action links.
   - `ChatbotWidget.jsx`: Embedded AI shopping assistant powered by Capgemini Generative Engine (GPT-4o) and Interactive CRUD actions.
