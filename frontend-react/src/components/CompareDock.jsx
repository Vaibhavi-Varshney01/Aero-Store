import React from 'react';

export function CompareDock({
  comparedProducts = [],
  onRemoveProduct,
  onClearAll,
  onOpenCompareModal
}) {
  if (!comparedProducts || comparedProducts.length === 0) {
    return null;
  }

  const latestProduct = comparedProducts[comparedProducts.length - 1];

  return (
    <aside
      className="compare-dock-container"
      aria-label="Multi-Brand Item Comparison Dock"
      role="region"
    >
      <div className="compare-dock-inner">
        <div className="compare-dock-header">
          <div className="compare-dock-title">
            <span className="compare-dock-icon">⚖️</span>
            <div>
              <strong className="compare-dock-heading">Brand Comparison Active</strong>
              <span className="compare-dock-sub">
                Compare brands for: <strong>{latestProduct?.name?.split(' ')[0] || 'Selected Item'}</strong>
              </span>
            </div>
          </div>
          <button
            className="compare-dock-clear-btn"
            onClick={onClearAll}
            title="Clear compared items"
          >
            Clear
          </button>
        </div>

        <div className="compare-dock-items">
          {comparedProducts.map((product) => (
            <div key={product.id} className="compare-dock-chip">
              <img
                src={product.image_url ? (product.image_url.startsWith('http') ? product.image_url : product.image_url.replace('/static/assets/', '/assets/')) : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80'}
                alt={product.name}
                className="compare-chip-thumb"
              />
              <div className="compare-chip-info">
                <span className="compare-chip-name">{product.name}</span>
                <span className="compare-chip-price">₹{product.price.toFixed(2)}</span>
              </div>
              <button
                className="compare-chip-remove"
                onClick={() => onRemoveProduct(product.id)}
                aria-label={`Remove ${product.name} from comparison`}
                title="Remove"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <div className="compare-dock-action">
          <button
            className="btn-compare-launch"
            onClick={onOpenCompareModal}
            title="Open side-by-side brand lineup shootout matrix"
          >
            <span>Compare Brand Lineups</span>
            <span className="compare-arrow">→</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
