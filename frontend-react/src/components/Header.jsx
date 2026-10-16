import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AdminAvatar, { getCleanAdminAvatar } from './AdminAvatar';

const ROLE_CONFIG = {
  customer: { icon: '👤', label: 'Customer', color: '#818cf8' },
  admin: { icon: '🛡️', label: 'Admin', color: '#fbbf24' },
  delivery_partner: { icon: '🚚', label: 'Delivery', color: '#34d399' },
  shipper: { icon: '📦', label: 'Shipper', color: '#ea580c' }
};

export function Header({
  activePage,
  onNavigate,
  searchQuery,
  onSearchChange,
  products = [],
  onSelectCategory,
  onOpenProfile,
  onOpenUseCases,
  onToggleSidebar,
  theme = 'dark',
  onToggleTheme
}) {
  const { itemCount, openCart } = useCart();
  const { user, isAuthenticated, logout, login } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef(null);
  const searchWrapRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute matching products for live instant search dropdown
  const searchResults = useMemo(() => {
    if (!searchQuery || !searchQuery.trim() || !products.length) return [];
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }).slice(0, 5);
  }, [searchQuery, products]);

  // Global shortcut (Ctrl+K or Cmd+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (!isAuthenticated) {
          if (onNavigate) onNavigate('auth', { tab: 'login' });
          return;
        }
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, onNavigate]);

  const roleInfo = user ? (ROLE_CONFIG[user.role] || ROLE_CONFIG.customer) : null;
  const userAvatarId = user?.role === 'admin'
    ? getCleanAdminAvatar(localStorage.getItem('aerostore_admin_avatar'))
    : user?.role === 'shipper'
    ? getCleanAdminAvatar(localStorage.getItem('aerostore_shipper_avatar'))
    : (user?.role === 'delivery_partner' || user?.role === 'delivery')
    ? getCleanAdminAvatar(localStorage.getItem('aerostore_delivery_avatar'))
    : null;

  const displayName = user?.role === 'admin'
    ? (localStorage.getItem('aerostore_admin_name') || user.name || 'Alex Morgan')
    : user?.role === 'shipper'
    ? (localStorage.getItem('aerostore_shipper_name') || user.name || 'Marcus Vance')
    : (user?.role === 'delivery_partner' || user?.role === 'delivery')
    ? (localStorage.getItem('aerostore_delivery_name') || user.name || 'John Doe')
    : user?.name;

  const handleSearchFocusOrType = (val) => {
    if (!isAuthenticated) {
      if (onNavigate) onNavigate('auth', { tab: 'login' });
      return;
    }
    if (onSearchChange) onSearchChange(val);
    setIsSearchOpen(Boolean(val && val.trim()));
    if (activePage !== 'items' && onNavigate) {
      onNavigate('items');
    }
  };

  return (
    <header className="site-header" role="banner">
      {/* Top Announcement Bar - Covers Everything Across the Top */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <div className="announcement-col announcement-col-left">
            <span>✨ <strong>Autumn Flash Sale:</strong> 20% off with code <code className="announcement-code">SAVE20</code></span>
          </div>
          <div className="announcement-col announcement-col-center">
            <span>🚚 Free Express 2-Day Shipping on orders over ₹499</span>
          </div>
          <div className="announcement-col announcement-col-right">
            <span>🛡️ 2-Year Warranty</span>
            <span className="announcement-divider">•</span>
            <span>⚡ 24/7 Support</span>
          </div>
        </div>
      </div>

      <div className="nav-container">
        {/* Sidebar Toggle & Brand Logo */}
        <div className="nav-left-group">
          {onToggleSidebar && (
            <button
              className="btn-sidebar-toggle-header"
              onClick={onToggleSidebar}
              aria-label="Toggle Options Sidebar"
              title="Open Navigation & Options Sidebar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <span className="sidebar-toggle-text">Options</span>
            </button>
          )}

          <button
            className="brand-logo-btn"
            onClick={() => onNavigate && onNavigate('home')}
            aria-label="AeroStore Home"
          >
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div className="brand-title-wrap">
              <span className="brand-name">AeroStore</span>
              <span className="brand-badge-direct">FLAGSHIP</span>
            </div>
          </button>
        </div>

        {/* Search Bar - Covers the Upper Bar Center Fully */}
        <div className="search-bar-wrap" ref={searchWrapRef}>
          <svg className="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={searchInputRef}
            type="search"
            id="search-input"
            className="search-input"
            placeholder={
              user?.role === 'admin'
                ? 'Search catalog products, SKUs, inventory stocks...'
                : user?.role === 'delivery_partner'
                ? 'Search dispatch orders, tracking numbers, customer destinations...'
                : user?.role === 'shipper'
                ? 'Search product to restock, inspect units, or view SKU...'
                : 'Search products, audio, mechanical keyboards, monitors...'
            }
            aria-label="Search catalog products"
            value={searchQuery}
            onChange={(e) => handleSearchFocusOrType(e.target.value)}
            onFocus={() => {
              if (!isAuthenticated) {
                if (onNavigate) onNavigate('auth', { tab: 'login' });
                return;
              }
              if (searchQuery && searchQuery.trim()) setIsSearchOpen(true);
              if (activePage !== 'items' && searchQuery) onNavigate && onNavigate('items');
            }}
          />

          {/* Instant Search Results Dropdown - Shows product right at the top for Shipper */}
          {isSearchOpen && searchQuery && searchQuery.trim() && (
            <div className="header-search-dropdown" role="listbox">
              <div className="search-dropdown-header">
                <span className="search-dropdown-header-title">
                  ⚡ Matching Products ({searchResults.length})
                </span>
                <button
                  type="button"
                  className="search-dropdown-close-btn"
                  onClick={() => setIsSearchOpen(false)}
                  aria-label="Close search preview"
                >
                  ✕
                </button>
              </div>

              {searchResults.length > 0 ? (
                <div className="search-dropdown-list">
                  {searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      className="search-dropdown-item"
                      onClick={() => {
                        setIsSearchOpen(false);
                        if (onSearchChange) onSearchChange(prod.name);
                        if (onNavigate) onNavigate('items');
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      role="option"
                      tabIndex={0}
                    >
                      <img src={prod.image_url} alt={prod.name} className="search-dropdown-thumb" />
                      <div className="search-dropdown-details">
                        <strong className="search-dropdown-name">{prod.name}</strong>
                        <span className="search-dropdown-category">{prod.category}</span>
                      </div>
                      <div className="search-dropdown-status">
                        <span className="search-dropdown-price">₹{Number(prod.price).toFixed(2)}</span>
                        <span className={`search-dropdown-stock-tag ${prod.stock <= 0 ? 'empty' : prod.stock <= 2 ? 'low' : 'good'}`}>
                          {prod.stock <= 0 ? '🔴 Out of stock' : `🟢 ${prod.stock} in stock`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="search-dropdown-empty">
                  <span>No products found matching "{searchQuery}"</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Header Actions - Tailored to the Active Profile */}
        <div className="nav-actions">
          {/* AeroMinutes 10-Min Delivery Quick Action */}
          <button
            className="nav-link-btn aerominutes-nav-pill"
            onClick={() => onNavigate && onNavigate('items', { category: 'Cafe & Beverages' })}
            title="AeroMinutes: Fast 10-Minute Delivery from AeroCafe"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(234, 88, 12, 0.25))',
              border: '1px solid rgba(249, 115, 22, 0.4)',
              color: '#f97316',
              fontWeight: 600
            }}
          >
            <span className="nav-tab-icon">⚡</span>
            <span>AeroMinutes</span>
          </button>

          {/* VIP Catalog Quick Link */}
          <button
            className="nav-link-btn"
            onClick={() => onNavigate && onNavigate('items', { category: 'VIP_Exclusive' })}
            title="VIP Subscriber Exclusive Collection"
            style={{
              background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(245, 158, 11, 0.25))',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#fbbf24',
              fontWeight: 600
            }}
          >
            <span className="nav-tab-icon">💎</span>
            <span>VIP Catalog</span>
          </button>

          {/* Action Button: My Orders for Customers / Dashboard for Guests */}
          {(!isAuthenticated || user?.role === 'customer') && (
            <button
              className={`nav-link-btn ${activePage === 'dashboard' ? 'active' : ''}`}
              onClick={() => onNavigate && onNavigate('dashboard')}
              title={isAuthenticated ? 'View My Orders & History' : 'View Store Analytics & Health'}
            >
              <span className="nav-tab-icon">{isAuthenticated ? '📦' : '📊'}</span>
              <span>{isAuthenticated ? 'My Orders' : 'Dashboard'}</span>
            </button>
          )}

          {/* User Account / Profile Dropdown Menu */}
          {isAuthenticated ? (
            <div className="user-profile-menu-wrap" ref={menuRef}>
              <button
                className="user-profile-pill"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="User account and profile menu"
                aria-haspopup="true"
                title={`${user.name} (${roleInfo?.label}) — Profile & Settings`}
              >
                {(user?.role === 'admin' || user?.role === 'shipper' || user?.role === 'delivery_partner' || user?.role === 'delivery') ? (
                  <span className="user-admin-avatar-mini" style={{ marginRight: '0.4rem', display: 'inline-flex', alignItems: 'center' }}>
                    <AdminAvatar avatarId={userAvatarId} size={22} />
                  </span>
                ) : (
                  <span className="user-avatar-dot" style={{ background: roleInfo?.color }}></span>
                )}
                <span className="user-profile-name">{displayName}</span>
                <span
                  className="header-role-badge"
                  style={{ background: `${roleInfo?.color}22`, color: roleInfo?.color, border: `1px solid ${roleInfo?.color}44` }}
                >
                  <span className="role-badge-icon">{roleInfo?.icon}</span>
                  <span className="role-badge-text">{roleInfo?.label}</span>
                </span>
                <span className="user-dropdown-arrow">▼</span>
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown-card">
                  <div className="dropdown-user-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {(user?.role === 'admin' || user?.role === 'shipper' || user?.role === 'delivery_partner' || user?.role === 'delivery') && <AdminAvatar avatarId={userAvatarId} size={30} />}
                      <strong>{displayName}</strong>
                    </div>
                    <span className="dropdown-email">{user.email}</span>
                    <span
                      className="dropdown-role-tag"
                      style={{ background: `${roleInfo?.color}18`, color: roleInfo?.color }}
                    >
                      {roleInfo?.icon} {roleInfo?.label}
                    </span>
                  </div>
                  <div className="dropdown-divider"></div>

                  {/* Profile-Tailored Dropdown Options */}
                  {user?.role === 'admin' && (
                    <button
                      className="dropdown-item-btn"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onOpenProfile) onOpenProfile();
                      }}
                    >
                      🛡️ System Admin Profile
                    </button>
                  )}

                  {user?.role === 'shipper' && (
                    <button
                      className="dropdown-item-btn"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onOpenProfile) onOpenProfile();
                      }}
                    >
                      📦 Shipper Profile
                    </button>
                  )}

                  {user?.role === 'delivery_partner' && (
                    <>
                      <button
                        className="dropdown-item-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onOpenProfile) onOpenProfile('driver_details');
                        }}
                      >
                        👤 Delivery Driver Profile
                      </button>
                      <button
                        className="dropdown-item-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onNavigate) onNavigate('dashboard');
                        }}
                      >
                        🚚 Active Dispatch Board
                      </button>
                    </>
                  )}

                  {user?.role === 'customer' && (
                    <>
                      <button
                        className="dropdown-item-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onOpenProfile) onOpenProfile();
                        }}
                      >
                        👤 My Customer Profile
                      </button>
                      <button
                        className="dropdown-item-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onNavigate) onNavigate('dashboard');
                        }}
                      >
                        📦 My Orders & Tracking
                      </button>
                      <button
                        className="dropdown-item-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onNavigate) onNavigate('cart');
                        }}
                      >
                        🛒 My Shopping Cart
                      </button>
                    </>
                  )}

                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item-btn sign-out"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="header-auth-buttons">
              <button
                className={`btn-signin-nav ${activePage === 'auth' ? 'active' : ''}`}
                onClick={() => onNavigate && onNavigate('auth', { tab: 'login' })}
                aria-label="Sign In to your account"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Sign In</span>
              </button>
            </div>
          )}

          {/* Cart Trigger (Only for customers and unauthenticated guests) */}
          {(!isAuthenticated || user?.role === 'customer') && (
            <button
              id="btn-open-cart"
              className={`btn-cart-nav ${activePage === 'cart' ? 'active' : ''}`}
              onClick={() => onNavigate && onNavigate('cart')}
              aria-label={`Open Cart (${itemCount} items)`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Cart</span>
              {itemCount > 0 && <span id="cart-badge-count" className="cart-badge">{itemCount}</span>}
            </button>
          )}

          {/* Role Status Indicators for Admin & Delivery Partner */}
          {isAuthenticated && user?.role === 'admin' && (
            <div className="header-status-indicator admin-status-indicator" title="Store Operations Online">
              <span className="status-live-dot"></span>
              <span>Store Online</span>
            </div>
          )}

          {/* Trendy Dark / Light Mode Toggle Button */}
          {onToggleTheme && (
            <button
              type="button"
              id="btn-theme-toggle"
              className="theme-toggle-btn"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                  <span>Light</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  <span>Dark</span>
                </>
              )}
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
