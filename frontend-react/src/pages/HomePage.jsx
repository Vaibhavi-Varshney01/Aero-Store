import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ServicesSection } from '../components/ServicesSection';
import { TrustBar } from '../components/TrustBar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export function HomePage({
  onNavigate,
  onOpenAppInfo,
  onSelectProduct,
  products = [],
  onToggleCompare,
  comparedProductIds = [],
  onStockUpdated
}) {
  const { openAuthModal, isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = (productId) => {
    if (!isAuthenticated) {
      if (onNavigate) onNavigate('auth', { tab: 'login' });
      return;
    }
    addToCart(productId);
  };

  // Featured top 3 products
  const featuredProducts = products.slice(0, 3);

  const categories = [
    {
      id: 'Electronics',
      name: 'Studio Audio & Acoustics',
      tagline: 'High-fidelity drivers & noise isolation',
      icon: '🎧',
      count: 'Electronics',
      color: '#6366f1'
    },
    {
      id: 'Accessories',
      name: 'Tactile Peripherals',
      tagline: 'Precision mechanical switches & optical sensors',
      icon: '⌨️',
      count: 'Accessories',
      color: '#38bdf8'
    },
    {
      id: 'Wearables',
      name: 'Smart Wearables',
      tagline: 'Biometric tracking & sapphire display',
      icon: '⌚',
      count: 'Wearables',
      color: '#10b981'
    },
    {
      id: 'Apparel',
      name: 'Streetwear & Techwear',
      tagline: 'Cyberpunk hoodies & commuter storm jackets',
      icon: '🧥',
      count: 'Apparel',
      color: '#ec4899'
    },
    {
      id: 'Fitness',
      name: 'Fitness & Athletics',
      tagline: 'Carbon-plate running shoes & thermal bottles',
      icon: '👟',
      count: 'Fitness',
      color: '#f59e0b'
    },
    {
      id: 'Home & Living',
      name: 'Home & Living',
      tagline: 'Ceramic coffee pour-over & aroma diffusers',
      icon: '☕',
      count: 'Home & Living',
      color: '#8b5cf6'
    },
    {
      id: 'Grocery',
      name: 'Artisanal Pantry & Groceries',
      tagline: 'Single-origin coffee beans, olive oil, almonds & maple syrup',
      icon: '🥑',
      count: 'Pantry / Secondary',
      color: '#14b8a6'
    },
    {
      id: 'Cafe & Beverages',
      name: 'AeroCafe & Instant Refreshments',
      tagline: '⚡ Delivered in 10 minutes: Cold brews, matcha, fresh croissants & snacks',
      icon: '☕',
      count: '⚡ Minutes Delivery',
      color: '#f97316'
    }
  ];

  return (
    <div className="home-page-container">
      {/* Hero Banner Section */}
      <HeroSection
        onShopNow={() => onNavigate('items')}
        onAskAi={() => {
          const launcher = document.getElementById('chatbot-launcher');
          if (launcher) launcher.click();
        }}
        onOpenAppInfo={onOpenAppInfo}
      />

      {/* Quick Category Showcase */}
      <section className="home-category-showcase">
        <div className="home-section-header">
          <div>
            <span className="catalog-eyebrow">CURATED DIVISIONS</span>
            <h2 className="catalog-main-heading">Explore By Category</h2>
          </div>
        </div>

        <div className="category-feature-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-feature-card"
              onClick={() => onNavigate('items', { category: cat.id })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onNavigate('items', { category: cat.id });
                }
              }}
            >
              <div className="cat-card-header">
                <span className="cat-icon-badge" style={{ background: `${cat.color}20`, color: cat.color }}>
                  {cat.icon}
                </span>
                <span className="cat-count-pill">{cat.count}</span>
              </div>
              <h3 className="cat-title">{cat.name}</h3>
              <p className="cat-tagline">{cat.tagline}</p>
              <div className="cat-card-action">
                <span>Browse Collection</span>
                <span className="cat-arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AeroMinutes & Cafe Instant Express Hub Section */}
      <section className="home-aerominutes-banner">
        <div className="aerominutes-card">
          <div className="aerominutes-left">
            <div className="aerominutes-tag">
              <span className="pulse-lightning">⚡</span>
              <span>AEROMINUTES EXPRESS • FLIPKART MINUTES STYLE</span>
            </div>
            <h2 className="aerominutes-title">Delivery in Minutes. Fresh from AeroCafe.</h2>
            <p className="aerominutes-desc">
              Craving fresh refreshments or need instant essentials? Order chilled Nitro Cold Brews, buttery French croissants, Uji matcha, and quick energy snacks delivered to your door in <strong>under 10 minutes</strong>.
            </p>
            <div className="aerominutes-perks">
              <span className="perk-chip">⏱️ 8-10 Min Delivery</span>
              <span className="perk-chip">☕ Freshly Oven-Warmed & Chilled</span>
              <span className="perk-chip">🛵 Zero Delivery Fee on orders ₹149+</span>
            </div>
            <div className="aerominutes-btn-group">
              <button
                className="btn-aerominutes-primary"
                onClick={() => onNavigate('items', { category: 'Cafe & Beverages' })}
              >
                ☕ Order from AeroCafe Now →
              </button>
              <button
                className="btn-aerominutes-secondary"
                onClick={() => {
                  const launcher = document.getElementById('chatbot-launcher');
                  if (launcher) {
                    launcher.click();
                    setTimeout(() => {
                      const input = document.getElementById('chat-user-input');
                      if (input) {
                        input.value = "What can I get delivered in minutes?";
                        const send = document.getElementById('btn-chat-send');
                        if (send) send.click();
                      }
                    }, 300);
                  }
                }}
              >
                ⚡ Ask AI for Minutes Delivery
              </button>
            </div>
          </div>
          <div className="aerominutes-right">
            <div className="aerominutes-stat-box">
              <div className="stat-big">~9<span className="stat-unit">mins</span></div>
              <div className="stat-label">Average Hub Dispatch & Delivery</div>
            </div>
            <div className="aerominutes-mini-list">
              <div className="mini-item-preview" onClick={() => onNavigate('items', { category: 'Cafe & Beverages' })}>
                <span className="mini-item-emoji">🥤</span>
                <div>
                  <strong>Nitro Cold Brew Latte</strong>
                  <small>₹5.49 • Chilled 3°C</small>
                </div>
              </div>
              <div className="mini-item-preview" onClick={() => onNavigate('items', { category: 'Cafe & Beverages' })}>
                <span className="mini-item-emoji">🥐</span>
                <div>
                  <strong>Normandy Butter Croissant</strong>
                  <small>₹4.25 • Oven Warmed</small>
                </div>
              </div>
              <div className="mini-item-preview" onClick={() => onNavigate('items', { category: 'Cafe & Beverages' })}>
                <span className="mini-item-emoji">🍵</span>
                <div>
                  <strong>Uji Ceremonial Matcha</strong>
                  <small>₹6.20 • Whisked Fresh</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Spotlight Grid */}
      {featuredProducts.length > 0 && (
        <section className="home-featured-spotlight">
          <div className="home-section-header">
            <div>
              <span className="catalog-eyebrow">FLAGSHIP PICKS</span>
              <h2 className="catalog-main-heading">Trending Innovations</h2>
            </div>
            <span className="trending-badge">🔥 High Demand</span>
          </div>

          <div className="spotlight-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="spotlight-card">
                <div className="spotlight-badge-wrap">
                  <span className="spotlight-category-tag">{product.category}</span>
                  {product.stock === 0 ? (
                    <span className="spotlight-stock-tag stock-empty">🔴 Out of Stock</span>
                  ) : product.stock <= 2 ? (
                    <span className="spotlight-stock-tag stock-low">⚠️ Low Stock ({product.stock} left)</span>
                  ) : (
                    <span className="spotlight-stock-tag stock-in">🟢 Available ({product.stock} in stock)</span>
                  )}
                </div>

                <div 
                  className="spotlight-img-wrap"
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                >
                  <img src={product.image_url} alt={product.name} loading="lazy" />
                  {product.stock === 0 && (
                    <div className="img-sold-out-banner">
                      <span>SOLD OUT</span>
                    </div>
                  )}
                </div>

                <div className="spotlight-details">
                  <h3 
                    className="spotlight-product-title"
                    onClick={() => onSelectProduct && onSelectProduct(product)}
                  >
                    {product.name}
                  </h3>
                  <p className="spotlight-product-desc">{product.description}</p>

                  <div className="spotlight-footer">
                    <div className="spotlight-pricing">
                      <span className="spotlight-price">₹{product.price.toFixed(2)}</span>
                      <span className="spotlight-rating">★ {product.rating || '4.9'}</span>
                    </div>
                    <div className="spotlight-actions">
                      <button
                        className="spotlight-quickview-btn"
                        onClick={() => onSelectProduct && onSelectProduct(product)}
                        title="View Details"
                        style={user?.role === 'admin' || user?.role === 'shipper' || user?.role === 'delivery_partner' || user?.role === 'delivery' ? { flex: 1 } : {}}
                      >
                        Details
                      </button>
                      {user?.role !== 'admin' && user?.role !== 'shipper' && user?.role !== 'delivery_partner' && user?.role !== 'delivery' && (
                        <button
                          type="button"
                          className={`spotlight-compare-btn ${comparedProductIds.includes(product.id) ? 'active' : ''}`}
                          onClick={() => onToggleCompare && onToggleCompare(product)}
                          title={comparedProductIds.includes(product.id) ? 'Remove from comparison' : 'Compare specifications'}
                        >
                          ⚖️ {comparedProductIds.includes(product.id) ? 'Compared' : 'Compare'}
                        </button>
                      )}
                      {user?.role !== 'admin' && user?.role !== 'shipper' && user?.role !== 'delivery_partner' && user?.role !== 'delivery' && (
                        <button
                          className={`spotlight-cart-btn ${product.stock === 0 ? 'btn-disabled-sold-out' : ''}`}
                          onClick={() => handleAddToCart(product.id)}
                          disabled={product.stock === 0}
                        >
                          {product.stock === 0 ? '❌ Sold Out' : '+ Add to Cart'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Enterprise Services Overview */}
      <ServicesSection onCreateAccount={() => onNavigate('auth', { tab: 'register' })} />

      {/* Trust & Guarantee Banner */}
      <TrustBar />
    </div>
  );
}
