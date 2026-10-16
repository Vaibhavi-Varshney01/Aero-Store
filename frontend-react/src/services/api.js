/**
 * AeroStore REST API Client
 * Contract-first API connector with RFC 7807 problem details parsing and Bearer Token Auth.
 */

const API_BASE = '/api/v1';

function getAuthHeaders() {
  const token = localStorage.getItem('aerostore_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json') || contentType.includes('problem+json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const error = new Error(data.detail || data.title || `HTTP Error ${res.status}`);
    error.status = res.status;
    error.problem = data;
    throw error;
  }
  return data;
}

export const api = {
  // Authentication & Customer Accounts
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async register(name, email, password, role = 'customer') {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    return handleResponse(res);
  },


  async getProfile() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async upgradeToVip() {
    const res = await fetch(`${API_BASE}/auth/upgrade-vip`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getProfileHistory() {
    const res = await fetch(`${API_BASE}/auth/profile-history`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateOrderStatus(orderId, status) {
    const res = await fetch(`${API_BASE}/auth/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  async createSampleOrder() {
    const res = await fetch(`${API_BASE}/auth/sample-order`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },


  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch (e) {
      // Ignore network errors on logout
    }
  },

  // Product Catalog
  async getProducts(category = 'All', search = '') {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search && search.trim()) params.append('search', search.trim());

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/products${query}`);
    return handleResponse(res);
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return handleResponse(res);
  },

  async compareProducts(productIds, persona = 'general') {
    const res = await fetch(`${API_BASE}/products/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_ids: productIds,
        persona: persona
      })
    });
    return handleResponse(res);
  },

  async updateStock(productId, stock) {
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(productId)}/stock?stock=${stock}`, {
      method: 'PATCH'
    });
    return handleResponse(res);
  },

  // Shopping Cart & OCC Versioning
  async getCart(cartId = 'default_cart') {
    const res = await fetch(`${API_BASE}/cart?cart_id=${encodeURIComponent(cartId)}`);
    return handleResponse(res);
  },

  async addItemToCart(productId, quantity = 1, expectedVersion = 1, cartId = 'default_cart') {
    const res = await fetch(`${API_BASE}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart_id: cartId,
        product_id: productId,
        quantity,
        expected_version: expectedVersion
      })
    });
    return handleResponse(res);
  },

  async updateCartItem(productId, quantity, expectedVersion, cartId = 'default_cart') {
    const res = await fetch(`${API_BASE}/cart/items/${encodeURIComponent(productId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart_id: cartId,
        quantity,
        expected_version: expectedVersion
      })
    });
    return handleResponse(res);
  },

  async removeItemFromCart(productId, expectedVersion, cartId = 'default_cart') {
    const params = new URLSearchParams({ cart_id: cartId });
    if (expectedVersion !== undefined && expectedVersion !== null) {
      params.append('expected_version', expectedVersion);
    }
    const res = await fetch(`${API_BASE}/cart/items/${encodeURIComponent(productId)}?${params.toString()}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  async applyCoupon(couponCode, cartId = 'default_cart') {
    const res = await fetch(`${API_BASE}/cart/coupon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart_id: cartId,
        coupon_code: couponCode
      })
    });
    return handleResponse(res);
  },

  async removeCoupon(cartId = 'default_cart') {
    const res = await fetch(`${API_BASE}/cart/coupon?cart_id=${encodeURIComponent(cartId)}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // Checkout & Payment Saga
  async submitCheckout(checkoutData) {
    const res = await fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(checkoutData)
    });
    return handleResponse(res);
  },

  // AI Assistant Chatbot
  async sendChatMessage(message, history = []) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history
      })
    });
    return handleResponse(res);
  },

  // Use Cases 1 - 5 Engine Telemetry
  async getUseCaseData(ucNumber, scenario = 'out_of_stock') {
    let endpoint = '';
    if (ucNumber === 1) endpoint = `${API_BASE}/usecases/uc1/architecture`;
    else if (ucNumber === 2) endpoint = `${API_BASE}/usecases/uc2/openapi`;
    else if (ucNumber === 3) endpoint = `${API_BASE}/usecases/uc3/frontend-audit`;
    else if (ucNumber === 4) endpoint = `${API_BASE}/usecases/uc4/code-review`;
    else if (ucNumber === 5) endpoint = `${API_BASE}/usecases/uc5/simulate/${scenario}`;

    const res = await fetch(endpoint);
    return handleResponse(res);
  }
};
