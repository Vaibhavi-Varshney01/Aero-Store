import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import AdminAvatar, { ADMIN_AVATAR_PRESETS, SHIPPER_AVATAR_PRESETS, DELIVERY_AVATAR_PRESETS, getCleanAdminAvatar } from './AdminAvatar';
import AdminDocumentIngestion from './rag/AdminDocumentIngestion';

const STATUS_FLOW = ['CONFIRMED', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED'];

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
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function RoleBadgeLarge({ role }) {
  const config = {
    customer: { icon: '👤', label: 'Customer', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)' },
    admin: { icon: '🛡️', label: 'Administrator', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
    delivery_partner: { icon: '🚚', label: 'Delivery Partner', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
    shipper: { icon: '📦', label: 'Shipper / Warehouse', color: '#ea580c', bg: 'rgba(234, 88, 12, 0.12)' }
  };
  const c = config[role] || config.customer;

  return (
    <div className="profile-role-badge-large" style={{ background: c.bg, borderColor: c.color }}>
      <span style={{ fontSize: '1.4rem' }}>{c.icon}</span>
      <span style={{ color: c.color, fontWeight: 700 }}>{c.label}</span>
    </div>
  );
}

function formatAddress(addr) {
  if (!addr) return 'Destination: Standard Route';
  if (typeof addr === 'string') return addr;
  if (typeof addr === 'object') {
    const parts = [addr.street || addr.address, addr.city, addr.state, addr.zip].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Destination: Zone Alpha Cluster';
  }
  return 'Destination: Standard Route';
}

/* ─── Customer Dashboard ─── */
function CustomerDashboard({ data }) {
  return (
    <div className="profile-dashboard-content">
      <div className="profile-stats-row">
        <div className="profile-stat-card">
          <span className="profile-stat-value">{data.orders_count || 0}</span>
          <span className="profile-stat-label">Total Orders</span>
        </div>
        <div className="profile-stat-card">
          <span className="profile-stat-value">₹{(data.total_spent || 0).toFixed(2)}</span>
          <span className="profile-stat-label">Total Spent</span>
        </div>
        <div className="profile-stat-card" style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}>
          <span className="profile-stat-value" style={{ color: '#fbbf24' }}>👑 VIP</span>
          <span className="profile-stat-label">Gold Subscriber</span>
        </div>
      </div>

      {/* VIP Subscriber Perks Box */}
      <div className="customer-vip-pass-box" style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(217, 119, 6, 0.05))',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '12px',
        padding: '1.1rem',
        margin: '1.25rem 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.3rem' }}>👑</span>
            <strong style={{ color: '#fbbf24', fontSize: '0.95rem' }}>AeroStore VIP Member Benefits Active</strong>
          </div>
          <span style={{
            fontSize: '0.75rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            fontWeight: 700
          }}>
            ✓ SUBSCRIBED
          </span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 0.85rem 0', lineHeight: 1.5 }}>
          Your VIP membership is activated. Enjoy zero-fee instant AeroMinutes deliveries, automatic 5% cashback on orders, 3-year warranty protection, and your exclusive discount vouchers:
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '0.6rem'
        }}>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700 }}>🎟️ 20% Off Coupon</div>
            <div style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>Code: <strong style={{ color: '#f59e0b' }}>VIP20</strong> (Min $100)</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
            <div style={{ fontSize: '0.78rem', color: '#c084fc', fontWeight: 700 }}>🎟️ 30% Off Coupon</div>
            <div style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>Code: <strong style={{ color: '#c084fc' }}>VIP30</strong> (Min $150)</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>🎟️ 25% Welcome Voucher</div>
            <div style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>Code: <strong style={{ color: '#34d399' }}>VIPFIRST</strong> (No Min)</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>⚡ AeroMinutes Express</div>
            <div style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>10-min Cafe delivery • ₹0 Free Shipping</div>
          </div>
        </div>
      </div>

      <h4 className="profile-section-title">📦 Order History</h4>
      {(!data.orders || data.orders.length === 0) ? (
        <div className="profile-empty-state">
          <span style={{ fontSize: '2.5rem' }}>🛍️</span>
          <p>No orders yet. Start shopping to see your history here!</p>
        </div>
      ) : (
        <div className="profile-orders-list">
          {data.orders.map((order) => (
            <div key={order.order_id} className="profile-order-card">
              <div className="profile-order-header">
                <div>
                  <span className="profile-order-id">#{order.order_id}</span>
                  <span className="profile-order-date">{order.created_at || 'Recent'}</span>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="profile-order-footer">
                <span>{order.items?.length || 0} item(s)</span>
                <span className="profile-order-total">₹{(order.total_amount || 0).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── System Administrator Profile View ─── */
function AdminProfileView({ user, onNavigate, onClose, openAuthModal }) {
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const saved = localStorage.getItem('aerostore_admin_avatar');
    return getCleanAdminAvatar(saved);
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [name, setName] = useState(() => {
    return localStorage.getItem('aerostore_admin_name') || user?.name || 'Alex Morgan';
  });
  const [email] = useState(user?.email || 'admin@aerostore.io');
  const [phone, setPhone] = useState(() => {
    return localStorage.getItem('aerostore_admin_phone') || '+1 (555) 019-2834';
  });
  const [department, setDepartment] = useState(() => {
    return localStorage.getItem('aerostore_admin_department') || 'Retail Operations & Executive Store Management';
  });
  const [badgeId] = useState('#MGR-8420');
  const [officeLocation] = useState('Seattle Tech HQ • Executive Management Bay');

  const handleSelectAvatar = (avatarId) => {
    setSelectedAvatar(avatarId);
    localStorage.setItem('aerostore_admin_avatar', avatarId);
    window.dispatchEvent(new Event('storage'));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('aerostore_admin_name', name);
    localStorage.setItem('aerostore_admin_phone', phone);
    localStorage.setItem('aerostore_admin_department', department);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="profile-dashboard-content admin-profile-content">
      {/* Save Notification */}
      {saveSuccess && (
        <div className="profile-alert-banner success" role="alert">
          <span>✅ Administrator profile details saved successfully!</span>
        </div>
      )}

      {/* Identity Card */}
      <div className="admin-profile-card">
        <div className="admin-profile-header-strip">
          <div className="admin-profile-avatar-display">
            <AdminAvatar avatarId={selectedAvatar} size={70} />
            <span className="admin-avatar-badge">EXEC</span>
          </div>

          <div className="admin-profile-header-info">
            <div className="admin-badge-row">
              <span className="admin-role-badge">👤 Store Management</span>
              <span className="admin-id-badge">{badgeId}</span>
              <span className="admin-status-online">● Active Session</span>
            </div>
            <h3 className="admin-profile-name">{name}</h3>
            <p className="admin-profile-designation">{department}</p>
          </div>

          <div className="admin-profile-actions">
            {!isEditing ? (
              <button
                type="button"
                className="btn-admin-edit"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <button
                type="button"
                className="btn-admin-cancel"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Profile Avatar Selector */}
        <div className="admin-avatar-selector-section">
          <div className="avatar-section-header">
            <span className="avatar-section-title">🎨 Profile Photo Avatars</span>
            <span className="avatar-section-sub">Choose your administrative identity avatar</span>
          </div>
          <div className="admin-avatar-grid">
            {ADMIN_AVATAR_PRESETS.map((av) => (
              <button
                key={av.id}
                type="button"
                className={`admin-avatar-pill ${selectedAvatar === av.id ? 'active' : ''}`}
                onClick={() => handleSelectAvatar(av.id)}
                title={av.label}
              >
                <div className="avatar-pill-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AdminAvatar avatarId={av.id} size={34} />
                </div>
                <span className="avatar-pill-label">{av.role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Personal & Contact Details */}
        <div className="admin-details-section">
          <h4 className="profile-section-title">👤 Personal Identity & Direct Contact</h4>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="admin-edit-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Official Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    disabled
                    readOnly
                    title="Official email cannot be changed"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Direct Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Department / Operations Unit</label>
                  <input
                    type="text"
                    className="form-control"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-demo-fill" style={{ backgroundColor: '#4f46e5', color: '#fff' }}>
                  💾 Save Profile Changes
                </button>
                <button type="button" className="btn-hero-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="admin-info-grid">
              <div className="admin-info-cell">
                <span className="info-cell-label">Full Name</span>
                <span className="info-cell-value"><strong>{name}</strong></span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Official Email</span>
                <span className="info-cell-value">{email}</span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Direct Phone</span>
                <span className="info-cell-value">{phone}</span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Staff Badge ID</span>
                <span className="info-cell-value font-mono">{badgeId}</span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Department</span>
                <span className="info-cell-value">{department}</span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Primary Station</span>
                <span className="info-cell-value">{officeLocation}</span>
              </div>
            </div>
          )}
        </div>

        {/* Security Clearance & Administrative Credentials */}
        <div className="admin-security-section">
          <h4 className="profile-section-title">🏛️ Executive Credentials & Management Authority</h4>
          <div className="admin-security-grid">
            <div className="security-card">
              <span className="sec-icon">🎖️</span>
              <div className="sec-body">
                <strong>Management Authority Level</strong>
                <p>Tier 4: General Operations & Store Governance Authority</p>
              </div>
            </div>
            <div className="security-card">
              <span className="sec-icon">🔑</span>
              <div className="sec-body">
                <strong>Authentication & Verification</strong>
                <p>🟢 Multi-Factor Token & Security Verification — Active</p>
              </div>
            </div>
            <div className="security-card">
              <span className="sec-icon">🛡️</span>
              <div className="sec-body">
                <strong>Session Access Protocol</strong>
                <p>Enterprise Management Console • Verified Identity</p>
              </div>
            </div>
            <div className="security-card">
              <span className="sec-icon">💼</span>
              <div className="sec-body">
                <strong>Operational Oversight</strong>
                <p>Retail Operations, Order Dispatch & Inventory Governance</p>
              </div>
            </div>
          </div>
        </div>

        {/* 📚 Enterprise Knowledge Base & Document Ingestion (Admin Portal Only) */}
        <div style={{ marginTop: '1.5rem' }}>
          <AdminDocumentIngestion />
        </div>

        {/* Corporate Purchasing Policy Notice */}
        <div className="admin-policy-card">
          <div className="policy-card-header">
            <span className="policy-badge">⚠️ CORPORATE PURCHASING POLICY</span>
            <span className="policy-id">Governance Guideline 4.1</span>
          </div>
          <h4 className="policy-title">Direct Purchasing Restricted for Administrator Credentials</h4>
          <p className="policy-text">
            Administrative credentials possess elevated operational access to backend inventory data, pricing rules, and store management.
            To avoid conflicts of interest and maintain clean financial auditing, administrative accounts cannot make retail purchases directly.
          </p>
          <p className="policy-subtext">
            <strong>Need to buy items?</strong> Administrators can switch to their personal customer account or register a separate <strong>Customer or Business Account</strong> to purchase hardware with standard retail warranties.
          </p>
          <div className="policy-actions">
            <button
              type="button"
              className="btn-switch-to-customer"
              onClick={() => {
                if (onClose) onClose();
                if (openAuthModal) openAuthModal('login');
              }}
            >
              👤 Switch / Sign in as Customer Account
            </button>
            <button
              type="button"
              className="btn-register-business-account"
              onClick={() => {
                if (onClose) onClose();
                if (openAuthModal) openAuthModal('register');
              }}
            >
              🏢 Register Personal / Business Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Warehouse Shipper Profile View ─── */
function ShipperProfileView({ user, onNavigate, onClose }) {
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const saved = localStorage.getItem('aerostore_shipper_avatar');
    return getCleanAdminAvatar(saved);
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [name, setName] = useState(() => {
    return localStorage.getItem('aerostore_shipper_name') || user?.name || 'Marcus Vance';
  });
  const [email] = useState(user?.email || 'shipper@aerostore.io');
  const [phone, setPhone] = useState(() => {
    return localStorage.getItem('aerostore_shipper_phone') || '+1 (555) 018-9342';
  });
  const [department, setDepartment] = useState(() => {
    return localStorage.getItem('aerostore_shipper_department') || 'Warehouse Fulfillment & Dispatch Operations';
  });
  const [badgeId] = useState('#SHIP-7140');
  const [officeLocation] = useState('Seattle Fulfillment Center • Warehouse Dispatch Bay 4');

  const handleSelectAvatar = (avatarId) => {
    setSelectedAvatar(avatarId);
    localStorage.setItem('aerostore_shipper_avatar', avatarId);
    window.dispatchEvent(new Event('storage'));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('aerostore_shipper_name', name);
    localStorage.setItem('aerostore_shipper_phone', phone);
    localStorage.setItem('aerostore_shipper_department', department);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="profile-dashboard-content admin-profile-content">
      {/* Save Notification */}
      {saveSuccess && (
        <div className="profile-alert-banner success" role="alert">
          <span>✅ Shipper profile details saved successfully!</span>
        </div>
      )}

      {/* Identity Card */}
      <div className="admin-profile-card">
        <div className="admin-profile-header-strip">
          <div className="admin-profile-avatar-display">
            <AdminAvatar avatarId={selectedAvatar} size={70} />
            <span className="admin-avatar-badge" style={{ background: '#ea580c' }}>SHIP</span>
          </div>

          <div className="admin-profile-header-info">
            <div className="admin-badge-row">
              <span className="admin-role-badge" style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c', borderColor: 'rgba(234, 88, 12, 0.3)' }}>
                📦 Warehouse Shipper
              </span>
              <span className="admin-id-badge">{badgeId}</span>
              <span className="admin-status-online">● Active Session</span>
            </div>
            <h3 className="admin-profile-name">{name}</h3>
            <p className="admin-profile-designation">{department}</p>
          </div>

          <div className="admin-profile-actions">
            {!isEditing ? (
              <button
                type="button"
                className="btn-admin-edit"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <button
                type="button"
                className="btn-admin-cancel"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Profile Avatar Selector */}
        <div className="admin-avatar-selector-section">
          <div className="avatar-section-header">
            <span className="avatar-section-title">🎨 Profile Photo Avatars</span>
            <span className="avatar-section-sub">Choose your warehouse shipper identity avatar</span>
          </div>
          <div className="admin-avatar-grid">
            {SHIPPER_AVATAR_PRESETS.map((av) => (
              <button
                key={av.id}
                type="button"
                className={`admin-avatar-pill ${selectedAvatar === av.id ? 'active' : ''}`}
                onClick={() => handleSelectAvatar(av.id)}
                title={av.label}
              >
                <div className="avatar-pill-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AdminAvatar avatarId={av.id} size={34} />
                </div>
                <span className="avatar-pill-label">{av.role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Personal & Contact Details */}
        <div className="admin-details-section">
          <h4 className="profile-section-title">👤 Personal Identity & Direct Contact</h4>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="admin-edit-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Official Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    disabled
                    readOnly
                    title="Official email cannot be changed"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Direct Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Department / Warehouse Bay</label>
                  <input
                    type="text"
                    className="form-control"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-demo-fill" style={{ backgroundColor: '#ea580c', color: '#fff' }}>
                  💾 Save Profile Changes
                </button>
                <button type="button" className="btn-hero-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="admin-info-grid">
              <div className="admin-info-cell">
                <span className="info-cell-label">Full Name</span>
                <span className="info-cell-value"><strong>{name}</strong></span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Official Email</span>
                <span className="info-cell-value">{email}</span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Direct Phone</span>
                <span className="info-cell-value">{phone}</span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Staff Badge ID</span>
                <span className="info-cell-value font-mono">{badgeId}</span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Department</span>
                <span className="info-cell-value">{department}</span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Primary Station</span>
                <span className="info-cell-value">{officeLocation}</span>
              </div>
            </div>
          )}
        </div>

        {/* Shipper Logistics Clearance & Fulfillment Credentials */}
        <div className="admin-security-section">
          <h4 className="profile-section-title">📦 Warehouse Authority & Dispatch Protocols</h4>
          <div className="admin-security-grid">
            <div className="security-card">
              <span className="sec-icon">📦</span>
              <div className="sec-body">
                <strong>Warehouse Shipping Authority</strong>
                <p>Tier 3: Package Packaging, Dispatch & In-Transit Handover</p>
              </div>
            </div>
            <div className="security-card">
              <span className="sec-icon">🚚</span>
              <div className="sec-body">
                <strong>Status Handover Protocol</strong>
                <p>Permitted Transitions: CONFIRMED ➔ DISPATCHED ➔ IN_TRANSIT</p>
              </div>
            </div>
            <div className="security-card">
              <span className="sec-icon">🏁</span>
              <div className="sec-body">
                <strong>Delivery Handover Rule</strong>
                <p>Final delivery completion is strictly reserved for Delivery Boy</p>
              </div>
            </div>
            <div className="security-card">
              <span className="sec-icon">📊</span>
              <div className="sec-body">
                <strong>Inventory Restock Rights</strong>
                <p>Direct live warehouse catalog stock level adjustment enabled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Warehouse Fulfillment Policy Notice */}
        <div className="admin-policy-card">
          <div className="policy-card-header">
            <span className="policy-badge" style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c' }}>📦 WAREHOUSE FULFILLMENT PROTOCOL</span>
            <span className="policy-id">Logistics SOP 3.2</span>
          </div>
          <h4 className="policy-title">Separation of Fulfillment & Delivery Duties</h4>
          <p className="policy-text">
            Shippers are responsible for inventory stocking, packaging customer orders, and dispatching packages until they are In Transit.
            Final handover and doorstep customer confirmation is exclusively handled by assigned Delivery Boys.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Delivery Partner Profile View (Full Details, Metrics, Route & Editable Settings) ─── */
function DeliveryProfileView({ user, data, onStatusUpdate, onTabChange, onNavigate, onClose }) {
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const saved = localStorage.getItem('aerostore_delivery_avatar');
    return getCleanAdminAvatar(saved);
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable Driver Personal & Operational Details
  const [name, setName] = useState(() => {
    return localStorage.getItem('aerostore_delivery_name') || user?.name || 'John Doe';
  });
  const [email] = useState(user?.email || 'driver@aerostore.io');
  const [phone, setPhone] = useState(() => {
    return localStorage.getItem('aerostore_delivery_phone') || '+91 98765 43210';
  });
  const [partnerId] = useState(() => {
    return localStorage.getItem('aerostore_delivery_id') || '#DRV-9042';
  });
  const [vehicle, setVehicle] = useState(() => {
    return localStorage.getItem('aerostore_delivery_vehicle') || 'Eco Delivery EV Van • #DL-04-EV-9821';
  });
  const [licenseNo, setLicenseNo] = useState(() => {
    return localStorage.getItem('aerostore_delivery_license') || 'DL-2023-8839210-X (Commercial Heavy & EV)';
  });
  const [depot, setDepot] = useState(() => {
    return localStorage.getItem('aerostore_delivery_depot') || 'Central Distribution Hub (Bay 4 • Ground Dock)';
  });
  const [emergencyContact, setEmergencyContact] = useState(() => {
    return localStorage.getItem('aerostore_delivery_emergency') || 'Sarah Doe (Spouse) • +91 98111 22334';
  });
  const [shiftHours, setShiftHours] = useState(() => {
    return localStorage.getItem('aerostore_delivery_shift') || '08:00 AM – 04:30 PM (Priority Express Shift)';
  });
  const [routeSector, setRouteSector] = useState(() => {
    return localStorage.getItem('aerostore_delivery_sector') || 'Zone Alpha (Tech Corridor & Metro Commercial Sector)';
  });

  const orders = data?.orders || [];
  const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;
  const inTransitCount = orders.filter(o => o.status === 'IN_TRANSIT').length;
  const dispatchedCount = orders.filter(o => o.status === 'DISPATCHED').length;

  const handleSelectAvatar = (avatarId) => {
    setSelectedAvatar(avatarId);
    localStorage.setItem('aerostore_delivery_avatar', avatarId);
    window.dispatchEvent(new Event('storage'));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('aerostore_delivery_name', name);
    localStorage.setItem('aerostore_delivery_phone', phone);
    localStorage.setItem('aerostore_delivery_vehicle', vehicle);
    localStorage.setItem('aerostore_delivery_license', licenseNo);
    localStorage.setItem('aerostore_delivery_depot', depot);
    localStorage.setItem('aerostore_delivery_emergency', emergencyContact);
    localStorage.setItem('aerostore_delivery_shift', shiftHours);
    localStorage.setItem('aerostore_delivery_sector', routeSector);
    window.dispatchEvent(new Event('storage'));
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="profile-dashboard-content admin-profile-content">
      {/* Save Notification */}
      {saveSuccess && (
        <div className="profile-alert-banner success" role="alert">
          <span>✅ Delivery Partner profile details successfully saved & synchronized!</span>
        </div>
      )}

      {/* Identity Card */}
      <div className="admin-profile-card">
        <div className="admin-profile-header-strip" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
          <div
            className="admin-profile-avatar-display"
            style={{
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25), rgba(15, 23, 42, 0.9))',
              borderColor: 'rgba(16, 185, 129, 0.5)',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)'
            }}
          >
            <AdminAvatar avatarId={selectedAvatar} size={70} />
            <span className="admin-avatar-badge" style={{ background: '#10b981' }}>DELV</span>
          </div>

          <div className="admin-profile-header-info">
            <div className="admin-badge-row">
              <span
                className="admin-role-badge"
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}
              >
                🚚 Certified Delivery Partner
              </span>
              <span className="admin-id-badge">{partnerId}</span>
              <span className="admin-status-online" style={{ color: '#10b981' }}>🟢 On Duty & Active</span>
            </div>
            <h3 className="admin-profile-name">{name}</h3>
            <p className="admin-profile-designation">
              Last-Mile Field Courier • {routeSector}
            </p>
          </div>

          <div className="admin-profile-actions">
            {!isEditing ? (
              <button
                type="button"
                className="btn-admin-edit"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <button
                type="button"
                className="btn-admin-cancel"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Profile Avatar Selector */}
        <div className="admin-avatar-selector-section">
          <div className="avatar-section-header">
            <span className="avatar-section-title">🎨 Delivery Partner Avatar</span>
            <span className="avatar-section-sub">Choose your field courier identity illustration</span>
          </div>
          <div className="admin-avatar-grid">
            {DELIVERY_AVATAR_PRESETS.map((av) => (
              <button
                key={av.id}
                type="button"
                className={`admin-avatar-pill ${selectedAvatar === av.id ? 'active' : ''}`}
                style={selectedAvatar === av.id ? { borderColor: '#10b981', boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)' } : {}}
                onClick={() => handleSelectAvatar(av.id)}
                title={av.label}
              >
                <div className="avatar-pill-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AdminAvatar avatarId={av.id} size={34} />
                </div>
                <span className="avatar-pill-label">{av.label.split('(')[1]?.replace(')', '') || 'Driver'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Personal & Operational Courier Details */}
        <div className="admin-details-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 className="profile-section-title" style={{ margin: 0, border: 'none' }}>
              👤 Field Courier Identity & Operational Credentials
            </h4>
            {!isEditing && (
              <button
                type="button"
                className="btn-admin-edit"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Details
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="admin-edit-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Full Driver Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Official Dispatch Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    disabled
                    readOnly
                    title="Official courier email cannot be changed"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Direct Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Assigned Vehicle & Plate No.</label>
                  <input
                    type="text"
                    className="form-control"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="e.g. Eco EV Cargo Van • #DL-04-EV-9821"
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Commercial Driving License Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                    placeholder="e.g. DL-2023-8839210-X"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Home Distribution Depot / Bay</label>
                  <input
                    type="text"
                    className="form-control"
                    value={depot}
                    onChange={(e) => setDepot(e.target.value)}
                    placeholder="e.g. Central Distribution Hub (Bay 4)"
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Emergency Contact Person & Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="e.g. Name • Phone"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Daily Shift Schedule Hours</label>
                  <input
                    type="text"
                    className="form-control"
                    value={shiftHours}
                    onChange={(e) => setShiftHours(e.target.value)}
                    placeholder="e.g. 08:00 AM – 04:30 PM"
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>Assigned Delivery Territory / Zone Sector</label>
                <input
                  type="text"
                  className="form-control"
                  value={routeSector}
                  onChange={(e) => setRouteSector(e.target.value)}
                  placeholder="e.g. Zone Alpha (Tech Park Corridor)"
                  required
                />
              </div>

              <div className="form-actions-row">
                <button
                  type="submit"
                  className="btn-demo-fill"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  💾 Save Profile Changes
                </button>
                <button type="button" className="btn-hero-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="admin-info-grid">
              <div className="admin-info-cell">
                <span className="info-cell-label">Driver Name</span>
                <span className="info-cell-value"><strong>{name}</strong></span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Dispatch Email</span>
                <span className="info-cell-value">{email}</span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Direct Mobile</span>
                <span className="info-cell-value">{phone}</span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Partner ID</span>
                <span className="info-cell-value font-mono">{partnerId}</span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Assigned Vehicle</span>
                <span className="info-cell-value">{vehicle}</span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Commercial License</span>
                <span className="info-cell-value font-mono">{licenseNo}</span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Home Depot Station</span>
                <span className="info-cell-value">{depot}</span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Emergency Contact</span>
                <span className="info-cell-value">{emergencyContact}</span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Shift Hours</span>
                <span className="info-cell-value">{shiftHours}</span>
              </div>
              <div className="admin-info-cell">
                <span className="info-cell-label">Assigned Route</span>
                <span className="info-cell-value">{routeSector}</span>
              </div>
            </div>
          )}
        </div>

        {/* Live Metrics & Performance Records */}
        <div className="admin-security-section">
          <h4 className="profile-section-title">📊 Live Dispatch Metrics & Driver Performance</h4>
          <div className="profile-stats-row">
            <div className="profile-stat-card" style={{ '--stat-accent': '#10b981' }}>
              <span className="profile-stat-value">148+</span>
              <span className="profile-stat-label">Lifetime Deliveries Done</span>
            </div>
            <div className="profile-stat-card" style={{ '--stat-accent': '#6366f1' }}>
              <span className="profile-stat-value">{deliveredCount}</span>
              <span className="profile-stat-label">Delivered This Shift</span>
            </div>
            <div className="profile-stat-card" style={{ '--stat-accent': '#38bdf8' }}>
              <span className="profile-stat-value">99.4%</span>
              <span className="profile-stat-label">On-Time Success SLA</span>
            </div>
            <div className="profile-stat-card" style={{ '--stat-accent': '#f59e0b' }}>
              <span className="profile-stat-value">⭐ 4.95</span>
              <span className="profile-stat-label">Customer Rating (214 Reviews)</span>
            </div>
          </div>
        </div>

        {/* 📍 Assigned Geographic Sector & Route Cluster */}
        <div className="admin-details-section">
          <h4 className="profile-section-title">📍 Assigned Route Cluster & Territory Map</h4>
          <div className="driver-zone-hero-card">
            <div className="zone-hero-header">
              <div>
                <span className="zone-code-tag">📍 Assigned Operational Sector</span>
                <h3 className="zone-title">{routeSector}</h3>
              </div>
              <div className="zone-status-tag">🟢 Route Open & Active</div>
            </div>
            <p className="zone-description">
              Optimized last-mile corridor covering high-density commercial centers, technology complexes, and residential delivery hubs with express priority routing.
            </p>

            <div className="zone-metrics-grid">
              <div className="zone-metric-card">
                <span className="metric-icon">🏢</span>
                <div>
                  <span className="metric-label">Assigned Hub</span>
                  <strong className="metric-val">{depot}</strong>
                </div>
              </div>
              <div className="zone-metric-card">
                <span className="metric-icon">⏱️</span>
                <div>
                  <span className="metric-label">Target Turnaround</span>
                  <strong className="metric-val">18 mins avg per drop-off</strong>
                </div>
              </div>
              <div className="zone-metric-card">
                <span className="metric-icon">⏰</span>
                <div>
                  <span className="metric-label">Shift Window</span>
                  <strong className="metric-val">{shiftHours}</strong>
                </div>
              </div>
              <div className="zone-metric-card">
                <span className="metric-icon">📦</span>
                <div>
                  <span className="metric-label">Assigned Today</span>
                  <strong className="metric-val">{orders.length} packages on route</strong>
                </div>
              </div>
            </div>

            <div className="zone-coverage-box" style={{ marginTop: '1rem' }}>
              <h5 className="coverage-title">🗺️ Sector Waypoints & Key Stop Points:</h5>
              <div className="coverage-tags-list">
                <span className="coverage-tag">📍 Tech Boulevard Hub (Tower A & B)</span>
                <span className="coverage-tag">📍 Financial Plaza & High Street</span>
                <span className="coverage-tag">📍 Cyber City Phase 2 Complex</span>
                <span className="coverage-tag">📍 Central Metro Transit Terminal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Courier Security Clearances & Safety Compliance */}
        <div className="admin-security-section">
          <h4 className="profile-section-title">🛡️ Field Courier Authority & Delivery Compliance</h4>
          <div className="admin-security-grid">
            <div className="security-card">
              <span className="sec-icon">🏁</span>
              <div className="sec-body">
                <strong>Final Delivery Confirmation Authority</strong>
                <p>Exclusive clearance to complete doorstep deliveries and confirm customer handovers.</p>
              </div>
            </div>
            <div className="security-card">
              <span className="sec-icon">🔐</span>
              <div className="sec-body">
                <strong>Chain of Custody & Security Protocol</strong>
                <p>Digital package tracking with geofenced delivery verification and customer signature check.</p>
              </div>
            </div>
            <div className="security-card">
              <span className="sec-icon">⚡</span>
              <div className="sec-body">
                <strong>Zero Emission Green Fleet Verified</strong>
                <p>Certified operator for commercial electric cargo vehicles with rapid turnaround charging access.</p>
              </div>
            </div>
            <div className="security-card">
              <span className="sec-icon">📦</span>
              <div className="sec-body">
                <strong>Fragile & High-Value Cargo Protocol</strong>
                <p>Trained in secure handling for premium electronics, displays, and precision audio gear.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Partner SOP Policy Card */}
        <div className="admin-policy-card" style={{ borderColor: 'rgba(16, 185, 129, 0.35)' }}>
          <div className="policy-card-header">
            <span className="policy-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              🚚 COURIER FIELD LOGISTICS SOP 4.1
            </span>
            <span className="policy-id">Partner Ref: {partnerId}</span>
          </div>
          <h4 className="policy-title">Standard Operating Protocol for Last-Mile Delivery</h4>
          <p className="policy-text">
            Delivery Partners receive packages once status reaches <strong>IN_TRANSIT</strong> from the warehouse fulfillment team.
            Ensure customer identification or delivery verification code is confirmed before marking status as <strong>DELIVERED</strong>.
          </p>
          <div className="policy-actions">
            <button
              type="button"
              className="btn-demo-fill"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              onClick={() => onTabChange && onTabChange('active_dispatches')}
            >
              🚚 View Active Dispatch Orders ({orders.length})
            </button>
            <button
              type="button"
              className="btn-hero-secondary"
              onClick={() => {
                if (onClose) onClose();
                if (onNavigate) onNavigate('dashboard');
              }}
            >
              🖥️ Open Operations Board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Delivery Partner Operations Dashboard & Dispatches Queue ─── */
function DeliveryDashboard({ data, onStatusUpdate, activeTab = 'driver_details', onTabChange, onNavigate, onClose }) {
  const [updatingId, setUpdatingId] = useState(null);

  const orders = data.orders || [];
  const dispatchedCount = orders.filter(o => ['DISPATCHED', 'IN_TRANSIT'].includes(o.status)).length;
  const pendingDispatchCount = orders.filter(o => o.status === 'CONFIRMED').length;
  const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;

  const handleStatusUpdate = async (orderId, currentStatus) => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    if (currentIndex < 0 || currentIndex >= STATUS_FLOW.length - 1) return;

    const nextStatus = STATUS_FLOW[currentIndex + 1];
    setUpdatingId(orderId);
    try {
      await onStatusUpdate(orderId, nextStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="profile-dashboard-content">
      {/* ─── TAB 1: DRIVER PROFILE VIEW (FULL DETAILS & SETTINGS) ─── */}
      {activeTab === 'driver_details' && (
        <DeliveryProfileView
          user={data.user}
          data={data}
          onStatusUpdate={onStatusUpdate}
          onTabChange={onTabChange}
          onNavigate={onNavigate}
          onClose={onClose}
        />
      )}

      {/* ─── TAB 2: ACTIVE DISPATCH ORDERS ─── */}
      {activeTab === 'active_dispatches' && (
        <div className="driver-dispatches-tab-content">
          <div className="profile-stats-row">
            <div className="profile-stat-card" style={{ '--stat-accent': '#10b981' }}>
              <span className="profile-stat-value">{dispatchedCount}</span>
              <span className="profile-stat-label">Dispatched Deliveries</span>
            </div>
            <div className="profile-stat-card" style={{ '--stat-accent': '#f59e0b' }}>
              <span className="profile-stat-value">{pendingDispatchCount}</span>
              <span className="profile-stat-label">Ready for Dispatch</span>
            </div>
            <div className="profile-stat-card" style={{ '--stat-accent': '#6366f1' }}>
              <span className="profile-stat-value">{orders.length}</span>
              <span className="profile-stat-label">Total Assigned</span>
            </div>
          </div>

          <div className="driver-queue-header">
            <h4 className="profile-section-title" style={{ margin: 0, border: 'none' }}>
              📦 Current Route Dispatch Queue ({orders.length})
            </h4>
            <button
              type="button"
              className="profile-option-btn primary"
              onClick={() => {
                if (onClose) onClose();
                if (onNavigate) onNavigate('dashboard');
              }}
            >
              Open Full Screen Queue ↗
            </button>
          </div>

          {(!orders || orders.length === 0) ? (
            <div className="profile-empty-state">
              <span style={{ fontSize: '2.5rem' }}>📦</span>
              <p>No dispatch orders assigned yet.</p>
            </div>
          ) : (
            <div className="profile-orders-list">
              {orders.map((order) => {
                const currentIndex = STATUS_FLOW.indexOf(order.status);
                const canAdvance = currentIndex >= 0 && currentIndex < STATUS_FLOW.length - 1;
                const nextStatus = canAdvance ? STATUS_FLOW[currentIndex + 1] : null;

                return (
                  <div key={order.order_id} className="profile-order-card delivery-order-card">
                    <div className="profile-order-header">
                      <div>
                        <span className="profile-order-id">#{order.order_id || order.id}</span>
                        <span className="profile-order-date">📍 {formatAddress(order.shipping_address)}</span>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    {/* Status progress bar */}
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

                    <div className="profile-order-footer">
                      <span>Items: {order.items?.length || 0} • ₹{(order.total_amount || 0).toFixed(2)}</span>
                      {order.status === 'IN_TRANSIT' && (
                        <button
                          className="btn-status-update"
                          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                          disabled={updatingId === order.order_id}
                          onClick={() => handleStatusUpdate(order.order_id, 'DELIVERED')}
                        >
                          {updatingId === order.order_id
                            ? 'Delivering...'
                            : '🏁 Mark as DELIVERED'
                          }
                        </button>
                      )}
                      {order.status === 'CONFIRMED' && (
                        <span style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>
                          ⏳ Awaiting Shipper Dispatch
                        </span>
                      )}
                      {order.status === 'DISPATCHED' && (
                        <span style={{ color: '#fbbf24', fontSize: '0.82rem', fontWeight: 600 }}>
                          📦 Warehouse Packaged (Awaiting Handover)
                        </span>
                      )}
                      {order.status === 'DELIVERED' && (
                        <span className="delivery-completed-tag">✅ Delivered</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Shipper Dashboard ─── */
function ShipperDashboard({ data, onStatusUpdate, onNavigate, onClose }) {
  const [updatingId, setUpdatingId] = useState(null);
  const orders = data.orders || [];
  const pendingDispatchCount = orders.filter(o => o.status === 'CONFIRMED').length;
  const dispatchedCount = orders.filter(o => o.status === 'DISPATCHED').length;
  const inTransitCount = orders.filter(o => o.status === 'IN_TRANSIT').length;
  const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;

  const handleUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await onStatusUpdate(orderId, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="profile-dashboard-content">
      <div className="profile-stats-row">
        <div className="profile-stat-card" style={{ '--stat-accent': '#ea580c' }}>
          <span className="profile-stat-value">{pendingDispatchCount}</span>
          <span className="profile-stat-label">Needs Dispatch</span>
        </div>
        <div className="profile-stat-card" style={{ '--stat-accent': '#f59e0b' }}>
          <span className="profile-stat-value">{dispatchedCount}</span>
          <span className="profile-stat-label">Dispatched</span>
        </div>
        <div className="profile-stat-card" style={{ '--stat-accent': '#38bdf8' }}>
          <span className="profile-stat-value">{inTransitCount}</span>
          <span className="profile-stat-label">In Transit</span>
        </div>
        <div className="profile-stat-card" style={{ '--stat-accent': '#10b981' }}>
          <span className="profile-stat-value">{deliveredCount}</span>
          <span className="profile-stat-label">Delivered</span>
        </div>
      </div>

      <div className="driver-queue-header" style={{ marginTop: '1.25rem' }}>
        <h4 className="profile-section-title" style={{ margin: 0, border: 'none' }}>
          📦 Warehouse Fulfillment Queue ({orders.length})
        </h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="profile-option-btn secondary"
            onClick={() => {
              if (onClose) onClose();
              if (onNavigate) onNavigate('items');
            }}
          >
            Manage Stock ↗
          </button>
          <button
            type="button"
            className="profile-option-btn primary"
            onClick={() => {
              if (onClose) onClose();
              if (onNavigate) onNavigate('dashboard');
            }}
          >
            Full Board ↗
          </button>
        </div>
      </div>

      {(!orders || orders.length === 0) ? (
        <div className="profile-empty-state">
          <span style={{ fontSize: '2.5rem' }}>📦</span>
          <p>No orders currently in the fulfillment pipeline.</p>
        </div>
      ) : (
        <div className="profile-orders-list">
          {orders.map((order) => {
            const currentIndex = STATUS_FLOW.indexOf(order.status);

            return (
              <div key={order.order_id} className="profile-order-card delivery-order-card">
                <div className="profile-order-header">
                  <div>
                    <span className="profile-order-id">#{order.order_id || order.id}</span>
                    <span className="profile-order-date">📍 {formatAddress(order.shipping_address)}</span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Status progress bar */}
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

                <div className="profile-order-footer">
                  <span>Items: {order.items?.length || 0} • ₹{(order.total_amount || 0).toFixed(2)}</span>
                  {order.status === 'CONFIRMED' && (
                    <button
                      className="btn-status-update"
                      style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}
                      disabled={updatingId === order.order_id}
                      onClick={() => handleUpdate(order.order_id, 'DISPATCHED')}
                    >
                      {updatingId === order.order_id ? 'Dispatching...' : '📦 Mark as DISPATCHED'}
                    </button>
                  )}
                  {order.status === 'DISPATCHED' && (
                    <button
                      className="btn-status-update"
                      style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}
                      disabled={updatingId === order.order_id}
                      onClick={() => handleUpdate(order.order_id, 'IN_TRANSIT')}
                    >
                      {updatingId === order.order_id ? 'Handing over...' : '🚚 Mark as IN TRANSIT'}
                    </button>
                  )}
                  {order.status === 'IN_TRANSIT' && (
                    <span style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 600 }}>
                      🚚 In Transit (Handed over to Delivery Boy)
                    </span>
                  )}
                  {order.status === 'DELIVERED' && (
                    <span className="delivery-completed-tag">✅ Delivered</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Main Profile Dashboard Modal ─── */
export function ProfileDashboard({ isOpen, onClose, onNavigate, initialTab = 'driver_details' }) {
  const { user, openAuthModal } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeDeliveryTab, setActiveDeliveryTab] = useState(initialTab || 'driver_details');

  useEffect(() => {
    if (initialTab) {
      setActiveDeliveryTab(initialTab);
    }
  }, [initialTab, isOpen]);

  const loadDashboard = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProfileHistory();
      setDashboardData(data);
    } catch (err) {
      setError(err.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && user) {
      loadDashboard();
    }
  }, [isOpen, user, loadDashboard]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="modal-overlay open" role="dialog" aria-modal="true" aria-label="User Profile Dashboard">
        <div className="modal-card profile-modal-card" style={{ maxWidth: '480px' }}>
          <div className="modal-header profile-modal-header">
            <div className="modal-title-wrap">
              <div className="profile-avatar-circle">🔐</div>
              <div>
                <h3>Access Your Dashboard</h3>
                <p className="modal-subtitle">Choose a persona or sign in to continue</p>
              </div>
            </div>
            <button className="btn-close-icon" onClick={onClose} aria-label="Close dashboard">
              &times;
            </button>
          </div>

          <div className="profile-modal-body" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
              Sign in to view your orders, tracking details, and account status.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                className="btn-demo-fill"
                onClick={() => login('customer@aerostore.io', 'password123')}
              >
                👤 Quick Login as Customer (Jane Doe)
              </button>
              <button
                className="btn-demo-fill"
                onClick={() => login('admin@aerostore.io', 'admin123')}
              >
                🛡️ Quick Login as Admin
              </button>
              <button
                className="btn-demo-fill"
                onClick={() => login('shipper@aerostore.io', 'shipper123')}
              >
                📦 Quick Login as Warehouse Shipper
              </button>
              <button
                className="btn-demo-fill"
                onClick={() => login('driver@aerostore.io', 'driver123')}
              >
                🚚 Quick Login as Delivery Driver
              </button>
            </div>
          </div>

          <div className="profile-modal-footer">
            <button className="btn-hero-secondary" onClick={onClose} style={{ width: '100%' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    // Optimistic UI update so count increments immediately
    setDashboardData(prev => {
      if (!prev || !prev.orders) return prev;
      const updatedOrders = prev.orders.map(o =>
        o.order_id === orderId ? { ...o, status: newStatus } : o
      );
      const dispatched = updatedOrders.filter(o => ['DISPATCHED', 'IN_TRANSIT'].includes(o.status)).length;
      return {
        ...prev,
        orders: updatedOrders,
        active_deliveries_count: dispatched,
        dispatched_count: dispatched
      };
    });

    try {
      await api.updateOrderStatus(orderId, newStatus);
      await loadDashboard(); // Refresh dashboard data
    } catch (err) {
      setError(err.message || 'Failed to update order status');
      await loadDashboard();
    }
  };

  return (
    <div className="modal-overlay open" role="dialog" aria-modal="true" aria-label="User Profile Dashboard">
      <div className="modal-card profile-modal-card">
        {/* Header */}
        <div className="modal-header profile-modal-header">
          <div className="modal-title-wrap">
            <div className="profile-avatar-circle" style={(user?.role === 'admin' || user?.role === 'shipper' || user?.role === 'delivery_partner' || user?.role === 'delivery') ? { padding: 0, overflow: 'hidden', background: 'transparent' } : {}}>
              {user?.role === 'admin' ? (
                <AdminAvatar avatarId={localStorage.getItem('aerostore_admin_avatar')} size={48} />
              ) : user?.role === 'shipper' ? (
                <AdminAvatar avatarId={localStorage.getItem('aerostore_shipper_avatar')} size={48} />
              ) : (user?.role === 'delivery_partner' || user?.role === 'delivery') ? (
                <AdminAvatar avatarId={localStorage.getItem('aerostore_delivery_avatar')} size={48} />
              ) : (
                user.name ? user.name.charAt(0).toUpperCase() : '?'
              )}
            </div>
            <div>
              <h3>
                {user?.role === 'admin'
                  ? (localStorage.getItem('aerostore_admin_name') || user.name || 'Alex Morgan')
                  : user?.role === 'shipper'
                  ? (localStorage.getItem('aerostore_shipper_name') || user.name || 'Marcus Vance')
                  : (user?.role === 'delivery_partner' || user?.role === 'delivery')
                  ? (localStorage.getItem('aerostore_delivery_name') || user.name || 'John Doe')
                  : (user.name || 'User')}
              </h3>
              <p className="modal-subtitle">
                {user?.role === 'admin'
                  ? `Lead System Administrator • ${user.email}`
                  : user?.role === 'shipper'
                  ? `Warehouse Shipper • ${user.email}`
                  : (user?.role === 'delivery_partner' || user?.role === 'delivery')
                  ? `Delivery Partner (${localStorage.getItem('aerostore_delivery_id') || '#DRV-9042'}) • ${user.email}`
                  : user.email}
              </p>
            </div>
          </div>
          <button className="btn-close-icon" onClick={onClose} aria-label="Close profile dashboard">
            &times;
          </button>
        </div>

        <RoleBadgeLarge role={user.role || 'customer'} />

        {/* Profile Options Tailored to Active Role */}
        <div className="profile-role-options-bar">
          <div className="profile-role-context">
            {user.role === 'admin' ? (
              <span>🛡️ <strong>System Administrator Profile:</strong> Executive store credentials, management role & profile settings</span>
            ) : user.role === 'shipper' ? (
              <span>📦 <strong>Warehouse Shipper Profile:</strong> Logistics operations credentials, shipper identity & fulfillment station</span>
            ) : user.role === 'delivery_partner' ? (
              <span>🚚 <strong>Delivery Partner Profile:</strong> Driver credentials, vehicle info, route sector & dispatch management</span>
            ) : (
              <span>👤 <strong>Member:</strong> Order tracking, loyalty savings & express delivery</span>
            )}
          </div>

          {user.role !== 'admin' && user.role !== 'shipper' && (
            <div className="profile-role-actions-row">
              {user.role === 'delivery_partner' && (
                <>
                  <button
                    type="button"
                    className={`profile-option-btn ${activeDeliveryTab === 'driver_details' ? 'primary active' : ''}`}
                    onClick={() => setActiveDeliveryTab('driver_details')}
                  >
                    👤 Driver Profile & Route Zone
                  </button>
                  <button
                    type="button"
                    className={`profile-option-btn ${activeDeliveryTab === 'active_dispatches' ? 'primary active' : ''}`}
                    onClick={() => setActiveDeliveryTab('active_dispatches')}
                  >
                    🚚 Active Dispatches ({dashboardData?.orders?.length || 0})
                  </button>
                </>
              )}

              {user.role === 'customer' && (
                <>
                  <button
                    type="button"
                    className="profile-option-btn primary"
                    onClick={() => {
                      if (onClose) onClose();
                      if (onNavigate) onNavigate('items');
                    }}
                  >
                    🛍️ Browse Catalog
                  </button>
                  <button
                    type="button"
                    className="profile-option-btn"
                    onClick={() => {
                      if (onClose) onClose();
                      if (onNavigate) onNavigate('cart');
                    }}
                  >
                    🛒 View Cart
                  </button>
                  <button
                    type="button"
                    className="profile-option-btn"
                    onClick={() => {
                      if (onClose) onClose();
                      if (onNavigate) onNavigate('dashboard');
                    }}
                  >
                    📦 All Orders
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="profile-modal-body">
          {loading && (
            <div className="profile-loading">
              <div className="profile-spinner" />
              <p>Loading your dashboard...</p>
            </div>
          )}

          {error && (
            <div role="alert" className="checkout-error-banner" style={{ margin: '0 0 1rem' }}>
              <div className="error-title">⚠️ Error</div>
              <div className="error-desc">{error}</div>
              <button className="btn-demo-fill" onClick={loadDashboard} style={{ marginTop: '0.5rem' }}>
                Retry
              </button>
            </div>
          )}

          {!loading && !error && dashboardData && (
            <>
              {dashboardData.role === 'customer' && <CustomerDashboard data={dashboardData} />}
              {dashboardData.role === 'admin' && (
                <AdminProfileView
                  user={user}
                  onNavigate={onNavigate}
                  onClose={onClose}
                  openAuthModal={openAuthModal}
                />
              )}
              {dashboardData.role === 'delivery_partner' && (
                <DeliveryDashboard
                  data={dashboardData}
                  onStatusUpdate={handleStatusUpdate}
                  activeTab={activeDeliveryTab}
                  onTabChange={setActiveDeliveryTab}
                  onNavigate={onNavigate}
                  onClose={onClose}
                />
              )}
              {dashboardData.role === 'shipper' && (
                <ShipperProfileView
                  user={user}
                  onNavigate={onNavigate}
                  onClose={onClose}
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="profile-modal-footer">
          <button className="btn-hero-secondary" onClick={onClose} style={{ flex: 1 }}>
            {user?.role === 'admin'
              ? 'Close Admin Profile'
              : user?.role === 'shipper'
              ? 'Close Shipper Profile'
              : (user?.role === 'delivery_partner' || user?.role === 'delivery')
              ? 'Close Delivery Profile'
              : 'Close Dashboard'}
          </button>
          {user?.role !== 'admin' && user?.role !== 'shipper' && (
            <button className="btn-demo-fill" onClick={loadDashboard} disabled={loading} style={{ flex: 0 }}>
              🔄 Refresh
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
