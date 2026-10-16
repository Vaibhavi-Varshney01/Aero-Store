import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProductVipPerks } from '../utils/vipPerks';

export function ProductDetailModal({ product, isOpen, onClose }) {
  const { addToCart, loading } = useCart();
  const { user, openAuthModal } = useAuth();
  const [adding, setAdding] = useState(false);
  const vipPerk = product ? getProductVipPerks(product) : null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const imageUrl = product.image_url
    ? (product.image_url.startsWith('http') ? product.image_url : product.image_url.replace('/static/assets/', '/assets/'))
    : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product.id);
    setAdding(false);
  };

  return (
    <div
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} Details`}
    >
      <div className="modal-card product-detail-modal-card">
        <button
          className="btn-close-icon modal-close-btn"
          onClick={onClose}
          aria-label="Close product view"
        >
          &times;
        </button>

        <div className="product-detail-layout">
          {/* Product Gallery View */}
          <div className="product-detail-gallery">
            <div className="product-detail-image-box">
              <img
                src={imageUrl}
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
            <div className="product-detail-badges">
              {product.stock === 0 ? (
                <span className="badge-pill out-of-stock">🔴 Out of Stock</span>
              ) : product.stock <= 2 ? (
                <span className="badge-pill low-stock">⚠️ Low Stock • Only {product.stock} left</span>
              ) : (
                <span className="badge-pill in-stock">🟢 Available • Ready to Ship</span>
              )}
              <span className="badge-pill warranty">🛡️ 2-Year Warranty Included</span>
            </div>
          </div>

          {/* Product Info & Actions */}
          <div className="product-detail-content">
            <span className="product-category-tag">{product.category}</span>
            <h2 className="product-detail-title">{product.name}</h2>
            
            <div className="product-rating-row">
              <span className="stars">⭐⭐⭐⭐⭐</span>
              <span className="rating-score">{product.rating || '4.8'}</span>
              <span className="rating-count">(128 verified ratings)</span>
            </div>

            <div className="product-detail-price-row" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '0.45rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                {user?.is_vip && vipPerk ? (
                  <>
                    <span className="product-detail-price" style={{ color: '#34d399', fontWeight: 800 }}>
                      ₹{vipPerk.vipPrice.toFixed(2)}
                    </span>
                    <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '1.1rem' }}>
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      border: '1px solid #10b981',
                      borderRadius: '6px',
                      padding: '0.2rem 0.55rem',
                      fontWeight: 800,
                      fontSize: '0.8rem'
                    }}>
                      VIP {vipPerk.discountPercent}% OFF (Save ₹{vipPerk.savings.toFixed(2)})
                    </span>
                  </>
                ) : (
                  <>
                    <span className="product-detail-price">₹{product.price.toFixed(2)}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Regular Price</span>
                  </>
                )}
                {product.stock > 0 ? (
                  <span className="product-detail-shipping">🚚 Free 2-Day Delivery</span>
                ) : (
                  <span className="product-detail-shipping out-of-stock-note">⚠️ Temporarily Sold Out</span>
                )}
              </div>

              {/* VIP Perks Free Related Item Showcase */}
              {vipPerk && (
                <div style={{
                  width: '100%',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.12), rgba(16, 185, 129, 0.12))',
                  border: '1.5px solid rgba(234, 179, 8, 0.4)',
                  marginTop: '0.35rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{vipPerk.giftIcon}</span>
                    <strong style={{ color: '#fef08a', fontSize: '0.86rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      VIP Member Perks &amp; Free Gift Included:
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.83rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                    VIP Subscribers get <strong>{vipPerk.discountPercent}% Instant Savings</strong> plus complimentary <strong style={{ color: '#6ee7b7' }}>{vipPerk.giftName}</strong> (₹{vipPerk.giftValue.toFixed(2)} value, ₹0 free gift with this order)!
                  </div>
                </div>
              )}
            </div>

            <p className="product-detail-description">
              {product.description}
            </p>

            {/* Spec Highlights */}
            <div className="product-spec-highlights">
              <div className="spec-item">
                <span className="spec-label">Item SKU</span>
                <span className="spec-val">{product.id}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Availability Status</span>
                <span className={`spec-val ${product.stock === 0 ? 'text-out-of-stock' : product.stock <= 2 ? 'text-low-stock' : 'text-in-stock'}`}>
                  {product.stock === 0
                    ? '🔴 Out of Stock'
                    : product.stock <= 2
                    ? `⚠️ Low Stock (${product.stock} left)`
                    : `🟢 Available (${product.stock} in stock)`
                  }
                </span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Return Window</span>
                <span className="spec-val">30 Days (Full Refund)</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Authenticity</span>
                <span className="spec-val">100% Genuine Certified</span>
              </div>
            </div>

            <div className="product-detail-actions">
              {user?.role === 'admin' ? (
                <div className="admin-buying-restriction-box">
                  <div className="restriction-header-row">
                    <span className="restriction-pill">🛡️ ADMINISTRATIVE RESTRICTION</span>
                  </div>
                  <h4 className="restriction-heading">Direct Purchasing Disabled on Admin Account</h4>
                  <p className="restriction-message">
                    To maintain strict financial compliance and audit separation, Administrator credentials cannot place retail orders.
                    If you would like to purchase items for personal use or corporate procurement, please switch to or register a <strong>Customer / Business Account</strong>.
                  </p>
                  <button
                    type="button"
                    className="btn-switch-customer-cta"
                    onClick={() => {
                      onClose();
                      openAuthModal('login');
                    }}
                  >
                    👤 Switch / Sign in as Customer Account
                  </button>
                </div>
              ) : user?.role === 'shipper' ? (
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(234, 88, 12, 0.1)', border: '1px solid rgba(234, 88, 12, 0.3)', borderRadius: '8px', textAlign: 'center', color: '#fed7aa' }}>
                  <span>📦 <strong>Warehouse Shipper Mode:</strong> Current available inventory is <strong>{product.stock}</strong> units.</span>
                </div>
              ) : user?.role === 'delivery_partner' || user?.role === 'delivery' ? (
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '8px', textAlign: 'center', color: '#c7d2fe' }}>
                  <span>🚚 <strong>Delivery Partner Mode:</strong> Retail purchasing is reserved for customer accounts.</span>
                </div>
              ) : (
                <button
                  className={`btn-checkout ${product.stock === 0 ? 'btn-disabled-sold-out' : ''}`}
                  style={{ margin: 0 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || adding || loading}
                >
                  {product.stock === 0 ? '❌ Out of Stock' : adding ? 'Adding to Cart...' : 'Add to Shopping Cart 🛍️'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
