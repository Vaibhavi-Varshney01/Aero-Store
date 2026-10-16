import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function AuthPage({ onNavigate, initialTab = 'login' }) {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [tab, setTab] = useState(initialTab); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Demo accounts for 1-click login
  const demoAccounts = [
    { role: 'VIP Member', email: 'vip@aerostore.io', pass: 'password123', icon: '💎', desc: 'VIP Subscriber (Full Access)' },
    { role: 'Customer', email: 'customer@aerostore.io', pass: 'password123', icon: '👤', desc: 'Standard Shopper (Free Tier)' },
    { role: 'Admin', email: 'admin@aerostore.io', pass: 'admin123', icon: '🛡️', desc: 'System Manager' },
    { role: 'Delivery', email: 'driver@aerostore.io', pass: 'driver123', icon: '🚚', desc: 'Logistics Partner' },
    { role: 'Shipper', email: 'shipper@aerostore.io', pass: 'shipper123', icon: '📦', desc: 'Warehouse Stock Manager' }
  ];

  const handleDemoLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
    setLoading(true);
    const res = await login(demoEmail, demoPass);
    setLoading(false);
    if (res.success) {
      onNavigate('items');
    } else {
      setErrorMsg(res.error || 'Demo login failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (tab === 'login') {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        onNavigate('items');
      } else {
        setErrorMsg(res.error || 'Invalid credentials');
      }
    } else {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name');
        setLoading(false);
        return;
      }
      const res = await register(name, email, password, role);
      setLoading(false);
      if (res.success) {
        onNavigate('items');
      } else {
        setErrorMsg(res.error || 'Registration failed');
      }
    }
  };

  // If already authenticated
  if (isAuthenticated && user) {
    return (
      <div className="auth-page-container">
        <div className="auth-card-centered">
          <div className="auth-avatar-circle">
            <span className="auth-avatar-emoji">👋</span>
          </div>
          <h2>Welcome Back, {user.name}!</h2>
          <p className="auth-email-note">
            You are signed in as <strong>{user.email}</strong> with role{' '}
            <span className="auth-role-tag">{user.role?.toUpperCase()}</span>
          </p>

          <div className="auth-logged-in-actions">
            {user.role === 'admin' ? (
              <>
                <button className="btn-auth-primary" onClick={() => onNavigate('dashboard')}>
                  📊 Platform Analytics & Dashboard
                </button>
                <button className="btn-auth-secondary" onClick={() => onNavigate('items')}>
                  🛍️ Manage Inventory Catalog
                </button>
              </>
            ) : user.role === 'delivery_partner' ? (
              <>
                <button className="btn-auth-primary" onClick={() => onNavigate('dashboard')}>
                  🚚 Dispatch Command Center
                </button>
                <button className="btn-auth-secondary" onClick={() => onNavigate('home')}>
                  🏠 View Storefront
                </button>
              </>
            ) : (
              <>
                <button className="btn-auth-primary" onClick={() => onNavigate('items')}>
                  🛍️ Continue Shopping
                </button>
                <button className="btn-auth-secondary" onClick={() => onNavigate('cart')}>
                  🛒 View Cart
                </button>
                <button className="btn-auth-secondary" onClick={() => onNavigate('dashboard')}>
                  📦 My Orders
                </button>
              </>
            )}
            <button className="btn-auth-signout" onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-container">
      {/* Return to Store Navigation Link */}
      <div className="auth-nav-strip">
        <button className="btn-auth-back" onClick={() => onNavigate('home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Store</span>
        </button>
      </div>

      <div className="auth-split-layout">
        {/* Left Column: Brand & Member Value Showcase */}
        <div className="auth-hero-showcase">
          <div className="auth-brand-eyebrow">
            <span className="brand-dot"></span>
            <span>AEROSTORE SECURE MEMBER PORTAL</span>
          </div>

          <h1 className="auth-hero-headline">
            Experience the Future of <span className="gradient-text">Precision Electronics</span>
          </h1>

          <p className="auth-hero-subtext">
            Join our community of engineers, audio connoisseurs, and performance enthusiasts. Unlock exclusive benefits and instant express dispatch.
          </p>

          {/* Member Benefits List */}
          <div className="auth-benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon-box">⚡</div>
              <div>
                <strong>Express 2-Day Delivery</strong>
                <p>Free priority shipping on orders over $75 with live GPS tracking.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon-box">🛡️</div>
              <div>
                <strong>2-Year Replacement Warranty</strong>
                <p>Zero-deductible hardware replacement warranty on all products.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon-box">🎟️</div>
              <div>
                <strong>Exclusive Member Pricing</strong>
                <p>Instant 20% discount code with SAVE20 and early product drops.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon-box">🤖</div>
              <div>
                <strong>AI Concierge Assistant</strong>
                <p>24/7 intelligent hardware advisor trained on technical datasheets.</p>
              </div>
            </div>
          </div>

          {/* Verified Customer Quote Card */}
          <div className="auth-testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-quote">
              "AeroStore has the cleanest checkout, fastest delivery, and their flagship headphones are simply on another level."
            </p>
            <div className="testimonial-author">
              <span className="author-name">Alex Chen</span>
              <span className="author-role">• Audio Engineer & Verified Buyer</span>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="auth-form-column">
          <div className="auth-form-card">
            {/* Member Access Notice */}
            <div className="auth-access-banner">
              <span className="auth-access-icon">🔒</span>
              <div className="auth-access-text">
                <strong>Member Access Required</strong>
                <span>Please sign in or register to browse products, view full specifications, and shop.</span>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="auth-tabs-toggle">
              <button
                className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setTab('login');
                  setErrorMsg('');
                }}
              >
                Sign In
              </button>
              <button
                className={`auth-tab-btn ${tab === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setTab('register');
                  setErrorMsg('');
                }}
              >
                Create Account
              </button>
            </div>

            {/* Quick 1-Click Demo Accounts */}
            <div className="auth-demo-accounts-box">
              <div className="demo-accounts-title">
                <span>⚡ Quick Test / 1-Click Demo Login</span>
              </div>
              <div className="demo-buttons-row">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.role}
                    type="button"
                    className="btn-demo-account"
                    onClick={() => handleDemoLogin(acc.email, acc.pass)}
                    title={`Log in as ${acc.desc}`}
                    disabled={loading}
                  >
                    <span className="demo-icon">{acc.icon}</span>
                    <span className="demo-role-name">{acc.role}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="auth-divider-or">
              <span>or enter details manually</span>
            </div>

            {/* Error Message Box */}
            {errorMsg && (
              <div className="auth-error-alert" role="alert">
                <span className="alert-icon">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-actual-form">
              {/* If Register: Full Name */}
              {tab === 'register' && (
                <div className="form-field-group">
                  <label htmlFor="auth-name" className="field-label">Full Name</label>
                  <div className="field-input-wrap">
                    <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      id="auth-name"
                      type="text"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="form-field-group">
                <label htmlFor="auth-email" className="field-label">Email Address</label>
                <div className="field-input-wrap">
                  <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    id="auth-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-field-group">
                <div className="field-label-row">
                  <label htmlFor="auth-pass" className="field-label">Password</label>
                  {tab === 'login' && (
                    <a
                      href="#forgot"
                      className="field-forgot-link"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('To reset your password, please contact support@aerostore.io or use one of the 1-click demo logins above.');
                      }}
                    >
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="field-input-wrap">
                  <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="auth-pass"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="field-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Register Role Selector */}
              {tab === 'register' && (
                <div className="form-field-group">
                  <label className="field-label">Account Role</label>
                  <div className="role-selector-grid">
                    <label className={`role-pill-option ${role === 'customer' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="auth-role"
                        value="customer"
                        checked={role === 'customer'}
                        onChange={(e) => setRole(e.target.value)}
                      />
                      <span className="role-opt-icon">👤</span>
                      <span className="role-opt-title">Customer</span>
                      <small style={{ fontSize: '0.72rem', opacity: 0.8, display: 'block' }}>Personal / Business (Can Buy)</small>
                    </label>

                    <label className={`role-pill-option ${role === 'delivery_partner' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="auth-role"
                        value="delivery_partner"
                        checked={role === 'delivery_partner'}
                        onChange={(e) => setRole(e.target.value)}
                      />
                      <span className="role-opt-icon">🚚</span>
                      <span className="role-opt-title">Delivery</span>
                      <small style={{ fontSize: '0.72rem', opacity: 0.8, display: 'block' }}>Logistics Partner</small>
                    </label>

                    <label className={`role-pill-option ${role === 'admin' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="auth-role"
                        value="admin"
                        checked={role === 'admin'}
                        onChange={(e) => setRole(e.target.value)}
                      />
                      <span className="role-opt-icon">🛡️</span>
                      <span className="role-opt-title">Admin</span>
                      <small style={{ fontSize: '0.72rem', opacity: 0.8, display: 'block' }}>Management (No Buy)</small>
                    </label>

                    <label className={`role-pill-option ${role === 'shipper' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="auth-role"
                        value="shipper"
                        checked={role === 'shipper'}
                        onChange={(e) => setRole(e.target.value)}
                      />
                      <span className="role-opt-icon">📦</span>
                      <span className="role-opt-title">Shipper</span>
                      <small style={{ fontSize: '0.72rem', opacity: 0.8, display: 'block' }}>Warehouse Inventory (Stock Control)</small>
                    </label>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn-auth-submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading-text">
                    <span className="btn-spinner"></span> Authenticating...
                  </span>
                ) : tab === 'login' ? (
                  <span>Sign In to Account →</span>
                ) : (
                  <span>Complete Registration →</span>
                )}
              </button>
            </form>

            {/* Bottom Footer Note */}
            <div className="auth-card-footer">
              {tab === 'login' ? (
                <p>
                  New to AeroStore?{' '}
                  <button className="auth-link-text" onClick={() => setTab('register')}>
                    Create an account
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button className="auth-link-text" onClick={() => setTab('login')}>
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
