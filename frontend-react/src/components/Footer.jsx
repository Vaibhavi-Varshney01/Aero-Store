import React, { useState } from 'react';

export function Footer({ onCategoryClick, onAskAi, onNavigate }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleCatClick = (cat) => {
    if (onCategoryClick) onCategoryClick(cat);
    if (onNavigate) onNavigate('items', { category: cat });
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <div
            className="brand-logo footer-logo"
            onClick={() => onNavigate && onNavigate('home')}
            style={{ cursor: 'pointer' }}
          >
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span>AeroStore<span style={{ color: '#818cf8', fontWeight: 400 }}> AI</span></span>
          </div>
          <p className="footer-desc">
            Next-generation consumer electronics, performance peripherals, and biometric wearables engineered for excellence. 
            Backed by a 30-day money-back guarantee and 2-year warranty.
          </p>
          <div className="footer-support-pill" onClick={onAskAi} style={{ cursor: 'pointer' }}>
            <span>🤖 Need Help? Talk to AI Shopping Concierge</span>
          </div>
        </div>

        {/* Categories Column */}
        <div className="footer-col">
          <h4 className="footer-heading">Product Collections</h4>
          <ul className="footer-links">
            <li><button className="footer-link-btn" onClick={() => handleCatClick('Electronics')}>Hi-Fi Audio & ANC</button></li>
            <li><button className="footer-link-btn" onClick={() => handleCatClick('Accessories')}>Mechanical Keyboards & Mice</button></li>
            <li><button className="footer-link-btn" onClick={() => handleCatClick('Wearables')}>Titan Pro Smartwatches</button></li>
            <li><button className="footer-link-btn" onClick={() => handleCatClick('All')}>All Flagship Products</button></li>
          </ul>
        </div>

        {/* Customer Care Column */}
        <div className="footer-col">
          <h4 className="footer-heading">Customer Care</h4>
          <ul className="footer-links">
            <li><span className="footer-text-item">🛡️ 2-Year Limited Hardware Warranty</span></li>
            <li><span className="footer-text-item">🔄 30-Day Free Returns & Refunds</span></li>
            <li><span className="footer-text-item">🚚 Express 2-Day Delivery (Orders $75+)</span></li>
            <li><span className="footer-text-item">🔒 256-Bit SSL Encrypted Checkout</span></li>
            <li><span className="footer-text-item">📦 Real-time Dispatch Tracking</span></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="footer-col">
          <h4 className="footer-heading">Stay Connected</h4>
          <p className="footer-newsletter-text">
            Subscribe for secret flash sales, product launch announcements, and exclusive coupons.
          </p>

          <form onSubmit={handleSubscribe} className="footer-newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="footer-email-input"
              aria-label="Email for newsletter subscription"
            />
            <button type="submit" className="footer-btn-subscribe">
              Join
            </button>
          </form>

          {subscribed && (
            <p className="newsletter-success-msg">
              🎉 Thank you for subscribing! Check your inbox for exclusive perks.
            </p>
          )}

          <div className="payment-badges-row">
            <span className="pay-badge">VISA</span>
            <span className="pay-badge">Mastercard</span>
            <span className="pay-badge">Apple Pay</span>
            <span className="pay-badge">Google Pay</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-content">
          <p>© {new Date().getFullYear()} AeroStore Technologies Inc. All rights reserved.</p>
          <div className="footer-legal-links">
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }}>Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
