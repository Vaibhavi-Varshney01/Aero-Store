import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import RagChatWindow from '../components/rag/RagChatWindow';
import AdminDocumentIngestion from '../components/rag/AdminDocumentIngestion';
import RagMetricsView from '../components/rag/RagMetricsView';

export default function RagWorkbenchPage({ onNavigate }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'ingest' | 'metrics'

  return (
    <div className="rag-workbench-container" style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '2rem 1.5rem 4rem 1.5rem',
      color: '#f8fafc'
    }}>
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>🧠</span>
            <h1 style={{ margin: 0, fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Production RAG Knowledge Studio
            </h1>
          </div>
          <p style={{ margin: '0.4rem 0 0', color: '#94a3b8', fontSize: '0.95rem' }}>
            Multi-document retrieval augmented generation with streaming SSE, per-chunk citation attribution, and security guardrails.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '0.3rem',
          borderRadius: '12px',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          gap: '0.3rem'
        }}>
          <button
            onClick={() => setActiveTab('chat')}
            style={{
              background: activeTab === 'chat' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'none',
              color: activeTab === 'chat' ? '#fff' : '#94a3b8',
              border: 'none',
              padding: '0.55rem 1.15rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: activeTab === 'chat' ? '0 4px 12px rgba(99, 102, 241, 0.35)' : 'none'
            }}
          >
            💬 RAG Chat
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('ingest')}
              style={{
                background: activeTab === 'ingest' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'none',
                color: activeTab === 'ingest' ? '#fff' : '#94a3b8',
                border: 'none',
                padding: '0.55rem 1.15rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: activeTab === 'ingest' ? '0 4px 12px rgba(99, 102, 241, 0.35)' : 'none'
              }}
            >
              📥 Ingestion Portal (Admin)
            </button>
          )}

          <button
            onClick={() => setActiveTab('metrics')}
            style={{
              background: activeTab === 'metrics' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'none',
              color: activeTab === 'metrics' ? '#fff' : '#94a3b8',
              border: 'none',
              padding: '0.55rem 1.15rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: activeTab === 'metrics' ? '0 4px 12px rgba(99, 102, 241, 0.35)' : 'none'
            }}
          >
            📊 Metrics & Health
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'chat' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <RagChatWindow />
          <RagMetricsView />
        </div>
      )}

      {activeTab === 'ingest' && isAdmin && (
        <AdminDocumentIngestion onIngestSuccess={() => {}} />
      )}

      {activeTab === 'metrics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <RagMetricsView />
          {isAdmin && <AdminDocumentIngestion onIngestSuccess={() => {}} />}
        </div>
      )}
    </div>
  );
}
