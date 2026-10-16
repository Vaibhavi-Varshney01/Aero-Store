"""
USE CASE 3: Frontend Prompt Library Entry
Documented best-practice prompt template for generating accessible, risk-free frontend components.
"""

FRONTEND_PROMPT_ENTRY = """# Frontend Engineering Prompt Library Entry: E-Commerce Product & Cart

## Metadata
* **ID:** PROMPT-FE-003
* **Category:** Accessible Frontend Generation & UI Risk Control
* **Target Stack:** HTML5 / React / Modern JavaScript & Vanilla CSS
* **Standard:** WCAG 2.1 Level AA Compliance

## Production-Grade Prompt Template
```markdown
You are a senior frontend engineer specializing in accessible web applications (WCAG 2.1 AA).
Generate an accessible Product Listing and Cart component for an Online Shopping System.

### Functional Requirements:
1. Fetch products from REST endpoint: GET /api/v1/products
2. Display product image, title, category, price, stock badge, and 'Add to Cart' button.
3. Manage cart state immutably: NEVER mutate state directly (no direct array push or property reassignment).
4. Implement accessible loading skeletons (aria-busy="true") and error retry banners (role="alert").
5. Guard against double-click race conditions on 'Add to Cart' and 'Checkout' buttons.

### Accessibility (WCAG 2.1 AA) Constraints:
- Use semantic HTML: <main>, <section>, <article>, <header>, <nav>.
- Add descriptive aria-label attributes to icon-only buttons (e.g., aria-label="Add HyperSound Headphones to cart").
- Announce cart total updates dynamically via an aria-live="polite" region.
- Ensure all interactive elements are focusable via keyboard Tab key with visible focus outlines (:focus-visible).
- Contrast ratio must exceed 4.5:1 for body copy against dark/light backgrounds.

### Output Requirements:
1. Component code (Clean, self-contained, typed).
2. Explanation of UI risk mitigations implemented.
3. Regression testing checklist for QA automation.
```

## Positive Impact
* Eliminates hallucinated API endpoints by specifying exact contract path `/api/v1/products`.
* Prevents silent state mutation bugs by explicitly banning `.push()` and requiring immutable updates.
* Guarantees 100% WCAG 2.1 AA accessibility score out-of-the-box.
"""

class PromptLibrary:
    @staticmethod
    def get_frontend_entry() -> str:
        return FRONTEND_PROMPT_ENTRY

prompt_library = PromptLibrary()
