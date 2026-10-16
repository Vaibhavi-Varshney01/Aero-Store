# 🛒 AeroStore React Frontend (`frontend-react`)

A modern, high-performance **React 19 + Vite** storefront and management console for the AeroStore platform, featuring dark/light theming, real-time shopping cart, interactive AI Chatbot widget, RBAC user dashboards, product comparison docks, and direct evaluation tooling for **Use Cases 1 to 5**.

---

## 🚀 Key Highlights & Features

1. **Modern Component Architecture**:
   - **HeroSection & TrustBar**: High-conversion landing components with key metrics.
   - **CategoryTabs & ProductGrid**: Categorized filtering, instant search, and stock status indicators.
   - **ProductCard & ProductDetailModal**: Quick view, image galleries, stock limits, and specification inspections.
   - **CompareDock & CompareModal**: Multi-product side-by-side spec and price comparison.
   - **CartDrawer & CartPage**: Optimistic Cart state, OCC version conflict resolution, coupon code validator, and order breakdown.
   - **CheckoutModal**: Multi-step checkout with address selection, payment simulation with idempotency keys, and order receipt generation.
   - **ChatbotWidget**: Floating conversational assistant supporting natural language cart operations, product inquiries, and developer commands (`/1`–`/5`, `/architecture`, `/a11y`, `/simulate`).
   - **ProfileDashboard & DashboardPage**: Role-based access control (Admin, Delivery Partner, Customer) with order history and catalog management.

2. **State Management & Resilience**:
   - **CartContext**: Optimistic cart mutations with server rollback on concurrency or stock errors.
   - **AuthContext / AuthModal**: JWT authentication with demo credentials (`jane.doe@example.com`, `admin@example.com`).
   - **Toast Notifications**: Accessible floating feedback for user interactions.

3. **Production-Ready Build**:
   - Compiles to static assets (`dist/`) served directly by the FastAPI backend at `http://127.0.0.1:8000`.

---

## 🛠️ Development & Build Commands

All commands should be executed from within the `frontend-react` folder:

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server with Hot Module Replacement (HMR)
npm run dev

# 3. Compile optimized production build (outputs to dist/)
npm run build

# 4. Preview the production build locally
npm run preview

# 5. Run Oxlint code checks
npm run lint
```

---

## 📁 Directory Structure

```
frontend-react/
├── dist/                     # Optimized production bundle (served by FastAPI)
├── public/                   # Static favicon and media assets
├── src/
│   ├── components/           # Reusable UI widgets & modals (22 components)
│   │   ├── AdminAvatar.jsx
│   │   ├── AppInfoModal.jsx
│   │   ├── AuthModal.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── CategoryTabs.jsx
│   │   ├── ChatbotWidget.jsx
│   │   ├── CheckoutModal.jsx
│   │   ├── CompareDock.jsx
│   │   ├── CompareModal.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── HeroSection.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductDetailModal.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── ProfileDashboard.jsx
│   │   ├── ServicesSection.jsx
│   │   ├── SidebarDrawer.jsx
│   │   ├── Toast.jsx
│   │   ├── TrustBar.jsx
│   │   ├── UseCaseBanner.jsx
│   │   └── UseCaseModal.jsx
│   ├── context/              # Cart & App Context providers
│   ├── pages/                # Top-level page views (HomePage, CartPage, DashboardPage, etc.)
│   ├── services/             # Axios/fetch API integration services
│   ├── utils/                # Formatting, storage & helper routines
│   ├── App.jsx               # Application shell & modal router
│   ├── index.css             # Unified design system & responsive styling
│   └── main.jsx              # React 19 DOM root mount
├── package.json
└── vite.config.js
```

---

## 🔗 Backend Integration

When running via `python run.py`, the backend automatically mounts the compiled `frontend-react/dist` directory to serve the frontend on `http://127.0.0.1:8000/`. When running in standalone dev mode (`npm run dev`), the Vite server proxies API calls to port `8000`.
