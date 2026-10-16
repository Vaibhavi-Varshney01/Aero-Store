import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function AuthModal() {
  const { isAuthModalOpen, authModalTab, closeAuthModal, login, register } = useAuth();

  const [tab, setTab] = useState(authModalTab || 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTab(authModalTab || 'login');
    setError(null);
  }, [authModalTab, isAuthModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) closeAuthModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleFillDemo = (targetRole) => {
    setTab('login');
    if (targetRole === 'admin') {
      setEmail('admin@example.com');
      setPassword('admin123');
    } else if (targetRole === 'delivery_partner') {
      setEmail('delivery@example.com');
      setPassword('delivery123');
    } else if (targetRole === 'shipper') {
      setEmail('shipper@aerostore.io');
      setPassword('shipper123');
    } else {
      setEmail('jane.doe@example.com');
      setPassword('password123');
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (tab === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error);
      }
    } else {
      const res = await register(name, email, password, role);
      if (!res.success) {
        setError(res.error);
      }
    }
    setSubmitting(false);
  };

  return (
    <div
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      aria-label="Role-Based User Authentication"
    >
      <div className="modal-card auth-modal-card">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span style={{ fontSize: '1.5rem' }}>🔐</span>
            <div>
              <h3>{tab === 'login' ? 'Role-Based Sign In' : 'Create Account'}</h3>
              <p className="modal-subtitle">
                {tab === 'login' ? 'Sign in as Customer, Admin, or Delivery Partner' : 'Select your role and create your AeroStore account'}
              </p>
            </div>
          </div>
          <button
            className="btn-close-icon"
            onClick={closeAuthModal}
            aria-label="Close authentication modal"
          >
            &times;
          </button>
        </div>

        {/* Demo Accounts Quick Fill Panel */}
        <div className="demo-auth-banner" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="demo-auth-text">
            <span>✨ Test Role Accounts:</span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-demo-fill"
              onClick={() => handleFillDemo('customer')}
            >
              👤 Customer
            </button>
            <button
              type="button"
              className="btn-demo-fill"
              style={{ backgroundColor: '#4f46e5', color: '#fff' }}
              onClick={() => handleFillDemo('admin')}
            >
              🛡️ Admin
            </button>
            <button
              type="button"
              className="btn-demo-fill"
              style={{ backgroundColor: '#059669', color: '#fff' }}
              onClick={() => handleFillDemo('delivery_partner')}
            >
              🚚 Delivery Partner
            </button>
            <button
              type="button"
              className="btn-demo-fill"
              style={{ backgroundColor: '#ea580c', color: '#fff' }}
              onClick={() => handleFillDemo('shipper')}
            >
              📦 Shipper
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(null); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(null); }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div role="alert" className="checkout-error-banner" style={{ margin: '0 0 1rem' }}>
            <div className="error-title">⚠️ Authentication Error</div>
            <div className="error-desc">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {tab === 'register' && (
            <>
              <div className="form-group">
                <label htmlFor="auth-name">Full Name</label>
                <input
                  type="text"
                  id="auth-name"
                  className="form-control"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="auth-role">Account Role</label>
                <select
                  id="auth-role"
                  className="form-control"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="customer">👤 Customer (Personal / Business Account — Direct Purchasing Enabled)</option>
                  <option value="admin">🛡️ Administrator (System Operations — Store Management Only, Purchasing Disabled)</option>
                  <option value="delivery_partner">🚚 Delivery Partner (Logistics & Route Dispatch)</option>
                  <option value="shipper">📦 Shipper (Warehouse Inventory Restock & Stock Level Management)</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Email Address</label>
            <input
              type="email"
              id="auth-email"
              className="form-control"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              type="password"
              id="auth-password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-checkout"
            style={{ marginTop: '1rem' }}
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : tab === 'login' ? 'Sign In to AeroStore' : `Create ${role.replace('_', ' ').toUpperCase()} Account`}
          </button>
        </form>
      </div>
    </div>
  );
}
