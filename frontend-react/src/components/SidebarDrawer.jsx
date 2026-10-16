import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ROLE_CONFIG = {
  customer: { icon: '👤', label: 'Customer', color: '#818cf8', bg: 'rgba(99, 102, 241, 0.15)' },
  admin: { icon: '🛡️', label: 'Store Administrator', color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.15)' },
  delivery_partner: { icon: '🚚', label: 'Delivery Partner', color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)' },
  shipper: { icon: '📦', label: 'Warehouse Shipper', color: '#ea580c', bg: 'rgba(234, 88, 12, 0.15)' }
};

export function SidebarDrawer({
  isOpen,
  onClose,
  onNavigate,
  onOpenProfile,
  onSelectCategory
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const roleInfo = user ? (ROLE_CONFIG[user.role] || ROLE_CONFIG.customer) : null;

  const handleNav = (page, params) => {
    onClose();
    if (onNavigate) onNavigate(page, params);
  };

  const handleOpenUserProfile = () => {
    onClose();
    if (onOpenProfile) onOpenProfile();
  };

  return (
    <div className="sidebar-drawer-overlay open" onClick={onClose} role="dialog" aria-modal="true" aria-label="Sidebar Options Navigation">
      <div className="sidebar-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="sidebar-drawer-header">
          <div className="sidebar-drawer-brand">
            <div className="sidebar-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div>
              <h3 className="sidebar-brand-title">AeroStore</h3>
              <span className="sidebar-brand-sub">Navigation & Options</span>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
            &times;
          </button>
        </div>

        {/* User Profile Card in Sidebar */}
        <div className="sidebar-drawer-profile-section">
          {isAuthenticated ? (
            <div className="sidebar-user-card">
              <div className="sidebar-user-top">
                <div className="sidebar-avatar-circle" style={{ borderColor: roleInfo?.color }}>
                  {roleInfo?.icon}
                </div>
                <div className="sidebar-user-info">
                  <strong className="sidebar-user-name">{user.name}</strong>
                  <span className="sidebar-user-email">{user.email}</span>
                </div>
              </div>

              <div
                className="sidebar-role-pill"
                style={{ background: roleInfo?.bg, color: roleInfo?.color, border: `1px solid ${roleInfo?.color}44` }}
              >
                <span>{roleInfo?.icon}</span>
                <span>{roleInfo?.label}</span>
              </div>
            </div>
          ) : (
            <div className="sidebar-guest-card">
              <p className="sidebar-guest-text">Sign in to track orders, manage deliveries, or view admin analytics.</p>
              <div className="sidebar-guest-buttons">
                <button
                  className="sidebar-btn-login"
                  onClick={() => handleNav('auth', { tab: 'login' })}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role-Tailored Options Section */}
        {isAuthenticated && (
          <div className="sidebar-drawer-section">
            <div className="sidebar-section-header">
              <span className="sidebar-section-title">⚡ Profile Options & Actions</span>
            </div>
            <div className="sidebar-options-list">
              {user?.role === 'customer' && (
                <>
                  <button className="sidebar-option-item primary" onClick={() => handleNav('items')}>
                    <span className="sidebar-option-icon">🛍️</span>
                    <div className="sidebar-option-text">
                      <span className="sidebar-option-label">Explore Catalog</span>
                      <span className="sidebar-option-desc">Browse all products & offers</span>
                    </div>
                  </button>
                  <button className="sidebar-option-item" onClick={() => handleNav('cart')}>
                    <span className="sidebar-option-icon">🛒</span>
                    <div className="sidebar-option-text">
                      <span className="sidebar-option-label">Shopping Cart</span>
                      <span className="sidebar-option-desc">Checkout & saved items</span>
                    </div>
                    {itemCount > 0 && <span className="sidebar-count-badge">{itemCount}</span>}
                  </button>
                  <button className="sidebar-option-item" onClick={() => handleNav('dashboard')}>
                    <span className="sidebar-option-icon">📦</span>
                    <div className="sidebar-option-text">
                      <span className="sidebar-option-label">My Orders & Tracking</span>
                      <span className="sidebar-option-desc">Live shipment status</span>
                    </div>
                  </button>
                </>
              )}

              {user?.role === 'delivery_partner' && (
                <>
                  <button className="sidebar-option-item primary" onClick={() => handleNav('dashboard')}>
                    <span className="sidebar-option-icon">🚚</span>
                    <div className="sidebar-option-text">
                      <span className="sidebar-option-label">Dispatch Queue</span>
                      <span className="sidebar-option-desc">Manage pending deliveries</span>
                    </div>
                  </button>
                  <button className="sidebar-option-item" onClick={() => { onClose(); if (onOpenProfile) onOpenProfile('driver_details'); }}>
                    <span className="sidebar-option-icon">👤</span>
                    <div className="sidebar-option-text">
                      <span className="sidebar-option-label">Driver Profile</span>
                      <span className="sidebar-option-desc">Route zone & stats</span>
                    </div>
                  </button>
                  <button className="sidebar-option-item" onClick={() => handleNav('home')}>
                    <span className="sidebar-option-icon">🏠</span>
                    <div className="sidebar-option-text">
                      <span className="sidebar-option-label">Storefront</span>
                      <span className="sidebar-option-desc">Public store view</span>
                    </div>
                  </button>
                </>
              )}

              {user?.role === 'shipper' && (
                <>
                  <button className="sidebar-option-item primary" onClick={() => handleNav('dashboard')}>
                    <span className="sidebar-option-icon">📦</span>
                    <div className="sidebar-option-text">
                      <span className="sidebar-option-label">Warehouse Dispatch</span>
                      <span className="sidebar-option-desc">Manage outgoing orders</span>
                    </div>
                  </button>
                  <button className="sidebar-option-item" onClick={() => handleNav('restocker')}>
                    <span className="sidebar-option-icon">📊</span>
                    <div className="sidebar-option-text">
                      <span className="sidebar-option-label">Stock Restocker</span>
                      <span className="sidebar-option-desc">Adjust stock quantities</span>
                    </div>
                  </button>
                  <button className="sidebar-option-item" onClick={handleOpenUserProfile}>
                    <span className="sidebar-option-icon">👤</span>
                    <div className="sidebar-option-text">
                      <span className="sidebar-option-label">Shipper Profile</span>
                      <span className="sidebar-option-desc">Fulfillment credentials</span>
                    </div>
                  </button>
                </>
              )}

              {user?.role === 'admin' && (
                <>
                  <button className="sidebar-option-item primary" onClick={() => handleNav('dashboard')}>
                    <span className="sidebar-option-icon">📊</span>
                    <div className="sidebar-option-text">
                      <span className="sidebar-option-label">Analytics Dashboard</span>
                      <span className="sidebar-option-desc">Store KPIs & order logs</span>
                    </div>
                  </button>
                  <button className="sidebar-option-item" onClick={() => handleNav('items')}>
                    <span className="sidebar-option-icon">🛍️</span>
                    <div className="sidebar-option-text">
                      <span className="sidebar-option-label">Inventory Catalog</span>
                      <span className="sidebar-option-desc">Manage SKUs & pricing</span>
                    </div>
                  </button>
                  <button className="sidebar-option-item" onClick={handleOpenUserProfile}>
                    <span className="sidebar-option-icon">🛡️</span>
                    <div className="sidebar-option-text">
                      <span className="sidebar-option-label">Admin Profile</span>
                      <span className="sidebar-option-desc">System health & database</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="sidebar-drawer-footer">
          {isAuthenticated ? (
            <button
              className="sidebar-btn-signout"
              onClick={() => {
                onClose();
                logout();
              }}
            >
              🚪 Sign Out of Account
            </button>
          ) : (
            <div className="sidebar-footer-online">
              <span className="status-live-dot"></span>
              <span>Store & Logistics Online</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
