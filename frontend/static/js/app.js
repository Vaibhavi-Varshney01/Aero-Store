/**
 * Storefront & Shopping Cart Logic
 * Standards: WCAG 2.1 AA Accessible, Immutable State Updates, Race-Condition Safe
 */

const AppState = {
  products: [],
  cart: { items: [], subtotal: 0, discount_amount: 0, tax_amount: 0, total_amount: 0, concurrency_version: 1 },
  selectedCategory: 'All',
  searchQuery: '',
  isLoading: false
};

// -----------------------------------------------------------------------------
// DOM REFERENCES
// -----------------------------------------------------------------------------
const dom = {
  productGrid: document.getElementById('product-grid'),
  cartItemsList: document.getElementById('cart-items-list'),
  cartBadge: document.getElementById('cart-badge-count'),
  cartSubtotal: document.getElementById('cart-subtotal'),
  cartDiscount: document.getElementById('cart-discount'),
  cartTax: document.getElementById('cart-tax'),
  cartTotal: document.getElementById('cart-total'),
  cartDrawer: document.getElementById('cart-drawer'),
  cartOverlay: document.getElementById('cart-overlay'),
  couponInput: document.getElementById('coupon-input'),
  checkoutModal: document.getElementById('checkout-modal'),
  useCaseModal: document.getElementById('use-case-modal'),
  useCaseModalTitle: document.getElementById('use-case-modal-title'),
  useCaseModalContent: document.getElementById('use-case-modal-content'),
  liveAnnouncer: document.getElementById('live-announcer'),
  searchInput: document.getElementById('search-input')
};

// -----------------------------------------------------------------------------
// INITIALIZATION
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadCart();
  setupEventListeners();
});

function announce(message) {
  if (dom.liveAnnouncer) {
    dom.liveAnnouncer.textContent = message;
  }
}

// -----------------------------------------------------------------------------
// API CALLS (CONTRACT-FIRST REST)
// -----------------------------------------------------------------------------
async function loadProducts() {
  try {
    let url = '/api/v1/products';
    const params = new URLSearchParams();
    if (AppState.selectedCategory && AppState.selectedCategory !== 'All') {
      params.append('category', AppState.selectedCategory);
    }
    if (AppState.searchQuery) {
      params.append('search', AppState.searchQuery);
    }
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    AppState.products = data;
    renderProducts();
  } catch (err) {
    console.error('Failed to load products:', err);
    dom.productGrid.innerHTML = `
      <div role="alert" style="grid-column: 1/-1; padding: 2rem; background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 8px;">
        <h3>Unable to load catalog</h3>
        <p>Please ensure the backend server is running at http://127.0.0.1:8000.</p>
        <button onclick="loadProducts()" class="btn-icon" style="margin-top: 1rem;">Retry</button>
      </div>`;
  }
}

async function loadCart() {
  try {
    const res = await fetch('/api/v1/cart?cart_id=default_cart');
    if (res.ok) {
      const data = await res.json();
      AppState.cart = data;
      renderCart();
    }
  } catch (err) {
    console.warn('Cart load issue:', err);
  }
}

