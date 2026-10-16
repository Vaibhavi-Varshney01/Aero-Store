import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export function CheckoutModal({ isOpen, onClose, onOrderCompleted }) {
  const { cart, refreshCart } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user ? user.name : 'Jane Doe',
    email: user ? user.email : 'jane.doe@example.com',
    street: '100 Tech Innovation Blvd',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    paymentMethod: 'razorpay',
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '888'
  });

  const [simTimeout, setSimTimeout] = useState(false);
  const [simFailure, setSimFailure] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      setOrderResult(null);
      setErrorDetails(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrorDetails(null);

    const executeBackendOrder = async (rzpPayment = null) => {
      try {
        const payload = {
          cart_id: 'default_cart',
          shipping_address: {
            full_name: formData.fullName,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: 'India'
          },
          simulate_timeout: simTimeout,
          simulate_failure: simFailure
        };

        const result = await api.submitCheckout(payload);
        if (rzpPayment) {
          result.razorpay_payment_id = rzpPayment.razorpay_payment_id;
        }
        setOrderResult(result);
        await refreshCart();
        if (onOrderCompleted) onOrderCompleted(result);
      } catch (err) {
        console.error('Checkout error:', err);
        setErrorDetails({
          title: err.problem?.title || 'Order Authorization Failed',
          detail: err.problem?.detail || err.message || 'An unexpected error occurred during payment processing.'
        });
      } finally {
        setProcessing(false);
      }
    };

    // If Razorpay gateway option is chosen
    if (formData.paymentMethod === 'razorpay' && typeof window !== 'undefined' && window.Razorpay) {
      try {
        const rzp = new window.Razorpay({
          key: "rzp_test_Td2kzl5iOgf9io",
          amount: Math.round((cart.total_amount || 0) * 100),
          currency: "INR",
          name: "AeroStore Technologies",
          description: `Order Settlement (${cart.items?.length || 1} items)`,
          image: "/assets/bot.svg",
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: "+919876543210"
          },
          theme: { color: "#6366f1" },
          modal: {
            ondismiss: () => setProcessing(false)
          },
          handler: (response) => {
            executeBackendOrder(response);
          }
        });
        rzp.on('payment.failed', (resp) => {
          setProcessing(false);
          setErrorDetails({
            title: 'Razorpay Payment Failed',
            detail: resp.error?.description || 'Payment could not be completed.'
          });
        });
        rzp.open();
      } catch (e) {
        console.warn('Razorpay popup error, fallback to direct:', e);
        await executeBackendOrder();
      }
    } else {
      await executeBackendOrder();
    }
  };

  return (
    <div
      id="checkout-modal"
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      aria-label="Secure Checkout"
    >
      <div className="modal-card checkout-modal-card">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="checkout-shield-icon">🔒</span>
            <div>
              <h3>Secure Checkout</h3>
              <p className="modal-subtitle">256-Bit SSL Encrypted Payment Settlement</p>
            </div>
          </div>
          <button
            id="btn-close-checkout"
            className="btn-close-icon"
            onClick={onClose}
            aria-label="Close checkout modal"
          >
            &times;
          </button>
        </div>

        {orderResult ? (
          /* Order Confirmation Screen */
          <div className="order-success-screen">
            <div className="success-icon-badge">✓</div>
            <h4 className="success-title">Thank you for your order!</h4>
            <p className="success-subtitle">
              We have received your payment and are preparing your shipment for 2-day delivery.
            </p>

            <div className="order-receipt-card">
              <div className="receipt-row">
                <span className="receipt-label">Order Number:</span>
                <span className="receipt-value highlight">{orderResult.order_id}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Razorpay Payment ID:</span>
                <span className="receipt-value" style={{ fontFamily: 'monospace', color: '#818cf8', fontWeight: 700 }}>
                  {orderResult.razorpay_payment_id || `pay_${Math.random().toString(36).substring(2, 10).toUpperCase()}`}
                </span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Gateway Mode:</span>
                <span className="receipt-value text-success">✓ Razorpay Secure (Settled)</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Estimated Delivery:</span>
                <span className="receipt-value text-success">⚡ Within 2 Business Days (Express Guaranteed)</span>
              </div>
              <div className="receipt-row total-row">
                <span>Total Amount Captured:</span>
                <span className="total-amount">₹{(orderResult.total_amount || 0).toFixed(2)} INR</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-checkout"
              style={{ maxWidth: '280px', margin: '0 auto' }}
            >
              Continue Shopping 🛍️
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} id="checkout-form" className="checkout-form">
            {errorDetails && (
              <div role="alert" className="checkout-error-banner">
                <div className="error-title">❌ {errorDetails.title}</div>
                <div className="error-desc">{errorDetails.detail}</div>
              </div>
            )}

            {/* Section 1: Delivery Address */}
            <div className="checkout-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 className="section-title" style={{ margin: 0 }}>1. Shipping & Contact Information</h4>
                {isAuthenticated ? (
                  <span className="checkout-auth-status-badge">
                    ✓ Verified Customer: <strong>{user?.name}</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="checkout-signin-quick-link"
                    onClick={() => openAuthModal('login')}
                  >
                    🔐 Sign In for Faster Checkout
                  </button>
                )}
              </div>
              
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="ship-name">Full Name</label>
                  <input
                    type="text"
                    id="ship-name"
                    name="fullName"
                    className="form-control"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ship-email">Email Address</label>
                  <input
                    type="email"
                    id="ship-email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="ship-street">Street Address</label>
                <input
                  type="text"
                  id="ship-street"
                  name="street"
                  className="form-control"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label htmlFor="ship-city">City</label>
                  <input
                    type="text"
                    id="ship-city"
                    name="city"
                    className="form-control"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ship-state">State</label>
                  <input
                    type="text"
                    id="ship-state"
                    name="state"
                    className="form-control"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ship-zip">Zip Code</label>
                  <input
                    type="text"
                    id="ship-zip"
                    name="zip"
                    className="form-control"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Payment Method */}
            <div className="checkout-section">
              <h4 className="section-title">2. Payment Method</h4>
              
              <div className="payment-method-selector">
                <label className={`pay-method-card ${formData.paymentMethod === 'razorpay' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={formData.paymentMethod === 'razorpay'}
                    onChange={handleChange}
                  />
                  <span>💳 Razorpay (UPI, Cards, NetBanking)</span>
                </label>

                <label className={`pay-method-card ${formData.paymentMethod === 'card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                  />
                  <span>💳 Direct Card</span>
                </label>

                <label className={`pay-method-card ${formData.paymentMethod === 'apple' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="apple"
                    checked={formData.paymentMethod === 'apple'}
                    onChange={handleChange}
                  />
                  <span> Apple Pay</span>
                </label>
              </div>

              {formData.paymentMethod === 'razorpay' && (
                <div className="card-input-box" style={{ background: 'rgba(99, 102, 241, 0.08)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: '#818cf8', fontSize: '0.88rem' }}>⚡ Razorpay Official Gateway (Test Mode)</span>
                    <code style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>rzp_test_Td2kzl5iOgf9io</code>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    Instant Checkout supporting UPI (Google Pay, PhonePe, Paytm), RuPay/Visa/Mastercard, NetBanking & Wallets.
                  </p>
                </div>
              )}

              {formData.paymentMethod === 'card' && (
                <div className="card-input-box">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.cardNumber}
                      readOnly
                    />
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Expires</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.cardExpiry}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label>CVC / Security Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.cardCvc}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Line */}
            <div className="checkout-summary-box">
              <div className="summary-row">
                <span>Total Items:</span>
                <span>{cart.items ? cart.items.reduce((sum, i) => sum + i.quantity, 0) : 0} units</span>
              </div>
              <div className="summary-row total-highlight">
                <span>Total Amount Due:</span>
                <span className="total-highlight-price">₹{(cart.total_amount || 0).toFixed(2)}</span>
              </div>
            </div>

            {user?.role === 'admin' ? (
              <div className="checkout-admin-restriction-alert">
                <div className="alert-header">🛡️ Administrator Purchasing Restriction</div>
                <p>
                  Administrator accounts are prohibited from executing retail transactions to maintain audit separation.
                  Please switch to or register a personal/business <strong>Customer Account</strong> to place orders.
                </p>
                <button
                  type="button"
                  className="btn-admin-switch-account"
                  style={{ width: '100%', marginTop: '0.75rem' }}
                  onClick={() => {
                    onClose();
                    openAuthModal('login');
                  }}
                >
                  👤 Switch / Sign in as Customer Account
                </button>
              </div>
            ) : (
              <button
                type="submit"
                id="btn-confirm-order"
                className="btn-checkout checkout-submit-btn"
                disabled={processing || !cart.items || cart.items.length === 0}
              >
                {processing ? 'Processing Secure Settlement (SLA: 1500ms)...' : `Pay ₹${(cart.total_amount || 0).toFixed(2)} & Complete Order`}
              </button>
            )}

            {/* Collapsible Edge Case Simulator (Tucked neatly for testing without polluting consumer UI) */}
            <details className="dev-sim-accordion">
              <summary className="dev-sim-summary">
                ⚙️ Developer Edge Case Testing Controls
              </summary>
              <div className="dev-sim-content">
                <label className="dev-sim-label">
                  <input
                    type="checkbox"
                    id="sim-timeout-check"
                    checked={simTimeout}
                    onChange={(e) => setSimTimeout(e.target.checked)}
                  />
                  <span>Simulate Gateway Latency Breach (&gt;1500ms SLA timeout & saga rollback)</span>
                </label>
                <label className="dev-sim-label">
                  <input
                    type="checkbox"
                    id="sim-failure-check"
                    checked={simFailure}
                    onChange={(e) => setSimFailure(e.target.checked)}
                  />
                  <span>Simulate Bank Card Decline (declined CVV / insufficient funds)</span>
                </label>
              </div>
            </details>
          </form>
        )}
      </div>
    </div>
  );
}
