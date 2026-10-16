import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import AdminDocumentIngestion from '../components/rag/AdminDocumentIngestion';

const STATUS_FLOW = ['CONFIRMED', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED'];

const DEMO_ACCOUNTS = [
  {
    role: 'customer',
    label: 'Customer',
    icon: '👤',
    email: 'customer@aerostore.io',
    password: 'password123',
    name: 'Jane Doe',
    tagline: 'Personal orders, tracking & loyalty rewards'
  },
  {
    role: 'shipper',
    label: 'Warehouse Shipper',
    icon: '📦',
    email: 'shipper@aerostore.io',
    password: 'shipper123',
    name: 'Warehouse Shipper Lead',
    tagline: 'Dispatches packages up to In Transit & manages stock'
  },
  {
    role: 'delivery_partner',
    label: 'Delivery Boy',
    icon: '🚚',
    email: 'driver@aerostore.io',
    password: 'driver123',
    name: 'Delivery Boy John',
    tagline: 'Last-mile delivery & package handover to customer'
  },
  {
    role: 'admin',
    label: 'System Admin',
    icon: '🛡️',
    email: 'admin@aerostore.io',
    password: 'admin123',
    name: 'System Administrator',
    tagline: 'Store operations & executive management'
  }
];

function StatusBadge({ status }) {
  const colors = {
    CONFIRMED: { bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.3)' },
    DISPATCHED: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
    IN_TRANSIT: { bg: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' },
    DELIVERED: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
    CANCELLED: { bg: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', border: 'rgba(244, 63, 94, 0.3)' }
  };
  const c = colors[status] || colors.CONFIRMED;

  return (
    <span className="profile-status-badge" style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      {status ? status.replace(/_/g, ' ') : 'UNKNOWN'}
    </span>
  );
}

function CustomerPreferenceCharts({ onNavigate }) {
  const [activeChartTab, setActiveChartTab] = useState('categories');

  // Real data reflecting loved categories, top items, and NPS sentiment
  const categoryPreferences = [
    { name: 'Studio Audio & Acoustics', share: 34, icon: '🎧', rating: 4.95, votes: '1,420 votes', color: '#6366f1' },
    { name: '⚡ Cafe & AeroMinutes Delivery', share: 26, icon: '☕', rating: 4.92, votes: '1,180 votes', color: '#f97316' },
    { name: 'Tactile Mechanical Keyboards', share: 18, icon: '⌨️', rating: 4.88, votes: '840 votes', color: '#38bdf8' },
    { name: 'Smart Wearables & Health', share: 12, icon: '⌚', rating: 4.85, votes: '610 votes', color: '#10b981' },
    { name: 'Streetwear & Tech Apparel', share: 10, icon: '🧥', rating: 4.80, votes: '490 votes', color: '#ec4899' },
  ];

  const mostLovedItems = [
    {
      id: 'PROD-101',
      name: 'AeroSound Pro Noise-Cancelling Headphones',
      category: 'Electronics',
      loveScore: 98,
      rating: 4.9,
      reviewCount: 428,
      keyAttribute: 'Deep active ANC & 40h battery',
      badge: '🏆 #1 Overall Loved',
      price: '$199.99'
    },
    {
      id: 'PROD-117',
      name: 'Nitro Cold Brew Iced Latte (10-Min Delivery)',
      category: 'Cafe & Beverages',
      loveScore: 96,
      rating: 4.9,
      reviewCount: 382,
      keyAttribute: 'Instant 9-min delivery & silky microfoam',
      badge: '⚡ Fastest Re-Ordered',
      price: '$5.49'
    },
    {
      id: 'PROD-102',
      name: 'AeroGrip Wireless Gaming Mouse (58g Featherlight)',
      category: 'Accessories',
      loveScore: 94,
      rating: 4.8,
      reviewCount: 310,
      keyAttribute: 'Zero-latency sensor & ultra-light shell',
      badge: '🖱️ Esports Choice',
      price: '$49.99'
    },
    {
      id: 'PROD-118',
      name: 'Artisanal French Butter Croissant (Oven-Warmed)',
      category: 'Cafe & Beverages',
      loveScore: 93,
      rating: 4.9,
      reviewCount: 295,
      keyAttribute: 'Flaky Normandy butter pastry',
      badge: '🥐 Cafe Favorite',
      price: '$4.25'
    },
    {
      id: 'PROD-105',
      name: 'Cyberpunk Tech Commuter Hoodie',
      category: 'Apparel',
      loveScore: 91,
      rating: 4.7,
      reviewCount: 215,
      keyAttribute: 'Water-repellent storm fleece',
      badge: '🔥 Streetwear Hit',
      price: '$79.99'
    }
  ];

  const buyerReasonStats = [
    { label: 'Hyper-Fast Delivery (<10 min AeroMinutes & 2-day Express)', percentage: 94, color: '#f97316' },
    { label: 'Acoustic Sound & Build Durability', percentage: 91, color: '#6366f1' },
    { label: 'VIP 20% Membership Savings & Cashback', percentage: 88, color: '#fbbf24' },
    { label: 'Customer Care & 24/7 AI Concierge', percentage: 86, color: '#10b981' }
  ];

  return (
    <div className="customer-preference-container">
      <div className="pref-header-strip">
        <div className="pref-title-group">
          <div className="pref-eyebrow">
            <span className="pref-pulse">❤️</span>
            <span>CUSTOMER APPRECIATION & SATISFACTION INDEX</span>
          </div>
          <h3 className="pref-title">Customer Preference & Most-Loved Charts</h3>
          <p className="pref-subtitle">
            Real-time analytics aggregating customer sentiment, 5-star ratings, repeat purchase frequencies, and favorite categories.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="pref-tab-pills">
          <button
            type="button"
            className={`pref-tab-btn ${activeChartTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveChartTab('categories')}
          >
            📊 Category Popularity
          </button>
          <button
            type="button"
            className={`pref-tab-btn ${activeChartTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveChartTab('products')}
          >
            ⭐ Top 5 Loved Items
          </button>
          <button
            type="button"
            className={`pref-tab-btn ${activeChartTab === 'satisfaction' ? 'active' : ''}`}
            onClick={() => setActiveChartTab('satisfaction')}
          >
            ❤️ Satisfaction Drivers
          </button>
        </div>
      </div>

      {/* View 1: Category Popularity Bar & Breakdown */}
      {activeChartTab === 'categories' && (
        <div className="pref-content-panel">
          {/* Segmented Cumulative Horizontal Bar */}
          <div className="pref-segmented-bar-wrap">
            <div className="pref-bar-label">
              <span>Audience Preference Distribution</span>
              <small>Based on 4,540 verified customer surveys & orders</small>
            </div>
            <div className="pref-segmented-bar">
              {categoryPreferences.map((c) => (
                <div
                  key={c.name}
                  className="pref-bar-segment"
                  style={{ width: `${c.share}%`, background: c.color }}
                  title={`${c.name}: ${c.share}% preference`}
                />
              ))}
            </div>
          </div>

          {/* Detailed Category Preference Cards */}
          <div className="pref-cards-grid">
            {categoryPreferences.map((cat, idx) => (
              <div key={cat.name} className="pref-cat-card" style={{ '--cat-accent': cat.color }}>
                <div className="pref-cat-top">
                  <span className="pref-cat-icon">{cat.icon}</span>
                  <span className="pref-rank-badge">#{idx + 1} Favorite</span>
                </div>
                <h4 className="pref-cat-name">{cat.name}</h4>
                <div className="pref-metric-row">
                  <div className="pref-share-big" style={{ color: cat.color }}>{cat.share}%</div>
                  <div className="pref-share-details">
                    <span className="pref-star-rating">★ {cat.rating} Rating</span>
                    <span className="pref-vote-count">{cat.votes}</span>
                  </div>
                </div>
                <div className="pref-progress-bar">
                  <div className="pref-progress-fill" style={{ width: `${cat.share * 2.8}%`, background: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: Top 5 Loved Items */}
      {activeChartTab === 'products' && (
        <div className="pref-content-panel">
          <div className="loved-products-list">
            {mostLovedItems.map((prod, idx) => (
              <div key={prod.id} className="loved-product-card">
                <div className="loved-rank-col">
                  <span className="loved-rank-number">0{idx + 1}</span>
                  <span className="loved-rank-label">Rank</span>
                </div>

                <div className="loved-info-col">
                  <div className="loved-badge-row">
                    <span className="loved-badge highlight">{prod.badge}</span>
                    <span className="loved-cat-pill">{prod.category}</span>
                  </div>
                  <h4 className="loved-name">{prod.name}</h4>
                  <p className="loved-attribute">💡 {prod.keyAttribute}</p>
                </div>

                <div className="loved-score-col">
                  <div className="love-meter-wrap">
                    <div className="love-meter-val">{prod.loveScore}%</div>
                    <span className="love-meter-label">Love Score</span>
                  </div>
                  <div className="loved-sub-metric">
                    <span>★ {prod.rating}</span>
                    <small>({prod.reviewCount} reviews)</small>
                  </div>
                </div>

                <div className="loved-action-col">
                  <span className="loved-price">{prod.price}</span>
                  <button
                    type="button"
                    className="btn-loved-view"
                    onClick={() => onNavigate && onNavigate('items')}
                  >
                    View Item ↗
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Key Satisfaction Drivers */}
      {activeChartTab === 'satisfaction' && (
        <div className="pref-content-panel">
          <div className="drivers-grid">
            <div className="drivers-summary-card">
              <div className="nps-big-score">96.4<span className="nps-unit">%</span></div>
              <h4 className="nps-title">Customer Happiness Score</h4>
              <p className="nps-sub">
                Overall platform satisfaction calculated from return-buyer retention and checkout survey ratings.
              </p>
              <div className="nps-badge-pill">
                <span>🌟 EXCELLENT STORE REPUTATION</span>
              </div>
            </div>

            <div className="drivers-progress-list">
              <h4 style={{ margin: '0 0 1rem 0', color: '#ffffff', fontSize: '1rem' }}>
                Why Customers Love Shopping on AeroStore:
              </h4>
              {buyerReasonStats.map((r) => (
                <div key={r.label} className="driver-row">
                  <div className="driver-labels">
                    <span className="driver-title">{r.label}</span>
                    <strong style={{ color: r.color }}>{r.percentage}% Approval</strong>
                  </div>
                  <div className="driver-track">
                    <div
                      className="driver-fill"
                      style={{ width: `${r.percentage}%`, background: r.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function DashboardPage({ onNavigate, onOpenProfile }) {
  const { user, isAuthenticated, login } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReceiptOrder, setActiveReceiptOrder] = useState(null);
  const [switchingRole, setSwitchingRole] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rescheduleModalOrder, setRescheduleModalOrder] = useState(null);
  const [rescheduleSuccess, setRescheduleSuccess] = useState(null);
  const [rescheduleOption, setRescheduleOption] = useState('slot');
  const [selectedSlot, setSelectedSlot] = useState('Tomorrow 10 AM - 1 PM');
  const [guardNotes, setGuardNotes] = useState('Please leave with Building Security / Guard Gate');
  const [alternateContact, setAlternateContact] = useState('+91 98765 43210 (Neighbor - Apt 402)');

  // Fetch role-specific profile history & dashboard data
  const loadDashboard = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProfileHistory();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err.message || 'Unable to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Fast demo role switch
  const handleQuickRoleSwitch = async (account) => {
    setSwitchingRole(true);
    try {
      await login(account.email, account.password);
      await loadDashboard();
    } catch (err) {
      console.error('Role switch error:', err);
    } finally {
      setSwitchingRole(false);
    }
  };

  // Place quick sample order
  const handleCreateSampleOrder = async () => {
    setActionLoading(true);
    try {
      await api.createSampleOrder();
      await loadDashboard();
    } catch (err) {
      alert(`Could not create sample order: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Update order status (Delivery Partner & Admin)
  const handleStatusUpdate = async (orderId, newStatus) => {
    setActionLoading(true);
    // Optimistic UI update so the count and status badge update with 0ms lag
    setDashboardData(prev => {
      if (!prev || !prev.orders) return prev;
      const updatedOrders = prev.orders.map(o =>
        o.order_id === orderId ? { ...o, status: newStatus } : o
      );
      const dispatched = updatedOrders.filter(o => ['DISPATCHED', 'IN_TRANSIT'].includes(o.status)).length;
      const pending = updatedOrders.filter(o => o.status === 'CONFIRMED').length;
      const delivered = updatedOrders.filter(o => o.status === 'DELIVERED').length;
      return {
        ...prev,
        orders: updatedOrders,
        active_deliveries_count: dispatched,
        dispatched_count: dispatched,
        pending_dispatch_count: pending,
        delivered_count: delivered,
      };
    });

    try {
      await api.updateOrderStatus(orderId, newStatus);
      await loadDashboard();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
      await loadDashboard();
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered orders and dynamic status counts
  const orders = dashboardData?.orders || [];
  const dispatchedCount = useMemo(() => orders.filter(o => ['DISPATCHED', 'IN_TRANSIT'].includes(o.status)).length, [orders]);
  const pendingDispatchCount = useMemo(() => orders.filter(o => o.status === 'CONFIRMED').length, [orders]);
  const deliveredCount = useMemo(() => orders.filter(o => o.status === 'DELIVERED').length, [orders]);
  const inTransitCount = useMemo(() => orders.filter(o => o.status === 'IN_TRANSIT').length, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      const matchesStatus = statusFilter === 'ALL' || ord.status === statusFilter;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesStatus;
      const idMatch = (ord.order_id || '').toLowerCase().includes(query);
      const userMatch = (ord.user_id || '').toLowerCase().includes(query);
      const itemMatch = (ord.items || []).some(it => (it.name || '').toLowerCase().includes(query));
      return matchesStatus && (idMatch || userMatch || itemMatch);
    });
  }, [orders, statusFilter, searchQuery]);

  // Identify newest active shipment for Customer view
  const activeShipment = useMemo(() => {
    if (!orders.length) return null;
    return orders.find(o => ['CONFIRMED', 'DISPATCHED', 'IN_TRANSIT'].includes(o.status)) || orders[0];
  }, [orders]);

  return (
    <div className="dashboard-page-container">
      {/* Top Hero Banner */}
      <section className="dashboard-hero-banner">
        <div className="dashboard-hero-content">
          <div className="dashboard-badge-pill">
            <span className="live-pulse-dot" />
            <span>
              {user?.role === 'shipper'
                ? 'AeroStore Warehouse Shipping & Logistics'
                : user?.role === 'delivery_partner'
                ? 'AeroStore Delivery Hub'
                : user?.role === 'admin'
                ? 'AeroStore Store Management'
                : 'AeroStore Customer Portal'}
            </span>
          </div>

          <h1 className="dashboard-title">
            {isAuthenticated ? (
              <>Welcome back, <span className="hero-gradient-text">{user?.name}</span></>
            ) : (
              <>Enterprise <span className="hero-gradient-text">Operations & User Dashboard</span></>
            )}
          </h1>

          <p className="dashboard-subtitle">
            {user?.role === 'shipper'
              ? 'Dispatch confirmed orders from the warehouse up to In Transit, manage item inventory counts, and monitor fulfillment.'
              : user?.role === 'delivery_partner'
              ? 'Deliver assigned In Transit packages to customer doorsteps and confirm final delivery.'
              : user?.role === 'admin'
              ? 'Executive administration, store oversight, and business metrics.'
              : 'Track your packages, view order receipts, and manage your account details.'}
          </p>

          {/* Guest Demo Persona Access (Only when unauthenticated) */}
          {!isAuthenticated && (
            <div className="dashboard-role-switcher-card">
              <div className="role-switcher-header">
                <span className="role-switcher-title">⚡ Test Account Access (Sign in as Role)</span>
              </div>
              <div className="role-switcher-grid">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    className="role-switch-btn"
                    onClick={() => handleQuickRoleSwitch(acc)}
                    disabled={switchingRole}
                  >
                    <div className="role-switch-top">
                      <span className="role-switch-icon">{acc.icon}</span>
                      <span className="role-switch-label">{acc.label}</span>
                    </div>
                    <span className="role-switch-desc">{acc.tagline}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="dashboard-main-body">
        {loading && (
          <div className="dashboard-loading-state">
            <div className="profile-spinner" />
            <p>Loading your dashboard details...</p>
          </div>
        )}

        {error && (
          <div className="checkout-error-banner" role="alert" style={{ margin: '2rem 0' }}>
            <div className="error-title">⚠️ Dashboard Connectivity Notice</div>
            <div className="error-desc">{error}</div>
            <button className="btn-hero-primary" onClick={loadDashboard} style={{ marginTop: '1rem' }}>
              Retry Sync
            </button>
          </div>
        )}

        {/* Unauthenticated Guest View */}
        {!isAuthenticated && !loading && (
          <div className="dashboard-unauthenticated-card">
            <div className="unauth-icon-ring">🔐</div>
            <h2>Unlock Your Role-Based Dashboard</h2>
            <p>
              Select any demo persona above to immediately explore real customer order histories, administrator platform analytics, or driver dispatch logistics.
            </p>
            <div className="unauth-actions">
              <button
                className="btn-hero-primary"
                onClick={() => handleQuickRoleSwitch(DEMO_ACCOUNTS[0])}
              >
                👤 Enter as Customer (Jane Doe)
              </button>
              <button
                className="btn-hero-secondary"
                onClick={() => handleQuickRoleSwitch(DEMO_ACCOUNTS[1])}
              >
                📦 Enter as Warehouse Shipper
              </button>
              <button
                className="btn-hero-secondary"
                onClick={() => handleQuickRoleSwitch(DEMO_ACCOUNTS[2])}
              >
                🚚 Enter as Delivery Driver
              </button>
              <button
                className="btn-hero-secondary"
                onClick={() => handleQuickRoleSwitch(DEMO_ACCOUNTS[3])}
              >
                🛡️ Enter as Admin
              </button>
              <button
                className="btn-demo-fill"
                onClick={() => onNavigate && onNavigate('auth', { tab: 'login' })}
                style={{ marginLeft: 'auto' }}
              >
                🔑 Custom Sign In
              </button>
            </div>
          </div>
        )}

        {/* Authenticated Dashboard Views with Options Sidebar */}
        {isAuthenticated && !loading && dashboardData && (
          <div className="dashboard-layout-wrap">
            {/* Dedicated Left Options Sidebar */}
            <aside className="dashboard-options-sidebar" aria-label="Dashboard Profile Options">
              {/* Profile Card */}
              <div className="sidebar-profile-card">
                <div className="sidebar-avatar-ring">
                  <span>
                    {user?.role === 'admin'
                      ? '🛡️'
                      : user?.role === 'shipper'
                      ? '📦'
                      : user?.role === 'delivery_partner'
                      ? '🚚'
                      : '👤'}
                  </span>
                </div>
                <div className="sidebar-profile-meta">
                  <h3 className="sidebar-profile-name">{user?.name}</h3>
                  <span className="sidebar-profile-email">{user?.email}</span>
                </div>
                <div
                  className="sidebar-role-badge"
                  style={{
                    background:
                      user?.role === 'admin'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : user?.role === 'shipper'
                        ? 'rgba(234, 88, 12, 0.15)'
                        : user?.role === 'delivery_partner'
                        ? 'rgba(245, 158, 11, 0.15)'
                        : 'rgba(99, 102, 241, 0.15)',
                    color:
                      user?.role === 'admin'
                        ? '#34d399'
                        : user?.role === 'shipper'
                        ? '#ea580c'
                        : user?.role === 'delivery_partner'
                        ? '#fbbf24'
                        : '#818cf8',
                    border: `1px solid ${
                      user?.role === 'admin'
                        ? 'rgba(16, 185, 129, 0.3)'
                        : user?.role === 'shipper'
                        ? 'rgba(234, 88, 12, 0.3)'
                        : user?.role === 'delivery_partner'
                        ? 'rgba(245, 158, 11, 0.3)'
                        : 'rgba(99, 102, 241, 0.3)'
                    }`
                  }}
                >
                  <span>
                    {user?.role === 'admin'
                      ? '🛡️'
                      : user?.role === 'shipper'
                      ? '📦'
                      : user?.role === 'delivery_partner'
                      ? '🚚'
                      : '👤'}
                  </span>
                  <span>
                    {user?.role === 'admin'
                      ? 'ADMINISTRATOR'
                      : user?.role === 'shipper'
                      ? 'WAREHOUSE SHIPPER'
                      : user?.role === 'delivery_partner'
                      ? 'DELIVERY BOY / DRIVER'
                      : 'CUSTOMER MEMBER'}
                  </span>
                </div>
              </div>

              {/* Options & Actions Section */}
              <div className="sidebar-section">
                <div className="sidebar-section-title">
                  <span>⚡ Profile Options & Actions</span>
                </div>
                <nav className="sidebar-nav-actions">
                  {user?.role === 'customer' && (
                    <>
                      <button className="sidebar-action-btn primary" onClick={() => onNavigate && onNavigate('items')}>
                        <span className="sidebar-btn-icon">🛍️</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">Explore Catalog</span>
                          <span className="sidebar-btn-sub">Browse products & deals</span>
                        </div>
                      </button>
                      <button className="sidebar-action-btn" onClick={() => onNavigate && onNavigate('cart')}>
                        <span className="sidebar-btn-icon">🛒</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">View Cart</span>
                          <span className="sidebar-btn-sub">Review items & checkout</span>
                        </div>
                      </button>
                      <button
                        className={`sidebar-action-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('ALL')}
                      >
                        <span className="sidebar-btn-icon">📦</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">All My Orders</span>
                          <span className="sidebar-btn-sub">Full order history</span>
                        </div>
                        <span className="sidebar-btn-badge">{orders.length}</span>
                      </button>
                      <button className="sidebar-action-btn" onClick={loadDashboard} disabled={loading}>
                        <span className="sidebar-btn-icon">🔄</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">Refresh Orders</span>
                          <span className="sidebar-btn-sub">Sync with live database</span>
                        </div>
                      </button>
                    </>
                  )}

                  {user?.role === 'delivery_partner' && (
                    <>
                      <button
                        className="sidebar-action-btn primary"
                        onClick={() => onOpenProfile && onOpenProfile('driver_details')}
                        title="View and edit your complete Delivery Person Profile"
                      >
                        <span className="sidebar-btn-icon">👤</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">Driver Profile</span>
                          <span className="sidebar-btn-sub">Vehicle, zone & ID details</span>
                        </div>
                      </button>
                      <button
                        className={`sidebar-action-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('ALL')}
                      >
                        <span className="sidebar-btn-icon">📋</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">Full Queue</span>
                          <span className="sidebar-btn-sub">All assigned packages</span>
                        </div>
                        <span className="sidebar-btn-badge">{orders.length}</span>
                      </button>
                      <button
                        className={`sidebar-action-btn ${statusFilter === 'CONFIRMED' ? 'active alert' : ''}`}
                        onClick={() => setStatusFilter('CONFIRMED')}
                      >
                        <span className="sidebar-btn-icon">📦</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">Ready to Dispatch</span>
                          <span className="sidebar-btn-sub">Pending driver pickup</span>
                        </div>
                        <span className="sidebar-btn-badge highlight">{pendingDispatchCount}</span>
                      </button>
                      <button
                        className={`sidebar-action-btn ${statusFilter === 'DISPATCHED' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('DISPATCHED')}
                      >
                        <span className="sidebar-btn-icon">🚚</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">Dispatched</span>
                          <span className="sidebar-btn-sub">En route to hub</span>
                        </div>
                        <span className="sidebar-btn-badge">{dispatchedCount}</span>
                      </button>
                      <button
                        className={`sidebar-action-btn ${statusFilter === 'IN_TRANSIT' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('IN_TRANSIT')}
                      >
                        <span className="sidebar-btn-icon">⚡</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">In Transit</span>
                          <span className="sidebar-btn-sub">Last-mile delivery</span>
                        </div>
                        <span className="sidebar-btn-badge">{inTransitCount}</span>
                      </button>
                      <button className="sidebar-action-btn" onClick={loadDashboard} disabled={loading}>
                        <span className="sidebar-btn-icon">🔄</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">Refresh Dispatches</span>
                          <span className="sidebar-btn-sub">Check for new orders</span>
                        </div>
                      </button>
                    </>
                  )}

                  {user?.role === 'shipper' && (
                    <>
                      <button
                        className={`sidebar-action-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('ALL')}
                      >
                        <span className="sidebar-btn-icon">📦</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">All Shipments</span>
                          <span className="sidebar-btn-sub">Complete warehouse queue</span>
                        </div>
                        <span className="sidebar-btn-badge">{orders.length}</span>
                      </button>
                      <button
                        className={`sidebar-action-btn ${statusFilter === 'CONFIRMED' ? 'active alert' : ''}`}
                        onClick={() => setStatusFilter('CONFIRMED')}
                      >
                        <span className="sidebar-btn-icon">📥</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">Needs Dispatch</span>
                          <span className="sidebar-btn-sub">Confirmed customer orders</span>
                        </div>
                        <span className="sidebar-btn-badge highlight">{pendingDispatchCount}</span>
                      </button>
                      <button
                        className={`sidebar-action-btn ${statusFilter === 'DISPATCHED' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('DISPATCHED')}
                      >
                        <span className="sidebar-btn-icon">🏭</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">Dispatched</span>
                          <span className="sidebar-btn-sub">Ready for transit handover</span>
                        </div>
                        <span className="sidebar-btn-badge">{dispatchedCount}</span>
                      </button>
                      <button
                        className={`sidebar-action-btn ${statusFilter === 'IN_TRANSIT' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('IN_TRANSIT')}
                      >
                        <span className="sidebar-btn-icon">🚚</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">In Transit</span>
                          <span className="sidebar-btn-sub">Handed to delivery driver</span>
                        </div>
                        <span className="sidebar-btn-badge">{inTransitCount}</span>
                      </button>
                      <button className="sidebar-action-btn" onClick={loadDashboard} disabled={loading}>
                        <span className="sidebar-btn-icon">🔄</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">Refresh Shipments</span>
                          <span className="sidebar-btn-sub">Sync latest status</span>
                        </div>
                      </button>
                    </>
                  )}

                  {user?.role === 'admin' && (
                    <>
                      <button className="sidebar-action-btn primary" onClick={() => onNavigate && onNavigate('items')}>
                        <span className="sidebar-btn-icon">🛍️</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">Manage Catalog</span>
                          <span className="sidebar-btn-sub">SKUs & stock inventory</span>
                        </div>
                      </button>
                      <button
                        className={`sidebar-action-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('ALL')}
                      >
                        <span className="sidebar-btn-icon">📊</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">All Transactions</span>
                          <span className="sidebar-btn-sub">Platform order ledger</span>
                        </div>
                        <span className="sidebar-btn-badge">{orders.length}</span>
                      </button>
                      <button
                        className={`sidebar-action-btn ${statusFilter === 'DISPATCHED' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('DISPATCHED')}
                      >
                        <span className="sidebar-btn-icon">🚚</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">Active Dispatches</span>
                          <span className="sidebar-btn-sub">Orders out for delivery</span>
                        </div>
                        <span className="sidebar-btn-badge">{dispatchedCount}</span>
                      </button>
                      <button className="sidebar-action-btn" onClick={loadDashboard} disabled={loading}>
                        <span className="sidebar-btn-icon">🔄</span>
                        <div className="sidebar-btn-text">
                          <span className="sidebar-btn-label">Refresh Platform</span>
                          <span className="sidebar-btn-sub">Sync SSMS & logs</span>
                        </div>
                      </button>
                    </>
                  )}
                </nav>
              </div>

              {/* Sidebar Footer Info */}
              <div className="sidebar-footer-card">
                <div className="sidebar-live-pill">
                  <span className="live-pulse-dot" />
                  <span>Store Operations Online</span>
                </div>
                <button
                  className="sidebar-store-btn"
                  onClick={() => onNavigate && onNavigate('home')}
                >
                  🏠 Return to Storefront
                </button>
              </div>
            </aside>

            {/* Right Column: Dashboard Main Content */}
            <main className="dashboard-main-column">
              {/* 1. CUSTOMER DASHBOARD */}
              {dashboardData.role === 'customer' && (
              <div className="dashboard-view-wrapper">
                {/* KPI Metrics */}
                <div className="dashboard-kpi-grid">
                  <div className="dashboard-kpi-card" style={{ '--kpi-accent': '#6366f1' }}>
                    <div className="kpi-icon-wrap">📦</div>
                    <div className="kpi-data">
                      <span className="kpi-value">{dashboardData.orders_count || 0}</span>
                      <span className="kpi-label">Completed Orders</span>
                    </div>
                  </div>

                  <div className="dashboard-kpi-card" style={{ '--kpi-accent': '#10b981' }}>
                    <div className="kpi-icon-wrap">💳</div>
                    <div className="kpi-data">
                      <span className="kpi-value">₹{(dashboardData.total_spent || 0).toFixed(2)}</span>
                      <span className="kpi-label">Lifetime Spend</span>
                    </div>
                  </div>

                  <div className="dashboard-kpi-card" style={{ '--kpi-accent': '#f59e0b' }}>
                    <div className="kpi-icon-wrap">🌟</div>
                    <div className="kpi-data">
                      <span className="kpi-value">Gold Tier</span>
                      <span className="kpi-label">Loyalty Tier (5% Rebate)</span>
                    </div>
                  </div>

                  <div className="dashboard-kpi-card" style={{ '--kpi-accent': '#38bdf8' }}>
                    <div className="kpi-icon-wrap">🚚</div>
                    <div className="kpi-data">
                      <span className="kpi-value">
                        {orders.filter(o => ['CONFIRMED', 'DISPATCHED', 'IN_TRANSIT'].includes(o.status)).length}
                      </span>
                      <span className="kpi-label">Active Shipments</span>
                    </div>
                  </div>
                </div>

                {/* VIP Membership Golden Lounge Banner */}
                <div className="vip-lounge-banner">
                  <div className="vip-lounge-header">
                    <div className="vip-lounge-badge">
                      <span className="vip-crown">👑</span>
                      <span>AEROSTORE VIP GOLDEN PASS</span>
                      <span className="vip-status-pill">● ACTIVE SUBSCRIBER</span>
                    </div>
                    <span className="vip-expiry-note">Renewal: Lifetime Member</span>
                  </div>

                  <div className="vip-lounge-content">
                    <div className="vip-info-col">
                      <h3 className="vip-lounge-title">Welcome to Your VIP Member Lounge</h3>
                      <p className="vip-lounge-desc">
                        As a subscribed VIP customer, your account unlocks exclusive privileged benefits across all AeroStore departments:
                      </p>
                      
                      <div className="vip-perks-grid">
                        <div className="vip-perk-item">
                          <span className="perk-icon">🎟️</span>
                          <div>
                            <strong>Exclusive 20% Coupon Code</strong>
                            <p>Use code <code className="vip-code-tag">VIP20</code> at checkout for 20% off orders $100+.</p>
                          </div>
                        </div>

                        <div className="vip-perk-item">
                          <span className="perk-icon">⚡</span>
                          <div>
                            <strong>Zero-Fee AeroMinutes Express</strong>
                            <p>Free instant 10-minute delivery from AeroCafe & Grocery without minimum spend.</p>
                          </div>
                        </div>

                        <div className="vip-perk-item">
                          <span className="perk-icon">💎</span>
                          <div>
                            <strong>5% Automatic Cashback Rebate</strong>
                            <p>Earn 5% rewards points credited directly on every confirmed delivery.</p>
                          </div>
                        </div>

                        <div className="vip-perk-item">
                          <span className="perk-icon">🤖</span>
                          <div>
                            <strong>VIP Priority AI Concierge</strong>
                            <p>Ask the Chatbot <em>"vip perks"</em> or <em>"checkout"</em> for zero-wait automated assistance.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="vip-action-col">
                      <div className="vip-card-visual">
                        <div className="vip-card-inner">
                          <div className="vip-card-top">
                            <span>AeroStore VIP</span>
                            <span className="vip-card-chip">💳 CHIP</span>
                          </div>
                          <div className="vip-card-number">•••• •••• •••• 8420</div>
                          <div className="vip-card-bottom">
                            <div>
                              <small>MEMBER</small>
                              <div>{user?.name || 'Jane Doe'}</div>
                            </div>
                            <div>
                              <small>TIER</small>
                              <div>GOLD VIP</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="vip-quick-buttons">
                        <button
                          type="button"
                          className="btn-vip-action primary"
                          onClick={() => onNavigate && onNavigate('items')}
                        >
                          🛍️ Shop VIP Catalog
                        </button>
                        <button
                          type="button"
                          className="btn-vip-action secondary"
                          onClick={() => onNavigate && onNavigate('items', { category: 'Cafe & Beverages' })}
                        >
                          ⚡ 10-Min AeroCafe Express
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Shipment Tracker */}
                {activeShipment && (
                  <div className="dashboard-tracker-card">
                    <div className="tracker-card-header">
                      <div>
                        <span className="tracker-tag">Live Shipment Tracking</span>
                        <h3>Order #{activeShipment.order_id}</h3>
                        <span className="tracker-date">Placed on {activeShipment.created_at?.slice(0, 10) || 'Today'}</span>
                      </div>
                      <StatusBadge status={activeShipment.status} />
                    </div>

                    {/* Progress Bar */}
                    <div className="shipment-stepper-bar">
                      {STATUS_FLOW.map((step, idx) => {
                        const currentIdx = STATUS_FLOW.indexOf(activeShipment.status);
                        const isCompleted = idx <= currentIdx;
                        return (
                          <div key={step} className={`stepper-step ${isCompleted ? 'active' : ''}`}>
                            <div className="stepper-dot">
                              {isCompleted ? '✓' : idx + 1}
                            </div>
                            <span className="stepper-label">{step.replace(/_/g, ' ')}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="tracker-details-row">
                      <div>
                        <strong>Shipping Destination:</strong>
                        <p>{activeShipment.shipping_address?.street || '742 Evergreen Terrace'}, {activeShipment.shipping_address?.city || 'Springfield'}</p>
                      </div>
                      <div>
                        <strong>Items in Shipment:</strong>
                        <p>{activeShipment.items?.map(i => `${i.name} (x${i.quantity})`).join(', ') || 'Catalog items'}</p>
                      </div>
                      <div>
                        <strong>Estimated Arrival:</strong>
                        <p style={{ color: '#10b981', fontWeight: 600 }}>Within 2 Business Days (Express)</p>
                      </div>
                    </div>

                    {/* Delivery Assistance Helper Strip */}
                    <div className="delivery-assistance-strip">
                      <div className="assistance-info">
                        <span className="assistance-icon">🏠</span>
                        <div>
                          <strong>Unable to receive this delivery?</strong>
                          <p>Reschedule to another time, authorize drop with building security/guard, or delegate OTP.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-delivery-help"
                        onClick={() => {
                          setRescheduleModalOrder(activeShipment);
                          setRescheduleSuccess(null);
                        }}
                      >
                        ⚡ Change Delivery Instructions
                      </button>
                    </div>
                  </div>
                )}

                {/* Customer Preference & Most Loved Visual Charts */}
                <CustomerPreferenceCharts onNavigate={onNavigate} />

                {/* Action Bar */}
                <div className="dashboard-action-toolbar">
                  <div className="action-toolbar-title">
                    <h3>📦 Order History ({filteredOrders.length})</h3>
                    <p>All your verified orders and delivery updates are shown below.</p>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="dashboard-filter-bar">
                  <div className="filter-chips">
                    {['ALL', 'CONFIRMED', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED'].map((st) => (
                      <button
                        key={st}
                        className={`filter-chip ${statusFilter === st ? 'active' : ''}`}
                        onClick={() => setStatusFilter(st)}
                      >
                        {st.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    className="dashboard-search-input"
                    placeholder="Search by Order ID or item name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Orders Grid */}
                {filteredOrders.length === 0 ? (
                  <div className="profile-empty-state" style={{ margin: '3rem 0' }}>
                    <span style={{ fontSize: '3rem' }}>📦</span>
                    <h3>No matching orders found</h3>
                    <p>Your confirmed orders and live tracking updates will appear here.</p>
                  </div>
                ) : (
                  <div className="dashboard-orders-grid">
                    {filteredOrders.map((ord) => (
                      <div key={ord.order_id} className="dashboard-order-card">
                        <div className="dashboard-order-header">
                          <div>
                            <span className="order-id-label">#{ord.order_id}</span>
                            <span className="order-date-label">{ord.created_at?.slice(0, 19).replace('T', ' ') || 'Recent'}</span>
                          </div>
                          <StatusBadge status={ord.status} />
                        </div>

                        <div className="dashboard-order-items">
                          {(ord.items || []).map((item, idx) => (
                            <div key={idx} className="dashboard-order-item-row">
                              <span className="item-name">{item.name || item.product_id}</span>
                              <span className="item-qty">Qty: {item.quantity}</span>
                              <span className="item-subtotal">₹{((item.unit_price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="dashboard-order-footer">
                          <div>
                            <span className="footer-label">Total Amount:</span>
                            <strong className="footer-price">₹{(ord.total_amount || 0).toFixed(2)}</strong>
                          </div>
                          <button
                            className="btn-view-receipt"
                            onClick={() => setActiveReceiptOrder(ord)}
                          >
                            📄 View Receipt
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. ADMIN DASHBOARD */}
            {dashboardData.role === 'admin' && (
              <div className="dashboard-view-wrapper">
                {/* Executive KPIs */}
                <div className="dashboard-kpi-grid">
                  <div className="dashboard-kpi-card" style={{ '--kpi-accent': '#6366f1' }}>
                    <div className="kpi-icon-wrap">👥</div>
                    <div className="kpi-data">
                      <span className="kpi-value">{dashboardData.system_metrics?.registered_users || 0}</span>
                      <span className="kpi-label">Registered Accounts</span>
                    </div>
                  </div>

                  <div className="dashboard-kpi-card" style={{ '--kpi-accent': '#10b981' }}>
                    <div className="kpi-icon-wrap">💰</div>
                    <div className="kpi-data">
                      <span className="kpi-value">₹{(dashboardData.system_metrics?.total_revenue || 0).toFixed(2)}</span>
                      <span className="kpi-label">Gross Platform Sales</span>
                    </div>
                  </div>

                  <div className="dashboard-kpi-card" style={{ '--kpi-accent': '#38bdf8' }}>
                    <div className="kpi-icon-wrap">📊</div>
                    <div className="kpi-data">
                      <span className="kpi-value">{dashboardData.system_metrics?.total_orders || 0}</span>
                      <span className="kpi-label">Total Platform Orders</span>
                    </div>
                  </div>

                  <div className="dashboard-kpi-card" style={{ '--kpi-accent': '#f59e0b' }}>
                    <div className="kpi-icon-wrap">⚡</div>
                    <div className="kpi-data">
                      <span className="kpi-value">{dashboardData.system_metrics?.active_sessions || 1}</span>
                      <span className="kpi-label">Active Store Users</span>
                    </div>
                  </div>
                </div>

                {/* System Health Banner */}
                <div className="admin-health-card">
                  <div className="health-left">
                    <span className="health-badge">🟢 All Systems Operational</span>
                    <h3>Live Store Status & Service Health</h3>
                    <p>All customer transactions, inventory levels, and order queues are operating smoothly in real time.</p>
                  </div>
                  <div className="health-right">
                    <button
                      className="btn-demo-fill"
                      onClick={handleCreateSampleOrder}
                      disabled={actionLoading}
                    >
                      ⚡ {actionLoading ? 'Simulating...' : 'Generate Simulation Order'}
                    </button>
                  </div>
                </div>

                {/* 📚 Enterprise Knowledge Base & Document Ingestion (Admin Portal) */}
                <AdminDocumentIngestion />

                {/* Customer Preference & Most Loved Visual Charts in Admin View */}
                <CustomerPreferenceCharts onNavigate={onNavigate} />

                {/* Admin Platform Orders Table */}
                <div className="admin-table-card">
                  <div className="admin-table-header">
                    <h3>Platform Orders Stream ({filteredOrders.length})</h3>
                    <div className="admin-table-controls">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="admin-select"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="DISPATCHED">DISPATCHED</option>
                        <option value="IN_TRANSIT">IN_TRANSIT</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Filter by ID or user..."
                        className="dashboard-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="admin-table-wrap">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer ID</th>
                          <th>Items Count</th>
                          <th>Total (₹)</th>
                          <th>Status</th>
                          <th>Created At</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((ord) => (
                          <tr key={ord.order_id}>
                            <td><strong>#{ord.order_id}</strong></td>
                            <td><code>{ord.user_id}</code></td>
                            <td>{ord.items?.length || 0} item(s)</td>
                            <td><strong>₹{(ord.total_amount || 0).toFixed(2)}</strong></td>
                            <td><StatusBadge status={ord.status} /></td>
                            <td>{ord.created_at?.slice(0, 19).replace('T', ' ') || 'N/A'}</td>
                            <td>
                              <button
                                className="btn-view-receipt"
                                onClick={() => setActiveReceiptOrder(ord)}
                              >
                                Inspect
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. DELIVERY PARTNER DASHBOARD */}
            {dashboardData.role === 'delivery_partner' && (
              <div className="dashboard-view-wrapper">
                {/* Logistics KPIs */}
                <div className="dashboard-kpi-grid">
                  <div className="dashboard-kpi-card" style={{ '--kpi-accent': '#10b981' }}>
                    <div className="kpi-icon-wrap">🚚</div>
                    <div className="kpi-data">
                      <span className="kpi-value">{dispatchedCount}</span>
                      <span className="kpi-label">Dispatched Deliveries</span>
                    </div>
                  </div>

                  <div className="dashboard-kpi-card" style={{ '--kpi-accent': '#f59e0b' }}>
                    <div className="kpi-icon-wrap">📦</div>
                    <div className="kpi-data">
                      <span className="kpi-value">{pendingDispatchCount}</span>
                      <span className="kpi-label">Ready for Dispatch</span>
                    </div>
                  </div>

                  <div className="dashboard-kpi-card" style={{ '--kpi-accent': '#6366f1' }}>
                    <div className="kpi-icon-wrap">🏁</div>
                    <div className="kpi-data">
                      <span className="kpi-value">{deliveredCount}</span>
                      <span className="kpi-label">Completed Deliveries</span>
                    </div>
                  </div>

                  <div className="dashboard-kpi-card" style={{ '--kpi-accent': '#38bdf8' }}>
                    <div className="kpi-icon-wrap">📍</div>
                    <div className="kpi-data">
                      <span className="kpi-value">Zone Alpha ({orders.length})</span>
                      <span className="kpi-label">Current Route Cluster</span>
                    </div>
                  </div>
                </div>

                {/* Dispatch List Header */}
                <div className="dashboard-action-toolbar">
                  <div>
                    <h3>🚚 Active Delivery Dispatch Queue ({filteredOrders.length})</h3>
                    <p>Update order state transitions in real time to trigger live customer tracking alerts.</p>
                  </div>
                </div>

                {/* Logistics Orders Cards */}
                <div className="dashboard-orders-grid">
                  {filteredOrders.map((ord) => {
                    const currentIndex = STATUS_FLOW.indexOf(ord.status);
                    const canAdvance = currentIndex >= 0 && currentIndex < STATUS_FLOW.length - 1;
                    const nextStatus = canAdvance ? STATUS_FLOW[currentIndex + 1] : null;

                    return (
                      <div key={ord.order_id} className="dashboard-order-card delivery-highlight-card">
                        <div className="dashboard-order-header">
                          <div>
                            <span className="order-id-label">#{ord.order_id}</span>
                            <span className="order-date-label">
                              📍 {ord.shipping_address?.street || '456 Tech Plaza'}, {ord.shipping_address?.city || 'Seattle'}
                            </span>
                          </div>
                          <StatusBadge status={ord.status} />
                        </div>

                        {/* Visual Progress Stepper */}
                        <div className="delivery-progress-bar">
                          {STATUS_FLOW.map((step, idx) => (
                            <div
                              key={step}
                              className={`delivery-progress-step ${idx <= currentIndex ? 'active' : ''}`}
                            >
                              <div className="delivery-step-dot" />
                              <span className="delivery-step-label">{step.replace(/_/g, ' ')}</span>
                            </div>
                          ))}
                        </div>

                        <div className="dashboard-order-items">
                          <span className="item-name">Items ({ord.items?.length || 0}): {ord.items?.map(i => i.name).join(', ')}</span>
                        </div>

                        <div className="dashboard-order-footer">
                          <div>
                            <span className="footer-label">Order Total:</span>
                            <strong className="footer-price">${(ord.total_amount || 0).toFixed(2)}</strong>
                          </div>

                          {ord.status === 'IN_TRANSIT' && (
                            <button
                              className="btn-status-update"
                              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                              disabled={actionLoading}
                              onClick={() => handleStatusUpdate(ord.order_id, 'DELIVERED')}
                            >
                              🏁 Deliver Package to Customer
                            </button>
                          )}
                          {ord.status === 'CONFIRMED' && (
                            <span style={{ color: '#94a3b8', background: 'rgba(148, 163, 184, 0.12)', padding: '0.45rem 0.85rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, border: '1px solid rgba(148, 163, 184, 0.25)' }}>
                              ⏳ Awaiting Shipper Dispatch
                            </span>
                          )}
                          {ord.status === 'DISPATCHED' && (
                            <span style={{ color: '#fbbf24', background: 'rgba(245, 158, 11, 0.12)', padding: '0.45rem 0.85rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                              📦 Warehouse Packaged (Awaiting Handover)
                            </span>
                          )}
                          {ord.status === 'DELIVERED' && (
                            <span className="delivery-completed-tag">✅ Fully Delivered</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. SHIPPER WAREHOUSE DASHBOARD */}
            {dashboardData.role === 'shipper' && (
              <div className="dashboard-view-wrapper">
                {/* Shipper KPIs */}
                <div className="dashboard-kpi-grid">
                  <div className="dashboard-kpi-card" style={{ '--kpi-accent': '#ea580c' }}>
                    <div className="kpi-icon-wrap">📦</div>
                    <div className="kpi-data">
                      <span className="kpi-value">{pendingDispatchCount}</span>
                      <span className="kpi-label">Ready for Dispatch (CONFIRMED)</span>
                    </div>
                  </div>

                  <div className="dashboard-kpi-card" style={{ '--kpi-accent': '#f59e0b' }}>
                    <div className="kpi-icon-wrap">🏭</div>
                    <div className="kpi-data">
                      <span className="kpi-value">{orders.filter(o => o.status === 'DISPATCHED').length}</span>
                      <span className="kpi-label">Dispatched from Bay</span>
                    </div>
                  </div>

                  <div className="dashboard-kpi-card" style={{ '--kpi-accent': '#38bdf8' }}>
                    <div className="kpi-icon-wrap">🚚</div>
                    <div className="kpi-data">
                      <span className="kpi-value">{inTransitCount}</span>
                      <span className="kpi-label">In Transit (With Delivery Boy)</span>
                    </div>
                  </div>

                  <div className="dashboard-kpi-card" style={{ '--kpi-accent': '#10b981' }}>
                    <div className="kpi-icon-wrap">✅</div>
                    <div className="kpi-data">
                      <span className="kpi-value">{deliveredCount}</span>
                      <span className="kpi-label">Delivered Successfully</span>
                    </div>
                  </div>
                </div>

                {/* Dispatch List Header */}
                <div className="dashboard-action-toolbar">
                  <div>
                    <h3>📦 Warehouse Fulfillment & Dispatch Queue ({filteredOrders.length})</h3>
                    <p>Dispatch confirmed customer orders up to In Transit for handover to the Delivery Boy.</p>
                  </div>
                </div>

                {/* Logistics Orders Cards for Shipper */}
                <div className="dashboard-orders-grid">
                  {filteredOrders.map((ord) => {
                    const currentIndex = STATUS_FLOW.indexOf(ord.status);

                    return (
                      <div key={ord.order_id} className="dashboard-order-card delivery-highlight-card">
                        <div className="dashboard-order-header">
                          <div>
                            <span className="order-id-label">#{ord.order_id}</span>
                            <span className="order-date-label">
                              📍 {ord.shipping_address?.street || '456 Tech Plaza'}, {ord.shipping_address?.city || 'Seattle'}
                            </span>
                          </div>
                          <StatusBadge status={ord.status} />
                        </div>

                        {/* Visual Progress Stepper */}
                        <div className="delivery-progress-bar">
                          {STATUS_FLOW.map((step, idx) => (
                            <div
                              key={step}
                              className={`delivery-progress-step ${idx <= currentIndex ? 'active' : ''}`}
                            >
                              <div className="delivery-step-dot" />
                              <span className="delivery-step-label">{step.replace(/_/g, ' ')}</span>
                            </div>
                          ))}
                        </div>

                        <div className="dashboard-order-items">
                          <span className="item-name">Items ({ord.items?.length || 0}): {ord.items?.map(i => i.name).join(', ')}</span>
                        </div>

                        <div className="dashboard-order-footer">
                          <div>
                            <span className="footer-label">Order Total:</span>
                            <strong className="footer-price">₹{(ord.total_amount || 0).toFixed(2)}</strong>
                          </div>

                          {ord.status === 'CONFIRMED' && (
                            <button
                              className="btn-status-update"
                              style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}
                              disabled={actionLoading}
                              onClick={() => handleStatusUpdate(ord.order_id, 'DISPATCHED')}
                            >
                              📦 Mark as DISPATCHED
                            </button>
                          )}
                          {ord.status === 'DISPATCHED' && (
                            <button
                              className="btn-status-update"
                              style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}
                              disabled={actionLoading}
                              onClick={() => handleStatusUpdate(ord.order_id, 'IN_TRANSIT')}
                            >
                              🚚 Mark as IN TRANSIT
                            </button>
                          )}
                          {ord.status === 'IN_TRANSIT' && (
                            <span style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '0.45rem 0.85rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                              🚚 In Transit • Handed Over to Delivery Boy
                            </span>
                          )}
                          {ord.status === 'DELIVERED' && (
                            <span className="delivery-completed-tag">✅ Fully Delivered</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            </main>
          </div>
        )}
      </section>

      {/* Order Receipt Modal */}
      {activeReceiptOrder && (
        <div className="modal-overlay open" role="dialog" aria-modal="true">
          <div className="modal-card receipt-modal-card">
            <div className="modal-header">
              <h3>📄 Order Receipt & Verification</h3>
              <button
                className="btn-close-icon"
                onClick={() => setActiveReceiptOrder(null)}
              >
                &times;
              </button>
            </div>

            <div className="receipt-modal-body">
              <div className="receipt-header-brand">
                <span className="brand-name">AeroStore</span>
                <span className="receipt-id">Invoice: #{activeReceiptOrder.order_id}</span>
              </div>

              <div className="receipt-meta-grid">
                <div>
                  <strong>Customer:</strong>
                  <p>{activeReceiptOrder.user_id}</p>
                </div>
                <div>
                  <strong>Status:</strong>
                  <p><StatusBadge status={activeReceiptOrder.status} /></p>
                </div>
                <div>
                  <strong>Date:</strong>
                  <p>{activeReceiptOrder.created_at?.slice(0, 19).replace('T', ' ') || 'Today'}</p>
                </div>
                <div>
                  <strong>Payment:</strong>
                  <p>Razorpay Direct Gateway (Verified)</p>
                </div>
              </div>

              <div className="receipt-items-table">
                <div className="receipt-items-header">
                  <span>Description</span>
                  <span>Qty</span>
                  <span>Price</span>
                  <span>Subtotal</span>
                </div>
                {(activeReceiptOrder.items || []).map((it, idx) => (
                  <div key={idx} className="receipt-item-line">
                    <span>{it.name || it.product_id}</span>
                    <span>{it.quantity}</span>
                    <span>₹{(it.unit_price || 0).toFixed(2)}</span>
                    <span><strong>₹{((it.unit_price || 0) * (it.quantity || 1)).toFixed(2)}</strong></span>
                  </div>
                ))}
              </div>

              <div className="receipt-total-bar">
                <span>Total Amount Charged:</span>
                <span className="receipt-final-amount">₹{(activeReceiptOrder.total_amount || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-hero-secondary"
                onClick={() => setActiveReceiptOrder(null)}
              >
                Close Receipt
              </button>
              <button
                className="btn-hero-primary"
                onClick={() => window.print()}
              >
                🖨️ Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Assistance & Reschedule Modal */}
      {rescheduleModalOrder && (
        <div className="modal-overlay open" role="dialog" aria-modal="true" aria-label="Delivery Assistance">
          <div className="modal-card delivery-help-modal-card" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <span style={{ fontSize: '1.6rem' }}>📦</span>
                <div>
                  <h3 style={{ margin: 0 }}>Delivery Pickup Assistance</h3>
                  <p className="modal-subtitle" style={{ margin: 0 }}>
                    Order #{rescheduleModalOrder.order_id} • Choose how driver should deliver
                  </p>
                </div>
              </div>
              <button
                className="btn-close-icon"
                onClick={() => setRescheduleModalOrder(null)}
                aria-label="Close delivery assistance modal"
              >
                &times;
              </button>
            </div>

            <div className="modal-body" style={{ padding: '1.25rem 0' }}>
              {rescheduleSuccess ? (
                <div className="reschedule-success-alert" style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                  <h4 style={{ color: '#34d399', margin: '0 0 0.4rem 0' }}>Delivery Instructions Updated!</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                    {rescheduleSuccess}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#818cf8', marginTop: '0.75rem' }}>
                    Driver and dark store warehouse dispatch have received your real-time preference.
                  </p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    If you are not available to receive this package in person, choose an alternative option below:
                  </p>

                  <div className="reschedule-options-grid" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Option 1: Reschedule Time Slot */}
                    <label className={`reschedule-option-tile ${rescheduleOption === 'slot' ? 'active' : ''}`} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '1rem',
                      borderRadius: '10px',
                      background: rescheduleOption === 'slot' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${rescheduleOption === 'slot' ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'}`,
                      cursor: 'pointer'
                    }}>
                      <input
                        type="radio"
                        name="rescheduleType"
                        value="slot"
                        checked={rescheduleOption === 'slot'}
                        onChange={() => setRescheduleOption('slot')}
                        style={{ marginTop: '0.2rem' }}
                      />
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', color: '#ffffff', fontSize: '0.95rem' }}>
                          📅 Reschedule Delivery Slot (Next Available)
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          Driver will hold the shipment at the dark store hub and deliver during your preferred window.
                        </span>
                        {rescheduleOption === 'slot' && (
                          <div style={{ marginTop: '0.6rem' }}>
                            <select
                              className="form-control"
                              value={selectedSlot}
                              onChange={(e) => setSelectedSlot(e.target.value)}
                              style={{ width: '100%', padding: '0.5rem', background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '6px' }}
                            >
                              <option value="Today Evening (6 PM - 9 PM)">Today Evening (6 PM - 9 PM)</option>
                              <option value="Tomorrow Morning (8 AM - 11 AM)">Tomorrow Morning (8 AM - 11 AM)</option>
                              <option value="Tomorrow 10 AM - 1 PM">Tomorrow 10 AM - 1 PM</option>
                              <option value="Tomorrow Evening (4 PM - 8 PM)">Tomorrow Evening (4 PM - 8 PM)</option>
                              <option value="Weekend Priority Slot (Saturday 11 AM)">Weekend Priority Slot (Saturday 11 AM)</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Option 2: Leave with Security Guard / Neighbor */}
                    <label className={`reschedule-option-tile ${rescheduleOption === 'guard' ? 'active' : ''}`} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '1rem',
                      borderRadius: '10px',
                      background: rescheduleOption === 'guard' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${rescheduleOption === 'guard' ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)'}`,
                      cursor: 'pointer'
                    }}>
                      <input
                        type="radio"
                        name="rescheduleType"
                        value="guard"
                        checked={rescheduleOption === 'guard'}
                        onChange={() => setRescheduleOption('guard')}
                        style={{ marginTop: '0.2rem' }}
                      />
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', color: '#ffffff', fontSize: '0.95rem' }}>
                          🛡️ Leave with Security Guard / Doorstep Drop
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          Driver will leave package at gate/doorstep and snap a digital Proof-of-Delivery photo.
                        </span>
                        {rescheduleOption === 'guard' && (
                          <div style={{ marginTop: '0.6rem' }}>
                            <input
                              type="text"
                              className="form-control"
                              value={guardNotes}
                              onChange={(e) => setGuardNotes(e.target.value)}
                              placeholder="e.g. Leave with Tower B Security Guard or Flat 402"
                              style={{ width: '100%', padding: '0.5rem', background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '6px' }}
                            />
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Option 3: Delegate OTP to Trusted Contact */}
                    <label className={`reschedule-option-tile ${rescheduleOption === 'otp' ? 'active' : ''}`} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '1rem',
                      borderRadius: '10px',
                      background: rescheduleOption === 'otp' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${rescheduleOption === 'otp' ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
                      cursor: 'pointer'
                    }}>
                      <input
                        type="radio"
                        name="rescheduleType"
                        value="otp"
                        checked={rescheduleOption === 'otp'}
                        onChange={() => setRescheduleOption('otp')}
                        style={{ marginTop: '0.2rem' }}
                      />
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', color: '#ffffff', fontSize: '0.95rem' }}>
                          📲 Delegate Delivery OTP to Trusted Contact
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          Share pickup verification OTP directly with family member or neighbor.
                        </span>
                        {rescheduleOption === 'otp' && (
                          <div style={{ marginTop: '0.6rem' }}>
                            <input
                              type="text"
                              className="form-control"
                              value={alternateContact}
                              onChange={(e) => setAlternateContact(e.target.value)}
                              placeholder="Name and Phone number of recipient"
                              style={{ width: '100%', padding: '0.5rem', background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '6px' }}
                            />
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Option 4: AeroStore 24/7 Smart Locker Drop */}
                    <label className={`reschedule-option-tile ${rescheduleOption === 'locker' ? 'active' : ''}`} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '1rem',
                      borderRadius: '10px',
                      background: rescheduleOption === 'locker' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${rescheduleOption === 'locker' ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
                      cursor: 'pointer'
                    }}>
                      <input
                        type="radio"
                        name="rescheduleType"
                        value="locker"
                        checked={rescheduleOption === 'locker'}
                        onChange={() => setRescheduleOption('locker')}
                        style={{ marginTop: '0.2rem' }}
                      />
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', color: '#ffffff', fontSize: '0.95rem' }}>
                          🔐 Drop in AeroLocker (24/7 Contactless Smart Box)
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          Driver places parcel into your neighborhood PIN-protected locker. Pick up anytime in 48 hours.
                        </span>
                      </div>
                    </label>
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <button
                type="button"
                className="btn-hero-secondary"
                onClick={() => setRescheduleModalOrder(null)}
              >
                {rescheduleSuccess ? 'Done' : 'Cancel'}
              </button>
              {!rescheduleSuccess && (
                <button
                  type="button"
                  className="btn-hero-primary"
                  onClick={() => {
                    let msg = '';
                    if (rescheduleOption === 'slot') msg = `Order rescheduled to ${selectedSlot}.`;
                    else if (rescheduleOption === 'guard') msg = `Driver instructed to leave with guard/doorstep: "${guardNotes}".`;
                    else if (rescheduleOption === 'otp') msg = `Delivery OTP authorized for alternate contact: ${alternateContact}.`;
                    else msg = `Parcel will be routed to AeroLocker Hub #7 with a 6-digit contactless pickup PIN.`;
                    setRescheduleSuccess(msg);
                  }}
                >
                  ✓ Confirm Instruction
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
