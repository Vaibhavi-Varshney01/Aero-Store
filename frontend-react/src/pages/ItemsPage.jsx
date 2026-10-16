import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { getProductVipPerks } from '../utils/vipPerks';

export function ItemsPage({
  initialMode = 'catalog',
  products = [],
  loading = false,
  error = null,
  category = 'All',
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
  onSelectProduct,
  onRetry,
  onNavigate,
  onToggleCompare,
  comparedProductIds = []
}) {
  const { isAuthenticated, user, upgradeToVip } = useAuth();
  const { cart, addToCart, applyCoupon } = useCart();
  const [activeTabMode, setActiveTabMode] = useState(initialMode);
  const [upgradingVip, setUpgradingVip] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(null);

  useEffect(() => {
    if (initialMode) {
      setActiveTabMode(initialMode);
    }
  }, [initialMode]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under100' | '100to200' | 'above200'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'priceAsc' | 'priceDesc' | 'rating' | 'name'
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all' | 'available' | 'low_stock' | 'out_of_stock'
  const [inStockOnly, setInStockOnly] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [updatingStockId, setUpdatingStockId] = useState(null);
  const catalogViewRef = useRef(null);

  // Auto-scroll so searched product appears right at the top for the shipper / user
  useEffect(() => {
    if (searchQuery && searchQuery.trim().length > 0) {
      if (catalogViewRef.current) {
        catalogViewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [searchQuery]);

  const handleUpdateStock = async (productId, newStock) => {
    setUpdatingStockId(productId);
    try {
      await api.updateStock(productId, newStock);
      if (onRetry) {
        await onRetry();
      }
    } catch (err) {
      console.error('Failed to update stock:', err);
    } finally {
      setUpdatingStockId(null);
    }
  };

  const categories = [
    { id: 'All', label: 'All Products', icon: '⚡' },
    { id: 'Electronics', label: 'Audio & Acoustics', icon: '🎧' },
    { id: 'Accessories', label: 'Peripherals', icon: '⌨️' },
    { id: 'Wearables', label: 'Smart Wearables', icon: '⌚' },
    { id: 'Apparel', label: 'Streetwear & Apparel', icon: '🧥' },
    { id: 'Fitness', label: 'Fitness & Sports', icon: '👟' },
    { id: 'Home & Living', label: 'Home & Living', icon: '☕' },
    { id: 'Grocery', label: 'Grocery & Pantry', icon: '🥑' },
    { id: 'Cafe & Beverages', label: '⚡ Cafe & Minutes Delivery', icon: '🥤' },
    { id: 'VIP_Exclusive', label: '💎 VIP Exclusive Collection', icon: '👑' }
  ];

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: products.length, VIP_Exclusive: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter & Sort logic - boosts searched products to the very top
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Global Search across all items when user types query
        if (searchQuery && searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description ? p.description.toLowerCase().includes(q) : false;
          const matchCat = p.category ? p.category.toLowerCase().includes(q) : false;
          const matchId = p.id ? p.id.toLowerCase().includes(q) : false;
          if (!matchName && !matchDesc && !matchCat && !matchId) return false;
        } else {
          // Category filter applies only when not actively searching
          if (category === 'VIP_Exclusive') {
            // VIP Exclusive tab includes the entire catalog with special VIP discounts & free items!
          } else if (category !== 'All' && p.category !== category) {
            return false;
          }
        }

        // Price Filter
        if (priceFilter === 'under100' && p.price >= 100) return false;
        if (priceFilter === '100to200' && (p.price < 100 || p.price > 200)) return false;
        if (priceFilter === 'above200' && p.price <= 200) return false;

        // Availability Status Filter
        if (availabilityFilter === 'available' && p.stock <= 0) return false;
        if (availabilityFilter === 'low_stock' && (p.stock <= 0 || p.stock > 2)) return false;
        if (availabilityFilter === 'out_of_stock' && p.stock > 0) return false;

        // In Stock Legacy Checkbox
        if (inStockOnly && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        // Boost searched products to the very top (prefix match > exact match > default sort)
        if (searchQuery && searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();

          const aExact = aName === q;
          const bExact = bName === q;
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;

          const aStarts = aName.startsWith(q);
          const bStarts = bName.startsWith(q);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
        }
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 4.8) - (a.rating || 4.8);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // 'featured' keeps original order
      });
  }, [products, category, searchQuery, priceFilter, availabilityFilter, inStockOnly, sortBy]);

  const handleAddToCart = async (productId, e) => {
    if (e) e.stopPropagation();
    setAddingId(productId);
    await addToCart(productId);
    setTimeout(() => setAddingId(null), 800);
  };

  const handleResetFilters = () => {
    if (onSelectCategory) onSelectCategory('All');
    if (onSearchChange) onSearchChange('');
    setPriceFilter('all');
    setSortBy('featured');
    setAvailabilityFilter('all');
    setInStockOnly(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="items-page-container">
        <div className="auth-gate-card">
          <div className="auth-gate-icon">🔒</div>
          <h2 className="auth-gate-title">Member Access Required</h2>
          <p className="auth-gate-desc">
            You must be signed in to view our flagship electronics catalog, explore technical specifications, and add items to your cart.
          </p>
          <div className="auth-gate-actions">
            <button
              className="btn-hero-primary"
              onClick={() => onNavigate && onNavigate('auth', { tab: 'login' })}
            >
              Sign In to Your Account
            </button>
            <button
              className="btn-hero-secondary"
              onClick={() => onNavigate && onNavigate('auth', { tab: 'register' })}
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="items-page-container">
      {/* Breadcrumbs */}
      <div className="items-breadcrumbs">
        <button className="breadcrumb-link" onClick={() => onNavigate('home')}>Home</button>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">
          {activeTabMode === 'restocker' ? 'Warehouse Stock Restocker' : 'Catalog & Hardware'}
        </span>
        {category !== 'All' && (
          <>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-highlight">{category}</span>
          </>
        )}
      </div>

      {/* Shipper Mode Selector Switch - Switch between clean Catalog and Stock Restocker */}
      {user?.role === 'shipper' && (
        <div className="shipper-mode-tab-bar">
          <button
            type="button"
            className={`shipper-mode-tab ${activeTabMode === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTabMode('catalog')}
          >
            🛍️ Browse Catalog
          </button>
          <button
            type="button"
            className={`shipper-mode-tab ${activeTabMode === 'restocker' ? 'active' : ''}`}
            onClick={() => setActiveTabMode('restocker')}
          >
            📦 Stock Restocker Station
          </button>
        </div>
      )}

      {/* Catalog / Restocker Hero Banner */}
      <div className="items-catalog-hero">
        <div className="catalog-hero-content">
          <div className="catalog-hero-pill">
            <span className="pill-dot"></span>
            <span>
              {activeTabMode === 'restocker'
                ? 'WAREHOUSE RESTOCKING HUB'
                : 'DIRECT FLAGSHIP REPOSITORY'}
            </span>
          </div>
          <h1 className="catalog-hero-title">
            {activeTabMode === 'restocker' ? (
              <>Warehouse <span className="gradient-text">Stock Restocker</span></>
            ) : (
              <>Engineering-Grade <span className="gradient-text">Electronics & Peripherals</span></>
            )}
          </h1>
          <p className="catalog-hero-subtitle">
            {activeTabMode === 'restocker'
              ? 'Dedicated inventory replenishment station for warehouse shippers. Increase unit counts, replenish depleted SKUs, and keep the store supplied.'
              : 'Explore our laboratory-tested hardware designed for extreme fidelity, durability, and ergonomic precision.'}
          </p>
        </div>

        <div className="catalog-hero-stats">
          <div className="hero-stat-card">
            <span className="stat-number">{products.length}</span>
            <span className="stat-label">Total SKUs</span>
          </div>
          <div className="hero-stat-card">
            <span className="stat-number">100%</span>
            <span className="stat-label">Authentic</span>
          </div>
          <div className="hero-stat-card">
            <span className="stat-number">2-Yr</span>
            <span className="stat-label">Warranty</span>
          </div>
        </div>
      </div>

      {/* Catalog Control Bar & Filter System */}
      <div className="catalog-filter-card">
        {/* Top Category Tabs */}
        <div className="catalog-category-pills">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-pill-btn ${category === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
            >
              <span className="cat-pill-icon">{cat.icon}</span>
              <span className="cat-pill-label">{cat.label}</span>
              <span className="cat-pill-count">{categoryCounts[cat.id] || 0}</span>
            </button>
          ))}
        </div>

        {/* Filter Controls Row */}
        <div className="catalog-toolbar-row">
          {/* Search Box */}
          <div className="toolbar-search">
            <svg className="toolbar-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search products, specs, tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="toolbar-search-input"
            />
            {searchQuery && (
              <button 
                className="toolbar-clear-btn"
                onClick={() => onSearchChange && onSearchChange('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Price Filter Select */}
          <div className="toolbar-select-wrap">
            <label htmlFor="price-filter" className="toolbar-label">Price Range:</label>
            <select
              id="price-filter"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="toolbar-select"
            >
              <option value="all">All Prices</option>
              <option value="under100">Under ₹100</option>
              <option value="100to200">₹100 - ₹200</option>
              <option value="above200">₹200 & Above</option>
            </select>
          </div>

          {/* Sort By Select */}
          <div className="toolbar-select-wrap">
            <label htmlFor="sort-by" className="toolbar-label">Sort By:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="toolbar-select"
            >
              <option value="featured">Featured Picks</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {/* Availability Status Filter */}
          <div className="toolbar-select-wrap">
            <label htmlFor="availability-filter" className="toolbar-label">Status:</label>
            <select
              id="availability-filter"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="toolbar-select"
            >
              <option value="all">All Items</option>
              <option value="available">🟢 Available (In Stock)</option>
              <option value="low_stock">⚠️ Low Stock (≤ 2 left)</option>
              <option value="out_of_stock">🔴 Out of Stock</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="view-mode-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
              aria-label="Grid view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
              aria-label="List view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <circle cx="4" cy="6" r="1" fill="currentColor" />
                <circle cx="4" cy="12" r="1" fill="currentColor" />
                <circle cx="4" cy="18" r="1" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>

        {/* Active Filter Badges */}
        {(category !== 'All' || searchQuery || priceFilter !== 'all' || inStockOnly) && (
          <div className="active-filters-strip">
            <span className="active-filters-label">Active Filters:</span>
            {category !== 'All' && (
              <span className="filter-tag">
                Category: {category}
                <button onClick={() => onSelectCategory('All')}>✕</button>
              </span>
            )}
            {searchQuery && (
              <span className="filter-tag">
                Search: "{searchQuery}"
                <button onClick={() => onSearchChange('')}>✕</button>
              </span>
            )}
            {priceFilter !== 'all' && (
              <span className="filter-tag">
                Price: {priceFilter}
                <button onClick={() => setPriceFilter('all')}>✕</button>
              </span>
            )}
            {inStockOnly && (
              <span className="filter-tag">
                In Stock Only
                <button onClick={() => setInStockOnly(false)}>✕</button>
              </span>
            )}
            <button className="btn-clear-all-filters" onClick={handleResetFilters}>
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* 👑 UPGRADED VIP EXCLUSIVE SUBSCRIBER BANNER WITH DISCOUNTS & COUPONS */}
      {category === 'VIP_Exclusive' && (
        <div style={{
          margin: '1.25rem 0 1.75rem 0',
          padding: '2rem 2.2rem',
          borderRadius: '20px',
          background: 'radial-gradient(ellipse at top left, rgba(234, 179, 8, 0.25), rgba(15, 23, 42, 0.96)), linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.99))',
          border: '1.5px solid rgba(234, 179, 8, 0.5)',
          boxShadow: '0 16px 45px rgba(234, 179, 8, 0.2), 0 0 0 1px rgba(245, 158, 11, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-25px',
            right: '-25px',
            fontSize: '11rem',
            opacity: 0.05,
            userSelect: 'none',
            pointerEvents: 'none'
          }}>
            👑
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.75rem', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: '740px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                  color: '#0f172a',
                  padding: '0.28rem 0.85rem',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  boxShadow: '0 2px 10px rgba(234, 179, 8, 0.45)'
                }}>
                  👑 VIP BLACK PRIVILEGE CLUB
                </span>
                <span style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600 }}>
                  Curated Private Reserve • ₹0 Free Priority Shipping
                </span>
              </div>

              <h2 style={{
                margin: '0.25rem 0 0.6rem 0',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#fef08a',
                letterSpacing: '-0.02em',
                lineHeight: 1.25
              }}>
                AeroStore VIP Subscriber Exclusive Lounge &amp; Flash Savings
              </h2>

              <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.94rem', lineHeight: 1.6 }}>
                Reserved exclusively for VIP subscribers. Get <strong>immediate 20% to 50% discount vouchers</strong>, zero-fee instant AeroMinutes deliveries, 3-year accidental hardware protection, and 1-click cart checkout.
              </p>

              {/* Exclusive VIP Coupons Showcase */}
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                  <span style={{ fontSize: '1rem' }}>🎟️</span>
                  <strong style={{ color: '#fef08a', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    VIP Exclusive Discount Coupons (Click Code to Auto-Apply &amp; Copy)
                  </strong>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '0.85rem'
                }}>
                  {/* Coupon 1: VIP20 (Min $100) */}
                  {(() => {
                    const minSpend = 100;
                    const currentSubtotal = cart?.subtotal || 0;
                    const isEligible = currentSubtotal >= minSpend;
                    const diff = (minSpend - currentSubtotal).toFixed(2);
                    return (
                      <div style={{
                        background: 'rgba(15, 23, 42, 0.75)',
                        border: `1.5px dashed ${isEligible ? 'rgba(56, 189, 248, 0.6)' : 'rgba(148, 163, 184, 0.25)'}`,
                        borderRadius: '12px',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.6rem',
                        opacity: isEligible ? 1 : 0.8
                      }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: isEligible ? '#38bdf8' : '#94a3b8' }}>20% OFF</span>
                            <span style={{
                              fontSize: '0.68rem',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                              background: isEligible ? 'rgba(56, 189, 248, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: isEligible ? '#38bdf8' : '#f87171',
                              fontWeight: 700
                            }}>
                              MIN ₹100
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                            Flat 20% off on electronics &amp; apparel.
                          </div>
                          {!isEligible && (
                            <div style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '0.35rem', fontWeight: 600 }}>
                              🔒 Add ₹{diff} more to unlock
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          disabled={!isEligible}
                          onClick={async () => {
                            if (!isEligible) return;
                            try {
                              await navigator.clipboard.writeText('VIP20');
                            } catch (e) {}
                            if (applyCoupon) await applyCoupon('VIP20');
                            setCopiedCoupon('VIP20');
                            setTimeout(() => setCopiedCoupon(null), 2500);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: !isEligible
                              ? 'rgba(100, 116, 139, 0.15)'
                              : copiedCoupon === 'VIP20'
                              ? 'rgba(16, 185, 129, 0.25)'
                              : 'rgba(56, 189, 248, 0.15)',
                            border: `1px solid ${!isEligible ? 'rgba(148, 163, 184, 0.2)' : copiedCoupon === 'VIP20' ? '#10b981' : 'rgba(56, 189, 248, 0.4)'}`,
                            borderRadius: '6px',
                            padding: '0.42rem 0.65rem',
                            cursor: isEligible ? 'pointer' : 'not-allowed',
                            color: !isEligible ? '#64748b' : copiedCoupon === 'VIP20' ? '#34d399' : '#38bdf8',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            transition: 'all 0.2s ease'
                          }}
                          title={!isEligible ? `Cart minimum ₹100 required (Current: ₹${currentSubtotal.toFixed(2)})` : 'Click to apply coupon code'}
                        >
                          <span>🏷️ VIP20</span>
                          <span style={{ fontSize: '0.72rem' }}>
                            {!isEligible ? '❌ Locked (Below ₹100)' : copiedCoupon === 'VIP20' ? '✓ Applied!' : 'Apply Code ↗'}
                          </span>
                        </button>
                      </div>
                    );
                  })()}

                  {/* Coupon 2: VIP30 (Min $150) */}
                  {(() => {
                    const minSpend = 150;
                    const currentSubtotal = cart?.subtotal || 0;
                    const isEligible = currentSubtotal >= minSpend;
                    const diff = (minSpend - currentSubtotal).toFixed(2);
                    return (
                      <div style={{
                        background: 'rgba(15, 23, 42, 0.75)',
                        border: `1.5px dashed ${isEligible ? 'rgba(168, 85, 247, 0.6)' : 'rgba(148, 163, 184, 0.25)'}`,
                        borderRadius: '12px',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.6rem',
                        opacity: isEligible ? 1 : 0.8
                      }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: isEligible ? '#a855f7' : '#94a3b8' }}>30% OFF</span>
                            <span style={{
                              fontSize: '0.68rem',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                              background: isEligible ? 'rgba(168, 85, 247, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: isEligible ? '#c084fc' : '#f87171',
                              fontWeight: 700
                            }}>
                              MIN ₹150
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                            Premium sound &amp; gaming monitors discount.
                          </div>
                          {!isEligible && (
                            <div style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '0.35rem', fontWeight: 600 }}>
                              🔒 Add ₹{diff} more to unlock
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          disabled={!isEligible}
                          onClick={async () => {
                            if (!isEligible) return;
                            try {
                              await navigator.clipboard.writeText('VIP30');
                            } catch (e) {}
                            if (applyCoupon) await applyCoupon('VIP30');
                            setCopiedCoupon('VIP30');
                            setTimeout(() => setCopiedCoupon(null), 2500);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: !isEligible
                              ? 'rgba(100, 116, 139, 0.15)'
                              : copiedCoupon === 'VIP30'
                              ? 'rgba(16, 185, 129, 0.25)'
                              : 'rgba(168, 85, 247, 0.15)',
                            border: `1px solid ${!isEligible ? 'rgba(148, 163, 184, 0.2)' : copiedCoupon === 'VIP30' ? '#10b981' : 'rgba(168, 85, 247, 0.4)'}`,
                            borderRadius: '6px',
                            padding: '0.42rem 0.65rem',
                            cursor: isEligible ? 'pointer' : 'not-allowed',
                            color: !isEligible ? '#64748b' : copiedCoupon === 'VIP30' ? '#34d399' : '#c084fc',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            transition: 'all 0.2s ease'
                          }}
                          title={!isEligible ? `Cart minimum ₹150 required (Current: ₹${currentSubtotal.toFixed(2)})` : 'Click to apply coupon code'}
                        >
                          <span>🏷️ VIP30</span>
                          <span style={{ fontSize: '0.72rem' }}>
                            {!isEligible ? '❌ Locked (Below ₹150)' : copiedCoupon === 'VIP30' ? '✓ Applied!' : 'Apply Code ↗'}
                          </span>
                        </button>
                      </div>
                    );
                  })()}

                  {/* Coupon 3: VIPFIRST (No min spend, always available) */}
                  {(() => {
                    return (
                      <div style={{
                        background: 'rgba(15, 23, 42, 0.75)',
                        border: '1.5px dashed rgba(16, 185, 129, 0.55)',
                        borderRadius: '12px',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.6rem'
                      }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981' }}>25% OFF</span>
                            <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700 }}>
                              NO MIN SPEND
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                            Welcome gift voucher for VIP subscribers!
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '0.35rem', fontWeight: 600 }}>
                            ⚡ Instant Unlocked (Cart subtotal: ₹{(cart?.subtotal || 0).toFixed(2)})
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText('VIPFIRST');
                            } catch (e) {}
                            if (applyCoupon) await applyCoupon('VIPFIRST');
                            setCopiedCoupon('VIPFIRST');
                            setTimeout(() => setCopiedCoupon(null), 2500);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: copiedCoupon === 'VIPFIRST' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)',
                            border: `1px solid ${copiedCoupon === 'VIPFIRST' ? '#10b981' : 'rgba(16, 185, 129, 0.4)'}`,
                            borderRadius: '6px',
                            padding: '0.42rem 0.65rem',
                            cursor: 'pointer',
                            color: copiedCoupon === 'VIPFIRST' ? '#34d399' : '#34d399',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            transition: 'all 0.2s ease'
                          }}
                          title="Click to apply VIPFIRST coupon"
                        >
                          <span>🏷️ VIPFIRST</span>
                          <span style={{ fontSize: '0.72rem' }}>{copiedCoupon === 'VIPFIRST' ? '✓ Applied!' : 'Apply Code ↗'}</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* VIP Benefits & Customer Feasibility Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '1.15rem' }}>
                <span style={{
                  background: 'rgba(234, 179, 8, 0.12)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  color: '#fef08a',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  ⚡ ₹0 Zero Delivery Fee (AeroMinutes 10-Min Express)
                </span>
                <span style={{
                  background: 'rgba(234, 179, 8, 0.12)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  color: '#fef08a',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  🛡️ 3-Year No-Questions Hardware Warranty
                </span>
                <span style={{
                  background: 'rgba(234, 179, 8, 0.12)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  color: '#fef08a',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  🔄 30-Day Instant Hassle-Free Returns &amp; Replacement
                </span>
                <span style={{
                  background: 'rgba(234, 179, 8, 0.12)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  color: '#fef08a',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  🤖 Dedicated 24/7 VIP AI Concierge &amp; Personal Shopper
                </span>
              </div>
            </div>

            {/* Current VIP Status Card & Feasibility Upgrade Box */}
            <div style={{
              background: user?.is_vip ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.14)',
              border: `1.5px solid ${user?.is_vip ? 'rgba(16, 185, 129, 0.5)' : 'rgba(245, 158, 11, 0.45)'}`,
              padding: '1.35rem 1.6rem',
              borderRadius: '16px',
              minWidth: '260px',
              maxWidth: '300px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
            }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.2rem' }}>
                {user?.is_vip ? '💎' : '👑'}
              </div>
              <div style={{
                color: user?.is_vip ? '#34d399' : '#fbbf24',
                fontWeight: 800,
                fontSize: '1rem',
                letterSpacing: '-0.01em'
              }}>
                {user?.is_vip ? 'VIP Member Access Active' : 'Subscribe to AeroStore VIP'}
              </div>
              <p style={{ margin: '0.45rem 0 1rem 0', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                {user?.is_vip
                  ? `Signed in as VIP: ${user.name || user.email}. All VIP products & discounts unlocked!`
                  : 'Get instant access to private reserve products, zero shipping fees, and up to 50% discount vouchers.'}
              </p>

              {!user?.is_vip ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {/* Instant 1-Click Subscribe / Upgrade Button */}
                  <button
                    type="button"
                    disabled={upgradingVip}
                    onClick={async () => {
                      if (!isAuthenticated) {
                        if (onNavigate) onNavigate('auth', { tab: 'login' });
                        return;
                      }
                      setUpgradingVip(true);
                      await upgradeToVip();
                      setUpgradingVip(false);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      width: '100%',
                      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.45)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {upgradingVip ? 'Upgrading Membership...' : '⭐ 1-Click Subscribe Now (Free VIP Pass)'}
                  </button>

                  {/* Demo Login Shortcut */}
                  <button
                    type="button"
                    onClick={() => {
                      const demoVip = { email: 'vip@aerostore.io', password: 'password123' };
                      alert(`💡 Quick Demo: Sign in using pre-configured VIP account:\nEmail: ${demoVip.email}\nPassword: ${demoVip.password}\nto test immediate VIP cart order placement!`);
                      if (onNavigate) onNavigate('auth', { tab: 'login' });
                    }}
                    style={{
                      background: 'rgba(234, 179, 8, 0.15)',
                      color: '#fef08a',
                      border: '1px solid rgba(234, 179, 8, 0.35)',
                      padding: '0.45rem 1rem',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    🔑 Try VIP Demo Account
                  </button>
                </div>
              ) : (
                <div style={{
                  padding: '0.5rem',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  fontWeight: 700,
                  fontSize: '0.82rem'
                }}>
                  ✓ VIP Platinum Status Activated
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Catalog Results Header */}
      <div className="catalog-results-meta" ref={catalogViewRef}>
        <span className="meta-results-count">
          Showing <strong>{filteredProducts.length}</strong> of {products.length} products
          {searchQuery && <span className="meta-search-tag"> matching "{searchQuery}"</span>}
        </span>
        <span className="meta-free-shipping-note">
          ⚡ Free express 2-day delivery on orders over ₹499
        </span>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="catalog-loading-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="product-skeleton-card">
              <div className="skeleton-img-box shimmer"></div>
              <div className="skeleton-line shimmer" style={{ width: '40%' }}></div>
              <div className="skeleton-line shimmer" style={{ width: '85%' }}></div>
              <div className="skeleton-line shimmer" style={{ width: '60%' }}></div>
              <div className="skeleton-footer-box shimmer"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error View */}
      {error && !loading && (
        <div className="catalog-error-box">
          <div className="error-icon">⚠️</div>
          <h3>Failed to load catalog products</h3>
          <p>{error}</p>
          <button className="btn-retry-catalog" onClick={onRetry}>
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="catalog-empty-box">
          <div className="empty-catalog-icon">🔍</div>
          <h3>No matching products found</h3>
          <p>We couldn't find any items matching your selected criteria. Try adjusting your search or clearing filters.</p>
          <button className="btn-reset-filters" onClick={handleResetFilters}>
            Reset All Filters
          </button>
        </div>
      )}

      {/* Products Display (Grid or List) */}
      {!loading && !error && filteredProducts.length > 0 && (
        viewMode === 'grid' ? (
          <div className="items-grid-layout">
            {filteredProducts.map((product) => {
              const isLowStock = product.stock > 0 && product.stock <= 2;
              const isOutOfStock = product.stock <= 0;
              const isAdding = addingId === product.id;
              const isSearchMatch = searchQuery && searchQuery.trim() && product.name.toLowerCase().includes(searchQuery.toLowerCase().trim());

              return (
                <div
                  key={product.id}
                  className={`item-catalog-card ${isOutOfStock ? 'out-of-stock' : ''} ${isSearchMatch ? 'search-highlighted' : ''}`}
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                >
                  {/* Top Badge Strip */}
                  <div className="item-card-header">
                    <span className="item-category-pill">{product.category}</span>
                    {isSearchMatch && (
                      <span className="search-match-badge">🎯 Top Search Match</span>
                    )}
                    {isOutOfStock ? (
                      <span className="stock-pill stock-empty">🔴 Out of Stock</span>
                    ) : isLowStock ? (
                      <span className="stock-pill stock-low">⚠️ Low Stock ({product.stock} left)</span>
                    ) : (
                      <span className="stock-pill stock-in">🟢 Available ({product.stock} in stock)</span>
                    )}
                  </div>

                  {/* Product Image */}
                  <div className="item-image-wrap">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    {isOutOfStock && (
                      <div className="img-sold-out-banner">
                        <span>OUT OF STOCK</span>
                      </div>
                    )}
                    <button
                      className="item-quick-peek-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct && onSelectProduct(product);
                      }}
                    >
                      Quick View
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="item-card-body">
                    <div className="item-rating-row">
                      <span className="stars">★★★★★</span>
                      <span className="rating-val">{product.rating || '4.8'}</span>
                      <span className="rating-count">({Math.floor((product.price * 3.7) % 80 + 24)})</span>
                    </div>

                    <h3 className="item-card-title">{product.name}</h3>
                    <p className="item-card-description">{product.description}</p>

                    {/* VIP Perks Free Gift Showcase */}
                    {(() => {
                      const isVipMode = category === 'VIP_Exclusive' || user?.is_vip;
                      const vipPerk = isVipMode ? getProductVipPerks(product) : null;
                      if (!vipPerk) return null;
                      return (
                        <div style={{
                          margin: '0.45rem 0 0.55rem 0',
                          padding: '0.4rem 0.65rem',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.12), rgba(16, 185, 129, 0.12))',
                          border: '1px solid rgba(234, 179, 8, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.76rem'
                        }}>
                          <span style={{ fontSize: '1rem', flexShrink: 0 }}>{vipPerk.giftIcon}</span>
                          <div style={{ lineHeight: 1.3 }}>
                            <span style={{ color: '#fef08a', fontWeight: 800 }}>VIP FREE GIFT: </span>
                            <span style={{ color: '#6ee7b7', fontWeight: 600 }}>{vipPerk.giftName}</span>
                            <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}> (Worth ₹{vipPerk.giftValue})</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Pricing & CTA Footer */}
                    <div className="item-card-footer">
                      <div className="item-price-block">
                        {(() => {
                          const isVipMode = category === 'VIP_Exclusive' || user?.is_vip;
                          const vipPerk = isVipMode ? getProductVipPerks(product) : null;
                          if (vipPerk) {
                            return (
                              <>
                                <span className="item-price" style={{ color: '#34d399', fontWeight: 800 }}>
                                  ₹{vipPerk.vipPrice.toFixed(2)}
                                </span>
                                <span className="item-price-regular" style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.85rem' }}>
                                  ₹{product.price.toFixed(2)}
                                </span>
                                <span style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  background: 'linear-gradient(135deg, #10b981, #059669)',
                                  color: '#ffffff',
                                  padding: '0.12rem 0.45rem',
                                  borderRadius: '4px'
                                }}>
                                  VIP {vipPerk.discountPercent}% OFF
                                </span>
                              </>
                            );
                          }
                          return (
                            <>
                              <span className="item-price">₹{product.price.toFixed(2)}</span>
                              <span className="item-price-regular">₹{(product.price * 1.25).toFixed(2)}</span>
                            </>
                          );
                        })()}
                      </div>

                      <div className="item-card-actions-group">
                        {user?.role !== 'admin' && user?.role !== 'shipper' && user?.role !== 'delivery_partner' && user?.role !== 'delivery' && (
                          <button
                            type="button"
                            className={`btn-item-compare ${comparedProductIds.includes(product.id) ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onToggleCompare) onToggleCompare(product);
                            }}
                            title={comparedProductIds.includes(product.id) ? 'Remove from comparison' : 'Compare product'}
                          >
                            ⚖️ {comparedProductIds.includes(product.id) ? 'Comparing' : 'Compare'}
                          </button>
                        )}
                        {user?.role !== 'admin' && user?.role !== 'shipper' && user?.role !== 'delivery_partner' && user?.role !== 'delivery' && (
                          <button
                            className={`item-add-cart-btn ${isAdding ? 'added' : ''} ${isOutOfStock ? 'btn-disabled-sold-out' : ''}`}
                            onClick={(e) => handleAddToCart(product.id, e)}
                            disabled={isOutOfStock || isAdding}
                            aria-label={`Add ${product.name} to cart`}
                          >
                            {isAdding ? (
                              <span>✓ Added</span>
                            ) : isOutOfStock ? (
                              <span>❌ Sold Out</span>
                            ) : (
                              <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <line x1="12" y1="5" x2="12" y2="19" />
                                  <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>
                        )}
                        {user?.role === 'shipper' && activeTabMode === 'restocker' ? (
                          <div className="shipper-stock-manager-bar" onClick={(e) => e.stopPropagation()}>
                            <div className="shipper-count-controls">
                              <button
                                type="button"
                                className="btn-shipper-stepper"
                                onClick={() => handleUpdateStock(product.id, Math.max(0, product.stock - 1))}
                                disabled={product.stock <= 0 || updatingStockId === product.id}
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
                                onClick={() => handleUpdateStock(product.id, product.stock + 1)}
                                disabled={updatingStockId === product.id}
                                title="Increase stock (+1)"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              className="btn-shipper-restock"
                              onClick={() => handleUpdateStock(product.id, product.stock + 10)}
                              disabled={updatingStockId === product.id}
                              title="Restock batch (+10)"
                            >
                              📦 +10 Restock Units
                            </button>
                          </div>
                        ) : (user?.role === 'shipper' || user?.role === 'admin') ? (
                          <button
                            className="item-details-full-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProduct && onSelectProduct(product);
                            }}
                            style={{ width: '100%', padding: '0.65rem 1rem', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#a5b4fc', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            🔍 View Details & Specs
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View Mode */
          <div className="items-list-layout">
            {filteredProducts.map((product) => {
              const isLowStock = product.stock > 0 && product.stock <= 2;
              const isOutOfStock = product.stock <= 0;
              const isAdding = addingId === product.id;

              return (
                <div
                  key={product.id}
                  className={`item-list-row-card ${isOutOfStock ? 'out-of-stock' : ''}`}
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                >
                  <div className="list-img-box">
                    <img src={product.image_url} alt={product.name} loading="lazy" />
                    {isOutOfStock && (
                      <div className="img-sold-out-banner">
                        <span>SOLD OUT</span>
                      </div>
                    )}
                  </div>

                  <div className="list-content-col">
                    <div className="list-meta-row">
                      <span className="item-category-pill">{product.category}</span>
                      {isOutOfStock ? (
                        <span className="stock-pill stock-empty">🔴 Out of Stock</span>
                      ) : isLowStock ? (
                        <span className="stock-pill stock-low">⚠️ Low Stock (Only {product.stock} left)</span>
                      ) : (
                        <span className="stock-pill stock-in">🟢 Available ({product.stock} in stock • Ready to Ship)</span>
                      )}
                      <span className="list-sku-tag">SKU: #{product.id.slice(0, 8)}</span>
                    </div>

                    <h3 className="list-product-title">{product.name}</h3>
                    <p className="list-product-desc">{product.description}</p>

                    <div className="list-features-pills">
                      <span className="feature-pill">🛡️ 2-Year Warranty</span>
                      <span className="feature-pill">🚚 2-Day Express</span>
                      <span className="feature-pill">★ {product.rating || '4.8'} Verified Rating</span>
                    </div>
                  </div>

                  <div className="list-action-col">
                    {(() => {
                      const isVipMode = category === 'VIP_Exclusive' || user?.is_vip;
                      const vipPerk = isVipMode ? getProductVipPerks(product) : null;
                      return (
                        <>
                          {vipPerk && (
                            <div style={{
                              marginBottom: '0.45rem',
                              padding: '0.35rem 0.6rem',
                              borderRadius: '6px',
                              background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(16, 185, 129, 0.15))',
                              border: '1px solid rgba(234, 179, 8, 0.35)',
                              fontSize: '0.74rem',
                              color: '#6ee7b7',
                              fontWeight: 600,
                              lineHeight: 1.3
                            }}>
                              <span style={{ color: '#fef08a', fontWeight: 800 }}>{vipPerk.giftIcon} VIP FREE GIFT: </span>
                              {vipPerk.giftName}
                            </div>
                          )}
                          <div className="list-price-wrap">
                            {vipPerk ? (
                              <>
                                <span className="list-price" style={{ color: '#34d399', fontWeight: 800 }}>
                                  ₹{vipPerk.vipPrice.toFixed(2)}
                                </span>
                                <span style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  background: 'linear-gradient(135deg, #10b981, #059669)',
                                  color: '#ffffff',
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '4px'
                                }}>
                                  VIP {vipPerk.discountPercent}% OFF
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="list-price">₹{product.price.toFixed(2)}</span>
                                <span className="list-savings-badge">Save 20%</span>
                              </>
                            )}
                          </div>
                        </>
                      );
                    })()}

                    {user?.role !== 'admin' && user?.role !== 'shipper' && user?.role !== 'delivery_partner' && user?.role !== 'delivery' && (
                      <button
                        className={`list-btn-add-cart ${isAdding ? 'added' : ''} ${isOutOfStock ? 'btn-disabled-sold-out' : ''}`}
                        onClick={(e) => handleAddToCart(product.id, e)}
                        disabled={isOutOfStock || isAdding}
                      >
                        {isAdding ? '✓ Added to Cart' : isOutOfStock ? '❌ Out of Stock' : 'Add to Cart'}
                      </button>
                    )}

                    <button
                      className="list-btn-details"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct && onSelectProduct(product);
                      }}
                    >
                      View Specs
                    </button>

                    {user?.role !== 'admin' && user?.role !== 'shipper' && user?.role !== 'delivery_partner' && user?.role !== 'delivery' && (
                      <button
                        type="button"
                        className={`list-btn-compare ${comparedProductIds.includes(product.id) ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleCompare) onToggleCompare(product);
                        }}
                        title={comparedProductIds.includes(product.id) ? 'Remove from comparison' : 'Compare product'}
                      >
                        ⚖️ {comparedProductIds.includes(product.id) ? 'Comparing' : 'Compare'}
                      </button>
                    )}

                    {user?.role === 'shipper' && activeTabMode === 'restocker' && (
                      <div className="shipper-stock-manager-bar" onClick={(e) => e.stopPropagation()} style={{ width: '100%' }}>
                        <div className="shipper-count-controls">
                          <button
                            type="button"
                            className="btn-shipper-stepper"
                            onClick={() => handleUpdateStock(product.id, Math.max(0, product.stock - 1))}
                            disabled={product.stock <= 0 || updatingStockId === product.id}
                          >
                            −
                          </button>
                          <span className="shipper-stock-display">
                            <strong>{product.stock}</strong> in stock
                          </span>
                          <button
                            type="button"
                            className="btn-shipper-stepper"
                            onClick={() => handleUpdateStock(product.id, product.stock + 1)}
                            disabled={updatingStockId === product.id}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="btn-shipper-restock"
                          onClick={() => handleUpdateStock(product.id, product.stock + 10)}
                          disabled={updatingStockId === product.id}
                        >
                          📦 +10 Restock
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
