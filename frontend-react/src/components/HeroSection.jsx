import React from 'react';
import { useAuth } from '../context/AuthContext';

export function HeroSection({ onShopNow, onAskAi, onOpenAppInfo }) {
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <section className="hero-section" aria-label="AeroStore Welcome Banner">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span>✨ Your Premium Electronics Destination</span>
          </div>
          
          <h1 className="hero-title">
            Shop Smarter. <br />
            <span className="hero-title-gradient">Live Better.</span>
          </h1>
          
          <p className="hero-subtitle">
            Welcome to <strong>AeroStore</strong> — discover handpicked premium headphones, 
            smartwatches, keyboards, and accessories. Enjoy <strong>free express delivery</strong>, 
            a <strong>30-day return policy</strong>, and help from our <strong>AI shopping assistant</strong> 
            whenever you need it.
          </p>

          {/* Key Benefits Highlights */}
          <div className="app-pillars-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', margin: '1rem 0 1.5rem' }}>
            <div className="hero-benefit-pill">
              <span>🚚</span>
              <div>
                <strong>Free Express Shipping</strong>
                <div className="hero-benefit-sub">On orders over $75</div>
              </div>
            </div>

            <div className="hero-benefit-pill">
              <span>🔄</span>
              <div>
                <strong>30-Day Free Returns</strong>
                <div className="hero-benefit-sub">No questions asked</div>
              </div>
            </div>

            <div className="hero-benefit-pill">
              <span>🤖</span>
              <div>
                <strong>AI Shopping Helper</strong>
                <div className="hero-benefit-sub">Get instant product advice</div>
              </div>
            </div>

            <div className="hero-benefit-pill">
              <span>🛡️</span>
              <div>
                <strong>2-Year Warranty</strong>
                <div className="hero-benefit-sub">Full hardware coverage</div>
              </div>
            </div>
          </div>

          <div className="hero-cta-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {!isAuthenticated && (
              <button 
                className="btn-hero-create-account"
                onClick={() => openAuthModal('register')}
                aria-label="Create a free AeroStore account"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                <span>Create Free Account</span>
              </button>
            )}

            <button 
              className="btn-hero-secondary" 
              onClick={onAskAi}
              aria-label="Chat with our AI shopping assistant"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Ask AI Assistant</span>
            </button>
          </div>
        </div>

        <div className="hero-media-wrapper">
          <div className="hero-media-card">
            <div className="hero-card-glow"></div>
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" 
              alt="HyperSound ANC Wireless Headphones" 
              className="hero-featured-img"
            />
            <div className="hero-product-info">
              <span className="hero-product-tag">BESTSELLER</span>
              <h3 className="hero-product-name">HyperSound ANC Wireless</h3>
              <div className="hero-product-meta">
                <span className="hero-product-price">$199.99</span>
                <span className="hero-product-rating">⭐ 4.9 (128 reviews)</span>
              </div>
            </div>
            <div className="hero-floating-spec">
              <span>🔋 40h Battery</span>
              <span>•</span>
              <span>🎧 Active Noise Cancelling</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
