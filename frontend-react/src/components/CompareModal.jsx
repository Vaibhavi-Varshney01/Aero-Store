import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  ITEM_CATEGORIES_FOR_COMPARISON,
  BRAND_COMPARISONS,
  SAME_BRAND_LINEUPS
} from '../data/brandComparisons';

const PERSONAS = [
  { id: 'general', label: 'Balanced Value', icon: '⚖️' },
  { id: 'audiophile', label: 'Audiophile & Sound', icon: '🎧' },
  { id: 'commuter', label: 'Commuter & Travel', icon: '✈️' },
  { id: 'student_budget', label: 'Student & Budget', icon: '🎓' },
  { id: 'gamer', label: 'Gamer & Esports', icon: '⚡' }
];

export function CompareModal({
  isOpen,
  selectedItemId = 'PROD-101',
  comparedProductIds = [],
  onClose,
  onSelectItem
}) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [activeItemId, setActiveItemId] = useState('PROD-101');
  const [selectedPersona, setSelectedPersona] = useState('general');
  const [comparisonScope, setComparisonScope] = useState('same_brand'); // 'same_brand' (default requested) | 'multi_brand'
  const [addingId, setAddingId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Synchronize initial item ID when modal opens or prop changes
  useEffect(() => {
    if (selectedItemId && (BRAND_COMPARISONS[selectedItemId] || SAME_BRAND_LINEUPS[selectedItemId])) {
      setActiveItemId(selectedItemId);
    } else if (comparedProductIds.length > 0) {
      const match = comparedProductIds.find((id) => BRAND_COMPARISONS[id] || SAME_BRAND_LINEUPS[id]);
      if (match) setActiveItemId(match);
    }
  }, [selectedItemId, comparedProductIds, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activeSameBrand = useMemo(() => {
    return SAME_BRAND_LINEUPS[activeItemId] || SAME_BRAND_LINEUPS['PROD-101'];
  }, [activeItemId]);

  const activeMultiBrand = useMemo(() => {
    return BRAND_COMPARISONS[activeItemId] || BRAND_COMPARISONS['PROD-101'];
  }, [activeItemId]);

  const currentVerdict = useMemo(() => {
    if (comparisonScope === 'same_brand') {
      if (!activeSameBrand || !activeSameBrand.ai_verdict) return null;
      return {
        winner_name: activeSameBrand.ai_verdict.winner_name,
        winner_id: activeSameBrand.ai_verdict.winner_id,
        summary: activeSameBrand.ai_verdict.summary,
        persona_fit: `Optimal pick tailored for everyday reliability and top price-to-performance within ${activeSameBrand.brand}.`,
        recommendation: activeSameBrand.ai_verdict.recommendation,
        value_score: { [activeSameBrand.ai_verdict.winner_id]: 9.9 }
      };
    }
    if (!activeMultiBrand || !activeMultiBrand.ai_verdicts) return null;
    return (
      activeMultiBrand.ai_verdicts[selectedPersona] ||
      activeMultiBrand.ai_verdicts['general']
    );
  }, [comparisonScope, activeSameBrand, activeMultiBrand, selectedPersona]);

  const isSameBrandMode = comparisonScope === 'same_brand' && !!activeSameBrand;
  const displayItems = isSameBrandMode ? activeSameBrand.models : (activeMultiBrand?.brands || []);
  const specKeys = isSameBrandMode ? activeSameBrand.spec_keys : (activeMultiBrand?.spec_keys || []);
  const storeProduct = displayItems.find((b) => b.is_store_product) || displayItems[0];
  const itemTitle = isSameBrandMode ? activeSameBrand.item_type : activeMultiBrand?.item_type;
  const itemBrandName = isSameBrandMode ? activeSameBrand.brand : 'Industry Brands';

  // Automatically default active product to storeProduct or first item if none selected or category changed
  useEffect(() => {
    if (displayItems && displayItems.length > 0) {
      const defaultItem = displayItems.find((b) => b.is_store_product) || displayItems[0];
      setSelectedProductId(defaultItem?.id);
    }
  }, [activeItemId, comparisonScope]);

  if (!isOpen) return null;

  const handleAddToCart = async (productObj) => {
    // If productObj has a specific store_product_id or is store product, add that id, otherwise fallback to activeItemId
    const targetId = productObj?.store_product_id || (productObj?.is_store_product ? activeItemId : activeItemId);
    setAddingId(productObj?.id || targetId);
    await addToCart(targetId);
    setTimeout(() => setAddingId(null), 900);
  };

  const handleSelectTab = (itemId) => {
    setActiveItemId(itemId);
    if (onSelectItem) onSelectItem(itemId);
  };

  const activeSelectedProduct = displayItems.find((b) => b.id === selectedProductId) || storeProduct;

  return (
    <div
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      aria-label="Product Brand Comparison Modal"
    >
      <div className="modal-card compare-modal-card brand-compare-modal-card">
        {/* Header */}
        <div className="modal-header brand-compare-header">
          <div className="modal-title-wrap">
            <span className="brand-compare-header-icon">{activeMultiBrand?.icon || '⚖️'}</span>
            <div>
              <div className="brand-compare-super-badge">
                <span>{isSameBrandMode ? '🏷️ SAME PRODUCT BRAND LINEUP COMPARISON' : '⚖️ MULTI-BRAND SAME-ITEM BENCHMARK'}</span>
              </div>
              <h3 style={{ margin: '0.2rem 0', fontSize: '1.35rem', color: 'var(--text-main)' }}>
                {itemTitle}: {isSameBrandMode ? `${itemBrandName} Models & Tiers` : 'Brand Comparison Matrix'}
              </h3>
              <p className="modal-subtitle" style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                {isSameBrandMode
                  ? `Comparing models, editions & tiers within the same brand: ${itemBrandName}`
                  : `Detailed specification & value shootout comparing ${displayItems.map(b => b.brand).join(', ')}`}
              </p>
            </div>
          </div>
          <button
            className="btn-close-icon"
            onClick={onClose}
            aria-label="Close brand comparison modal"
          >
            &times;
          </button>
        </div>

        {/* Comparison Scope Switcher (Same Brand vs Cross-Brand) */}
        <div className="compare-scope-switcher-bar">
          <div className="scope-tabs-group" role="tablist" aria-label="Comparison Scope">
            <button
              type="button"
              role="tab"
              aria-selected={comparisonScope === 'same_brand'}
              className={`scope-tab-btn ${comparisonScope === 'same_brand' ? 'active' : ''}`}
              onClick={() => setComparisonScope('same_brand')}
            >
              <span className="scope-tab-icon">🏷️</span>
              <span className="scope-tab-label">Compare Same Brand Lineup ({activeSameBrand?.brand || 'AeroStore'})</span>
              <span className="scope-badge">Requested</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={comparisonScope === 'multi_brand'}
              className={`scope-tab-btn ${comparisonScope === 'multi_brand' ? 'active' : ''}`}
              onClick={() => setComparisonScope('multi_brand')}
            >
              <span className="scope-tab-icon">🌐</span>
              <span className="scope-tab-label">Cross-Brand Market Benchmark</span>
            </button>
          </div>
        </div>

        {/* Item Switcher Bar (Same Item Selector) */}
        <div className="compare-item-selector-strip" aria-label="Select item type to compare brands">
          <span className="item-strip-label">Category:</span>
          <div className="item-strip-buttons">
            {ITEM_CATEGORIES_FOR_COMPARISON.map((cat) => {
              const isActive = activeItemId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`item-strip-btn ${isActive ? 'active' : ''}`}
                  style={
                    isActive
                      ? {
                          background: cat.gradient,
                          borderColor: cat.accent_color,
                          color: '#ffffff',
                          boxShadow: `0 0 16px ${cat.glow}`
                        }
                      : {}
                  }
                  onClick={() => handleSelectTab(cat.id)}
                >
                  <span className="item-strip-icon">{cat.icon}</span>
                  <span className="item-strip-text">{cat.item_type}</span>
                  {cat.trendy_badge && (
                    <span
                      className="item-strip-badge"
                      style={
                        isActive
                          ? { background: 'rgba(255, 255, 255, 0.25)', color: '#ffffff' }
                          : { background: 'var(--border-subtle)', color: 'var(--text-muted)' }
                      }
                    >
                      {cat.trendy_badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Persona Filter Bar (active in cross-brand shootout) */}
        {comparisonScope === 'multi_brand' && (
          <div className="compare-persona-bar">
            <span className="compare-persona-label">Tailor AI Verdict For:</span>
            <div className="compare-persona-chips">
              {PERSONAS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`compare-persona-chip ${selectedPersona === p.id ? 'active' : ''}`}
                  onClick={() => setSelectedPersona(p.id)}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="modal-body compare-modal-body">
          {/* AI Verdict Spotlight Card */}
          {currentVerdict && (
            <div className="compare-verdict-card brand-verdict-spotlight">
              <div className="verdict-card-top">
                <div className="verdict-winner-badge">
                  <span>🏆 Recommended Brand:</span>
                  <strong>{currentVerdict.winner_name}</strong>
                  <span className="winner-flagship-pill">Store Flagship</span>
                </div>
                {currentVerdict.value_score && (
                  <div className="verdict-score-pill">
                    Value Score:{' '}
                    {currentVerdict.value_score[currentVerdict.winner_id] || '9.8'} / 10
                  </div>
                )}
              </div>

              <p className="verdict-summary">{currentVerdict.summary}</p>
              <p className="verdict-fit">
                <strong>Persona Fit ({PERSONAS.find((p) => p.id === selectedPersona)?.label}):</strong>{' '}
                {currentVerdict.persona_fit}
              </p>

              <div className="verdict-footer">
                <span className="verdict-rec">
                  💡 <em>{currentVerdict.recommendation}</em>
                </span>
                {user?.role !== 'admin' && user?.role !== 'shipper' && activeSelectedProduct && (
                  <button
                    className="btn-verdict-add-winner"
                    onClick={() => handleAddToCart(activeSelectedProduct)}
                    disabled={addingId === (activeSelectedProduct.id || activeItemId)}
                  >
                    {addingId === (activeSelectedProduct.id || activeItemId)
                      ? '✓ Added to Cart!'
                      : `+ Add ${activeSelectedProduct.brand} (${activeSelectedProduct.model || activeSelectedProduct.name}) to Cart`}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Pros & Cons Grid for Each Model / Brand */}
          <div className="brand-comparison-cards-section">
            <div className="brand-section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h4 className="brand-section-heading" style={{ margin: 0 }}>
                <span>🔍 {isSameBrandMode ? `${itemBrandName} Model Highlights & Features` : 'Brand Highlights & Trade-offs'}</span>
              </h4>
              <span className="compare-interactive-hint" style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
                👆 Click any product card to select it &amp; enable &quot;Add to Cart&quot;
              </span>
            </div>
            <div className="compare-pros-cons-grid brand-pros-cons-grid">
              {displayItems.map((b) => {
                const isSelected = selectedProductId === b.id;
                return (
                  <div
                    key={b.id}
                    className={`pros-cons-card brand-card ${b.is_store_product ? 'brand-card-flagship' : ''} ${isSelected ? 'selected-compare-card' : ''}`}
                    onClick={() => setSelectedProductId(b.id)}
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #10b981' : undefined,
                      boxShadow: isSelected ? '0 0 16px rgba(16, 185, 129, 0.35)' : undefined,
                      transform: isSelected ? 'scale(1.02)' : undefined,
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <div className="brand-card-header">
                      <div className="brand-badge-row">
                        <span className={`brand-pill ${b.is_store_product ? 'brand-pill-flagship' : 'brand-pill-competitor'}`}>
                          {b.brand}
                        </span>
                        {isSelected ? (
                          <span className="brand-flagship-tag" style={{ color: '#10b981', fontWeight: '800' }}>
                            ✓ Selected for Purchase
                          </span>
                        ) : b.is_store_product ? (
                          <span className="brand-flagship-tag">Store Flagship</span>
                        ) : b.badge ? (
                          <span className="brand-flagship-tag" style={{ color: 'var(--accent-primary)' }}>{b.badge}</span>
                        ) : null}
                      </div>
                      <strong className="brand-card-model">{b.name}</strong>
                      <div className="brand-card-pricing">
                        <span className="brand-price">₹{b.price.toFixed(2)}</span>
                        <span className="brand-score">
                          Score:{' '}
                          {currentVerdict?.value_score?.[b.id]
                            ? `${currentVerdict.value_score[b.id]}/10`
                            : `${b.rating}★`}
                        </span>
                      </div>
                    </div>

                    <div className="brand-card-body">
                      <ul className="pc-list pros-list">
                        {b.pros?.map((pro, idx) => (
                          <li key={idx}>✅ {pro}</li>
                        ))}
                      </ul>
                      {b.cons && b.cons.length > 0 && (
                        <ul className="pc-list cons-list">
                          {b.cons.map((con, idx) => (
                            <li key={idx}>⚠️ {con}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {user?.role !== 'admin' && user?.role !== 'shipper' && (
                      isSelected ? (
                        <button
                          className="btn-card-direct-add"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(b);
                          }}
                          disabled={addingId === (b.id || activeItemId)}
                        >
                          {addingId === (b.id || activeItemId) ? '✓ Added' : '+ Add to Cart'}
                        </button>
                      ) : (
                        <button
                          className="btn-card-select-trigger"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProductId(b.id);
                          }}
                          style={{
                            width: '100%',
                            padding: '0.55rem',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-muted)',
                            border: '1px dashed var(--border-subtle)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Select this Product
                        </button>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Side-by-Side Brand / Model Specification Matrix */}
          <div className="brand-matrix-section">
            <h4 className="brand-section-heading">
              <span>📊 Technical Specification Matrix: {itemTitle}</span>
            </h4>
            <div className="compare-table-wrapper brand-table-wrapper">
              <table className="compare-table brand-compare-table" aria-label={`Specification comparison for ${itemTitle}`}>
                <thead>
                  <tr>
                    <th className="th-spec-name">Specification / Feature</th>
                    {displayItems.map((b) => {
                      const isSelected = selectedProductId === b.id;
                      return (
                        <th
                          key={b.id}
                          className={`th-product-col ${b.is_store_product ? 'th-flagship-col' : ''} ${isSelected ? 'th-selected-col' : ''}`}
                          onClick={() => setSelectedProductId(b.id)}
                          style={{
                            cursor: 'pointer',
                            backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.08)' : undefined,
                            borderTop: isSelected ? '3px solid #10b981' : undefined
                          }}
                        >
                          <div className="th-product-header">
                            <div className="th-brand-tag-wrap">
                              <span className={`brand-col-badge ${isSelected ? 'selected' : b.is_store_product ? 'flagship' : 'competitor'}`}
                                style={isSelected ? { background: '#10b981', color: '#ffffff' } : {}}
                              >
                                {b.brand}
                              </span>
                              {isSelected ? (
                                <span className="star-flagship-badge" style={{ color: '#10b981', fontWeight: '800' }}>
                                  ✓ Selected
                                </span>
                              ) : b.is_store_product ? (
                                <span className="star-flagship-badge">⭐ Store Pick</span>
                              ) : (
                                <span className="star-flagship-badge" style={{ color: 'var(--text-muted)' }}>
                                  {isSameBrandMode ? b.model?.split(' ')[0] : 'Market'}
                                </span>
                              )}
                            </div>
                            <div className="th-name" style={{ fontSize: '0.92rem' }}>{b.name}</div>
                            <div className="th-price">
                              ₹{b.price.toFixed(2)}
                            </div>
                            <div className="th-rating">⭐ {b.rating} / 5.0</div>

                            {user?.role !== 'admin' && user?.role !== 'shipper' && (
                              isSelected ? (
                                <button
                                  className="btn-table-add-cart"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(b);
                                  }}
                                  disabled={addingId === (b.id || activeItemId)}
                                  style={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    fontWeight: '700'
                                  }}
                                >
                                  {addingId === (b.id || activeItemId) ? '✓ Added' : '+ Add to Cart'}
                                </button>
                              ) : (
                                <button
                                  className="competitor-external-notice btn-select-col"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProductId(b.id);
                                  }}
                                  style={{
                                    cursor: 'pointer',
                                    border: '1px dashed var(--border-subtle)',
                                    background: 'transparent',
                                    width: '100%',
                                    padding: '0.4rem 0.5rem',
                                    color: 'var(--text-muted)'
                                  }}
                                >
                                  <span>Select to Buy</span>
                                </button>
                              )
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {specKeys.map((specKey) => (
                    <tr key={specKey}>
                      <td className="td-spec-key">{specKey}</td>
                      {displayItems.map((b) => {
                        const val = b.specs ? b.specs[specKey] : null;
                        const isFlagship = b.is_store_product;
                        const isSelected = selectedProductId === b.id;
                        return (
                          <td
                            key={b.id}
                            className={`td-spec-val ${isFlagship ? 'td-flagship-val' : ''} ${isSelected ? 'td-selected-val' : ''}`}
                            style={isSelected ? { backgroundColor: 'rgba(16, 185, 129, 0.04)', fontWeight: '600' } : {}}
                          >
                            {val ? (
                              <span style={{ fontWeight: isSelected || isFlagship ? '600' : 'normal' }}>
                                {val}
                              </span>
                            ) : (
                              <span style={{ opacity: 0.5 }}>—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer brand-compare-footer">
          <div className="footer-legend">
            {isSameBrandMode ? (
              <>
                <span className="legend-item">
                  <span className="legend-dot flagship"></span> <strong>Store Flagship:</strong> Official in-stock edition available for immediate checkout
                </span>
                <span className="legend-item">
                  <span className="legend-dot competitor"></span> <strong>{itemBrandName} Lineup:</strong> Full brand family comparison across tiers and use-cases
                </span>
              </>
            ) : (
              <>
                <span className="legend-item">
                  <span className="legend-dot flagship"></span> <strong>AeroStore Flagship:</strong> Direct manufacturer pricing with 2-year warranty &amp; express 2-day delivery
                </span>
                <span className="legend-item">
                  <span className="legend-dot competitor"></span> <strong>Competitor Brands:</strong> Industry benchmarks for spec comparison
                </span>
              </>
            )}
          </div>
          <button className="btn-hero-secondary" onClick={onClose}>
            Done &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
