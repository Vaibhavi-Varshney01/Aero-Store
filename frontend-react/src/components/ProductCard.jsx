import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { getProductVipPerks } from '../utils/vipPerks';

export function ProductCard({
  product,
  onQuickView,
  onToggleCompare,
  isCompared = false,
  onStockUpdated
}) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
  const vipPerk = (user?.is_vip || product.is_vip) ? getProductVipPerks(product) : null;

  const handleAdd = async (e) => {
    e.stopPropagation();
    setAdding(true);
    await addToCart(product.id);
    setAdding(false);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 2;

  let stockClass = 'stock-in';
  let stockText = `🟢 Available (${product.stock} in stock)`;
  let statusBadge = null;

  if (isOutOfStock) {
    stockClass = 'stock-out';
    stockText = '🔴 Out of Stock';
    statusBadge = 'Out of Stock';
  } else if (isLowStock) {
    stockClass = 'stock-low';
    stockText = `⚠️ Low Stock (${product.stock} left)`;
  }

  // Determine marketing badge (prioritize Out of Stock)
  let badgeLabel = statusBadge;
  if (!badgeLabel) {
    if (product.id === 'PROD-101') badgeLabel = 'Bestseller';
    else if (product.id === 'PROD-102') badgeLabel = 'Top Rated';
    else if (product.id === 'PROD-105') badgeLabel = 'Trending';
    else if (product.id === 'PROD-106') badgeLabel = 'Flash Deal';
  }

  const imageUrl = product.image_url
    ? (product.image_url.startsWith('http') ? product.image_url : product.image_url.replace('/static/assets/', '/assets/'))
    : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';

  return (
    <article 
      className={`product-card ${isOutOfStock ? 'card-out-of-stock' : ''}`} 
      aria-labelledby={`title-${product.id}`}
      onClick={() => onQuickView && onQuickView(product)}
      style={{ cursor: 'pointer' }}
    >
      {badgeLabel && (
        <div className={`product-card-badge ${isOutOfStock ? 'badge-sold-out' : ''}`}>
          {badgeLabel}
        </div>
      )}

      <div className="product-img-wrap">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {isOutOfStock && (
          <div className="img-sold-out-banner">
            <span>SOLD OUT</span>
          </div>
        )}
        <button 
          className="btn-quick-view-overlay"
          onClick={(e) => {
            e.stopPropagation();
            if (onQuickView) onQuickView(product);
          }}
          aria-label={`Quick view ${product.name}`}
        >
          👁️ Quick View
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-meta-header">
          <span className="product-category-tag">{product.category}</span>
          <div className="product-stars-compact">
            <span>⭐ {product.rating || '4.8'}</span>
          </div>
        </div>

        <h3 id={`title-${product.id}`} className="product-title">
          {product.name}
        </h3>

        <p className="product-desc">{product.description}</p>

        <div className="product-meta-row">
          <div className="product-price">
            {vipPerk ? (
              <span style={{ color: '#34d399', fontWeight: 800 }}>
                ₹{vipPerk.vipPrice.toFixed(2)}{' '}
                <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.85rem' }}>
                  ₹{product.price.toFixed(2)}
                </span>
              </span>
            ) : (
              `₹${product.price.toFixed(2)}`
            )}
          </div>
          <span className={`stock-badge ${stockClass}`}>{stockText}</span>
        </div>

        {vipPerk && (
          <div style={{
            margin: '0.4rem 0',
            padding: '0.35rem 0.6rem',
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(16, 185, 129, 0.18))',
            border: '1px solid rgba(234, 179, 8, 0.4)',
            borderRadius: '6px',
            fontSize: '0.74rem',
            fontWeight: 600,
            color: '#6ee7b7',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <span>{vipPerk.giftIcon}</span>
            <span><strong style={{ color: '#fef08a' }}>FREE GIFT:</strong> {vipPerk.giftName}</span>
          </div>
        )}

        <div className="product-card-actions">
          {user?.role !== 'admin' && user?.role !== 'shipper' && user?.role !== 'delivery_partner' && user?.role !== 'delivery' && (
            <button
              id={`btn-add-${product.id}`}
              className={`btn-add-cart ${isOutOfStock ? 'btn-disabled-sold-out' : ''}`}
              aria-label={`Add ${product.name} to shopping cart`}
              disabled={isOutOfStock || adding}
              onClick={handleAdd}
            >
              {isOutOfStock ? (
                <span>❌ Out of Stock</span>
              ) : adding ? (
                <span>Adding...</span>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            )
          )}

          {user?.role !== 'admin' && user?.role !== 'shipper' && user?.role !== 'delivery_partner' && user?.role !== 'delivery' && (
            <button
              type="button"
              className={`btn-card-compare-toggle ${isCompared ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleCompare) onToggleCompare(product);
              }}
              title={isCompared ? 'Active in brand comparison' : `Compare brands for ${product.name}`}
              aria-label={`Compare brands for ${product.name}`}
            >
              <span>⚖️ Compare Brands</span>
            </button>
          )}

          {user?.role === 'shipper' && (
            <div className="shipper-stock-manager-bar" onClick={(e) => e.stopPropagation()}>
              <div className="shipper-count-controls">
                <button
                  type="button"
                  className="btn-shipper-stepper"
                  onClick={async () => {
                    await api.updateStock(product.id, Math.max(0, product.stock - 1));
                    if (onStockUpdated) onStockUpdated();
                  }}
                  disabled={product.stock <= 0}
                  title="Decrease stock (-1)"
                >
                  −
                </button>
                <span className="shipper-stock-display">
                  <strong>{product.stock}</strong> in stock
                </span>
                <button
                  type="button"
                  className="btn-shipper-stepper"
                  onClick={async () => {
                    await api.updateStock(product.id, product.stock + 1);
                    if (onStockUpdated) onStockUpdated();
                  }}
                  title="Increase stock (+1)"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="btn-shipper-restock"
                onClick={async () => {
                  await api.updateStock(product.id, product.stock + 10);
                  if (onStockUpdated) onStockUpdated();
                }}
                title="Restock batch (+10)"
              >
                📦 +10 Restock
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
