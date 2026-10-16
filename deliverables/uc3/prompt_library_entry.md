# Use Case 3: Prompt Library Entry for Frontend Generation

## Metadata
* **Prompt ID:** `FE-A11Y-003`
* **Target Stack:** HTML5 / Modern JavaScript / WCAG 2.1 Level AA
* **Audience:** Frontend Engineers & AI Code Synthesizers

## Standardized Prompt Template
```markdown
You are a senior frontend engineer specializing in accessible, enterprise web applications (WCAG 2.1 AA).
Generate an accessible Product Listing and Shopping Cart component for an Online Shopping System.

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
