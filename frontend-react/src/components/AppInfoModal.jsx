import React from 'react';

export function AppInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" role="dialog" aria-modal="true" aria-label="Application Overview and Architecture">
      <div className="modal-card" style={{ maxWidth: '800px', width: '90%' }}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span style={{ fontSize: '1.8rem' }}>ℹ️</span>
            <div>
              <h3>About AeroStore Platform</h3>
              <p className="modal-subtitle">Enterprise E-Commerce, SSMS Database & 5 AI Engineering Use Cases</p>
            </div>
          </div>
          <button className="btn-close-icon" onClick={onClose} aria-label="Close app info modal">
            &times;
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingTop: '1rem' }}>
          {/* Section 1: Architecture & Database */}
          <div style={{ background: '#0f172a', padding: '1.2rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <h4 style={{ color: '#38bdf8', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🗄️ Microsoft SQL Server (SSMS) Integration
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
              The application persistence layer is 100% segregated and connected directly to <strong>SQL Server Management Studio (SSMS)</strong> using <code>pyodbc</code> on database <code>AeroStoreDB</code>. It features automatic schema initialization, T-SQL migration scripts, and zero local file dependency.
            </p>
          </div>

          {/* Section 2: Role-Based Access Control */}
          <div style={{ background: '#0f172a', padding: '1.2rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <h4 style={{ color: '#a855f7', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🛡️ Role-Based Access Control (RBAC)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px' }}>
                <strong style={{ color: '#e2e8f0' }}>👤 Customer</strong>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>jane.doe@example.com</div>
              </div>
              <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px' }}>
                <strong style={{ color: '#38bdf8' }}>🛡️ Admin</strong>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>admin@example.com</div>
              </div>
              <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px' }}>
                <strong style={{ color: '#34d399' }}>🚚 Delivery Partner</strong>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>delivery@example.com</div>
              </div>
            </div>
          </div>

          {/* Section 3: AI Engine & RAG */}
          <div style={{ background: '#0f172a', padding: '1.2rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <h4 style={{ color: '#34d399', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🤖 Embedded GenAI Assistant & Vector RAG
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
              Features a real-time conversational shopping assistant with Retrieval-Augmented Generation (RAG). Queries vector index of product specifications, warranties, ADR decision records, and return policies with source citations.
            </p>
          </div>

          {/* Section 4: 5 AI Engineering Use Cases */}
          <div style={{ background: '#0f172a', padding: '1.2rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <h4 style={{ color: '#f59e0b', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚡ 5 AI Engineering Use Cases
            </h4>
            <ul style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, paddingLeft: '1.2rem', lineHeight: '1.6' }}>
              <li><strong>UC1 - Architecture Engine</strong>: Modular decomposition & ADR 001/002 specs</li>
              <li><strong>UC2 - Scaffolding & OpenAPI</strong>: Contract-first API validation & RFC 7807 error models</li>
              <li><strong>UC3 - UI/UX & Accessibility</strong>: WCAG 2.1 AA compliance audit & contrast verification</li>
              <li><strong>UC4 - Code Review & License Audit</strong>: Static analysis & permissive license compliance</li>
              <li><strong>UC5 - Edge-Case Testing & Simulation</strong>: Chaos engineering & OCC race condition testing</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer" style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button className="btn-hero-primary" onClick={onClose} style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
            Got It! Close
          </button>
        </div>
      </div>
    </div>
  );
}
