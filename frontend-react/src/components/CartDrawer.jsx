import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProductImage } from '../utils/productImages';
import { getProductVipPerks } from '../utils/vipPerks';

export function CartDrawer({ onProceedToCheckout }) {
  const { cart, isCartOpen, closeCart, updateQuantity, applyCoupon, loading } = useCart();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');

  // Handle ESC key to close cart
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim());
      setCouponCode('');
    }
  };

  const handleCheckoutClick = () => {
    if (!cart.items || cart.items.length === 0) return;
    closeCart();
    onProceedToCheckout();
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        id="cart-overlay"
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`}
        aria-hidden={!isCartOpen}
        onClick={closeCart}
      />

      {/* Sliding Drawer */}
      <aside
        id="cart-drawer"
        className={`cart-drawer ${isCartOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Drawer"
        aria-hidden={!isCartOpen}
      >
        <div className="cart-drawer-header">
          <h2>Your Shopping Cart</h2>
          <button
            id="btn-close-cart"
            className="btn-close-icon"
            onClick={closeCart}
            aria-label="Close cart drawer"
          >
            &times;
          </button>
        </div>

        {/* Items List */}
        <div id="cart-items-list" className="cart-items-list" role="region" aria-label="Cart items list">
          {(!cart.items || cart.items.length === 0) ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '4rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛒</div>
              <p style={{ fontWeight: 600 }}>Your cart is currently empty</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Add some high-tech items to get started!</p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.product_id} className="cart-item-row" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={getProductImage(item)}
                  alt={item.name}
                  style={{ width: '46px', height: '46px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=120&q=80';
                  }}
                />
                <div className="cart-item-info" style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹{item.unit_price.toFixed(2)} each</p>
                  {user?.is_vip && (() => {
                    const perk = getProductVipPerks({ id: item.product_id, name: item.name, price: item.unit_price });
                    return perk ? (
                      <div style={{
                        marginTop: '0.25rem',
                        fontSize: '0.72rem',
                        color: '#6ee7b7',
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        <span>{perk.giftIcon} Included Free: <strong>{perk.giftName}</strong></span>
                      </div>
                    ) : null;
                  })()}
                </div>
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    aria-label={`Decrease quantity for ${item.name}`}
                    disabled={loading}
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="qty-count">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    aria-label={`Increase quantity for ${item.name}`}
                    disabled={loading || item.quantity >= 99}
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Pricing Summary */}
        <div className="cart-drawer-footer">
          <form onSubmit={handleApplyCoupon} className="coupon-box">
            <input
              type="text"
              id="coupon-input"
              className="coupon-input"
              placeholder="Promo code (e.g. SAVE20)"
              aria-label="Promotional coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              type="submit"
              id="btn-apply-coupon"
              className="btn-apply-coupon"
              aria-label="Apply coupon code"
              disabled={loading || !couponCode.trim()}
            >
              Apply
            </button>
          </form>

          <div className="cart-summary-line">
            <span>Subtotal:</span>
            <span id="cart-subtotal">₹{(cart.subtotal || 0).toFixed(2)}</span>
          </div>

          <div className="cart-summary-line" style={{ color: '#34d399' }}>
            <span>Discount:</span>
            <span id="cart-discount">-₹{(cart.discount_amount || 0).toFixed(2)}</span>
          </div>

          <div className="cart-summary-line">
            <span>Est. Sales Tax (8%):</span>
            <span id="cart-tax">₹{(cart.tax_amount || 0).toFixed(2)}</span>
          </div>

          <div className="cart-summary-line total">
            <span>Total:</span>
            <span id="cart-total">₹{(cart.total_amount || 0).toFixed(2)}</span>
          </div>

          {user?.role === 'admin' ? (
            <div className="drawer-admin-notice">
              <span>🛡️ Admin Mode: Direct checkout disabled. Switch to a Customer account to buy items.</span>
            </div>
          ) : (
            <button
              id="btn-checkout-drawer"
              className="btn-checkout"
              onClick={handleCheckoutClick}
              disabled={!cart.items || cart.items.length === 0}
              aria-label="Proceed to Checkout"
            >
              Proceed to Checkout
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