async function addToCart(productId) {
  const btn = document.getElementById(`btn-add-${productId}`);
  if (btn) btn.disabled = true;

  try {
    const res = await fetch('/api/v1/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart_id: 'default_cart',
        product_id: productId,
        quantity: 1,
        expected_version: AppState.cart.concurrency_version
      })
    });

    if (!res.ok) {
      const prob = await res.json();
      alert(`⚠️ ${prob.title || 'Error'}: ${prob.detail || 'Could not add item'}`);
      return;
    }

    const updatedCart = await res.json();
    AppState.cart = updatedCart;
    renderCart();
    openCart();
    announce(`Item added to cart. Total items: ${updatedCart.items.reduce((s, i) => s + i.quantity, 0)}.`);
  } catch (err) {
    alert('Network error adding to cart');
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function updateCartItem(productId, quantity) {
  try {
    const res = await fetch(`/api/v1/cart/items/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart_id: 'default_cart',
        quantity: quantity,
        expected_version: AppState.cart.concurrency_version
      })
    });

    if (!res.ok) {
      const prob = await res.json();
      alert(`⚠️ ${prob.title || 'Error'}: ${prob.detail}`);
      return;
    }

    const updatedCart = await res.json();
    AppState.cart = updatedCart;
    renderCart();
    announce('Cart updated.');
  } catch (err) {
    alert('Failed to update cart item.');
  }
}

async function applyCoupon() {
  const code = dom.couponInput.value.trim();
  if (!code) return;

  try {
    const res = await fetch('/api/v1/cart/coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart_id: 'default_cart', coupon_code: code })
    });

    if (!res.ok) {
      const prob = await res.json();
      alert(`⚠️ Coupon Error: ${prob.detail}`);
      return;
    }

    const updated = await res.json();
    AppState.cart = updated;
    renderCart();
    announce(`Coupon ${code} applied successfully!`);
    alert(`🎉 Coupon ${code} applied! Saved $${updated.discount_amount.toFixed(2)}`);
  } catch (err) {
    alert('Failed to apply coupon.');
  }
}

// -----------------------------------------------------------------------------
// RENDERING
// -----------------------------------------------------------------------------
function renderProducts() {
  if (!AppState.products.length) {
    dom.productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #94a3b8;">No products matched your criteria.</p>';
    return;
  }

  dom.productGrid.innerHTML = AppState.products.map(p => {
    let stockClass = 'stock-in';
    let stockText = `${p.stock} in stock`;
    if (p.stock === 0) {
      stockClass = 'stock-out';
      stockText = 'Out of Stock';
    } else if (p.stock <= 2) {
      stockClass = 'stock-low';
      stockText = `Low Stock (${p.stock} left)`;
    }

    return `
      <article class="product-card" aria-labelledby="title-${p.id}">
        <div class="product-img-wrap">
          <img src="${p.image_url || '/static/assets/headphones.svg'}" alt="${p.name}" loading="lazy" />
        </div>
        <div class="product-category-tag">${p.category}</div>
        <h3 id="title-${p.id}" class="product-title">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-meta-row">
          <div class="product-price">$${p.price.toFixed(2)}</div>
          <span class="stock-badge ${stockClass}">${stockText}</span>
        </div>
        <button 
          id="btn-add-${p.id}"
          class="btn-add-cart" 
          aria-label="Add ${p.name} to shopping cart"
          ${p.stock === 0 ? 'disabled' : ''}
          onclick="addToCart('${p.id}')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          ${p.stock === 0 ? 'Sold Out' : 'Add to Cart'}
        </button>
      </article>
    `;
  }).join('');
}

function renderCart() {
  const totalCount = AppState.cart.items.reduce((s, i) => s + i.quantity, 0);
  dom.cartBadge.textContent = totalCount;

  if (!AppState.cart.items.length) {
    dom.cartItemsList.innerHTML = '<p style="text-align: center; color: #94a3b8; margin-top: 3rem;">Your cart is currently empty.</p>';
  } else {
    dom.cartItemsList.innerHTML = AppState.cart.items.map(item => `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>$${item.unit_price.toFixed(2)} each</p>
        </div>
        <div class="qty-control">
          <button class="qty-btn" aria-label="Decrease quantity for ${item.name}" onclick="updateCartItem('${item.product_id}', ${item.quantity - 1})">-</button>
          <span style="font-weight: 700; width: 24px; text-align: center;">${item.quantity}</span>
          <button class="qty-btn" aria-label="Increase quantity for ${item.name}" onclick="updateCartItem('${item.product_id}', ${item.quantity + 1})">+</button>
        </div>
      </div>
    `).join('');
  }

  dom.cartSubtotal.textContent = `$${AppState.cart.subtotal.toFixed(2)}`;
  dom.cartDiscount.textContent = `-$${AppState.cart.discount_amount.toFixed(2)}`;
  dom.cartTax.textContent = `$${AppState.cart.tax_amount.toFixed(2)}`;
  dom.cartTotal.textContent = `$${AppState.cart.total_amount.toFixed(2)}`;
}

// -----------------------------------------------------------------------------
// CART DRAWER INTERACTIONS
// -----------------------------------------------------------------------------
function openCart() {
  dom.cartDrawer.classList.add('open');
  dom.cartOverlay.classList.add('open');
  dom.cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  dom.cartDrawer.classList.remove('open');
  dom.cartOverlay.classList.remove('open');
  dom.cartDrawer.setAttribute('aria-hidden', 'true');
}

// -----------------------------------------------------------------------------
// CHECKOUT MODAL FLOW
// -----------------------------------------------------------------------------
function openCheckoutModal() {
  if (!AppState.cart.items.length) {
    alert('Cannot checkout with an empty cart!');
    return;
  }
  closeCart();
  dom.checkoutModal.classList.add('open');
  document.getElementById('checkout-total-display').textContent = `$${AppState.cart.total_amount.toFixed(2)}`;
}

function closeCheckoutModal() {
  dom.checkoutModal.classList.remove('open');
}

async function submitOrder(e) {
  e.preventDefault();
  const simTimeout = document.getElementById('sim-timeout-check').checked;
  const simFailure = document.getElementById('sim-failure-check').checked;

  const btn = document.getElementById('btn-confirm-order');
  btn.disabled = true;
  btn.textContent = 'Processing Payment (SLA: 1500ms)...';

  try {
    const res = await fetch('/api/v1/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart_id: 'default_cart',
        shipping_address: {
          full_name: document.getElementById('ship-name').value,
          street: document.getElementById('ship-street').value,
          city: document.getElementById('ship-city').value,
          state: document.getElementById('ship-state').value,
          zip: document.getElementById('ship-zip').value
        },
        simulate_timeout: simTimeout,
        simulate_failure: simFailure
      })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(`❌ Order Error: ${data.title}\n${data.detail}`);
    } else {
      alert(`✅ Order Confirmed!\nOrder ID: ${data.order_id}\nTransaction ID: ${data.transaction_id}\nTotal Captured: $${data.total_amount.toFixed(2)}`);
      closeCheckoutModal();
      loadCart();
      loadProducts();
    }
  } catch (err) {
    alert('Checkout network error.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Authorize & Place Order';
  }
}

// -----------------------------------------------------------------------------
// USE CASES VIEWER MODAL (UC1 - UC5)
// -----------------------------------------------------------------------------
async function openUseCaseViewer(ucNumber) {
  dom.useCaseModal.classList.add('open');
  dom.useCaseModalTitle.textContent = `Loading Use Case ${ucNumber}...`;
  dom.useCaseModalContent.innerHTML = '<p>Querying API...</p>';

  try {
    let endpoint = '';
    if (ucNumber === 1) endpoint = '/api/v1/usecases/uc1/architecture';
    else if (ucNumber === 2) endpoint = '/api/v1/usecases/uc2/openapi';
    else if (ucNumber === 3) endpoint = '/api/v1/usecases/uc3/frontend-audit';
    else if (ucNumber === 4) endpoint = '/api/v1/usecases/uc4/code-review';
    else if (ucNumber === 5) endpoint = '/api/v1/usecases/uc5/simulate/out_of_stock';

    const res = await fetch(endpoint);
    const data = await res.json();

    if (ucNumber === 1) {
      dom.useCaseModalTitle.textContent = 'USE CASE 1: AI Requirements & Architecture';
      dom.useCaseModalContent.innerHTML = `
        <h4>System Architecture Style: <span style="color:#38bdf8">${data.architecture_json.architecture_style}</span></h4>
        <p>Target: 10k concurrent users | REST Contract-First</p>
        <h4 style="margin-top:1rem;">ADR-001 (Microservices Adoption)</h4>
        <pre class="telemetry-box">${data.adr_001.substring(0, 600)}...</pre>
        <h4 style="margin-top:1rem;">ADR-002 (Non-AI in Payment Logic)</h4>
        <pre class="telemetry-box">${data.adr_002.substring(0, 600)}...</pre>
      `;
    } else if (ucNumber === 2) {
      dom.useCaseModalTitle.textContent = 'USE CASE 2: OpenAPI 3.0 Contract-First Scaffolding';
      dom.useCaseModalContent.innerHTML = `
        <h4>OpenAPI Spec Validation: <span style="color:#10b981">${data.validation_result.valid ? 'VALID 100%' : 'INVALID'}</span></h4>
        <p>Title: ${data.validation_result.title} | Version: ${data.validation_result.version}</p>
        <h4 style="margin-top:1rem;">Retry vs Re-prompt Demo:</h4>
        <pre class="telemetry-box">${JSON.stringify(data.retry_vs_reprompt, null, 2)}</pre>
      `;
    } else if (ucNumber === 3) {
      dom.useCaseModalTitle.textContent = 'USE CASE 3: Frontend Accessibility & UI Risk Control';
      dom.useCaseModalContent.innerHTML = `
        <h4>WCAG 2.1 AA Compliance Score: <span style="color:#10b981">${data.a11y_audit.compliance_score}</span></h4>
        <h4 style="margin-top:1rem;">UI Risk Matrix:</h4>
        <pre class="telemetry-box">${JSON.stringify(data.ui_risks.identified_risks_and_mitigations, null, 2)}</pre>
      `;
    } else if (ucNumber === 4) {
      dom.useCaseModalTitle.textContent = 'USE CASE 4: AI Code Review & Sonar Static Governance';
      dom.useCaseModalContent.innerHTML = `
        <h4>Risk Level: <span style="color:#f59e0b">${data.ai_review_json.risk_level}</span> | Complexity: ${data.ai_review_json.complexity_score}</h4>
        <h4 style="margin-top:1rem;">Security Issues Detected:</h4>
        <ul>${data.ai_review_json.security_issues.map(s => `<li>${s}</li>`).join('')}</ul>
        <h4 style="margin-top:1rem;">SonarQube vs AI Comparison:</h4>
        <pre class="telemetry-box">${JSON.stringify(data.sonar_vs_ai_comparison, null, 2)}</pre>
      `;
    } else if (ucNumber === 5) {
      dom.useCaseModalTitle.textContent = 'USE CASE 5: AI-Generated Testing & Edge Case Simulation';
      dom.useCaseModalContent.innerHTML = `
        <h4>Out-of-Stock Simulation Status: <span style="color:#10b981">${data.final_status}</span></h4>
        <p>Scenario: ${data.scenario_description}</p>
        <pre class="telemetry-box">${JSON.stringify(data.steps, null, 2)}</pre>
        <button class="pill-btn" onclick="openUseCaseViewer(5)" style="margin-top:1rem;">Re-run Simulation</button>
      `;
    }
  } catch (err) {
    dom.useCaseModalContent.innerHTML = `<p style="color:#ef4444">Failed to load Use Case data: ${err.message}</p>`;
  }
}

function closeUseCaseModal() {
  dom.useCaseModal.classList.remove('open');
}

// -----------------------------------------------------------------------------
// EVENT LISTENERS
// -----------------------------------------------------------------------------
function setupEventListeners() {
  document.getElementById('btn-open-cart').addEventListener('click', openCart);
  document.getElementById('btn-close-cart').addEventListener('click', closeCart);
  dom.cartOverlay.addEventListener('click', closeCart);
  document.getElementById('btn-apply-coupon').addEventListener('click', applyCoupon);
  document.getElementById('btn-checkout-drawer').addEventListener('click', openCheckoutModal);
  document.getElementById('btn-close-checkout').addEventListener('click', closeCheckoutModal);
  document.getElementById('checkout-form').addEventListener('submit', submitOrder);
  document.getElementById('btn-close-use-case').addEventListener('click', closeUseCaseModal);

  // Category filter tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      AppState.selectedCategory = e.target.getAttribute('data-category');
      loadProducts();
    });
  });

  // Search input debounce
  let searchTimeout;
  dom.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      AppState.searchQuery = e.target.value.trim();
      loadProducts();
    }, 250);
  });
}
