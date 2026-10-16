import React, { useState, useEffect } from 'react';
import { ragService } from '../../services/ragService';

export default function RagMetricsView() {
  const [metrics, setMetrics] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, h] = await Promise.all([
        ragService.getMetrics(),
        ragService.getHealth()
      ]);
      setMetrics(m);
      setHealth(h);
    } catch (e) {
      console.error('Failed to load metrics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.75)',
      borderRadius: '16px',
      border: '1px solid rgba(99, 102, 241, 0.25)',
      padding: '1.5rem',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.3rem' }}>📈</span>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
            RAG Pipeline Telemetry & Health
          </h3>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          style={{
            background: 'none',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            color: '#94a3b8',
            borderRadius: '6px',
            padding: '0.3rem 0.6rem',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {/* Health */}
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>SYSTEM HEALTH</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: health?.status === 'UP' ? '#10b981' : '#f59e0b'
            }} />
            <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '1.1rem' }}>
              {health?.status || 'CHECKING'}
            </span>
          </div>
          <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '0.2rem' }}>
            Vector Store: {health?.components?.vector_store?.status || 'N/A'}
          </div>
        </div>

        {/* Latency */}
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>AVG RETRIEVAL TIME</div>
          <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '1.3rem', marginTop: '0.3rem' }}>
            {metrics?.query_performance?.avg_retrieval_latency_ms || 0} ms
          </div>
          <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '0.2rem' }}>
            Total queries: {metrics?.query_performance?.total_queries || 0}
          </div>
        </div>

        {/* Chunks */}
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>INDEXED VECTORS</div>
          <div style={{ color: '#818cf8', fontWeight: 700, fontSize: '1.3rem', marginTop: '0.3rem' }}>
            {metrics?.vector_store?.total_chunks_indexed || 0} chunks
          </div>
          <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '0.2rem' }}>
            Across {metrics?.vector_store?.total_documents || 0} documents
          </div>
        </div>

        {/* User Satisfaction */}
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>USER SATISFACTION</div>
          <div style={{ color: '#34d399', fontWeight: 700, fontSize: '1.3rem', marginTop: '0.3rem' }}>
            {metrics?.user_feedback?.satisfaction_rate_percent || 100}% 👍
          </div>
          <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '0.2rem' }}>
            {metrics?.user_feedback?.positive_count || 0} Up / {metrics?.user_feedback?.negative_count || 0} Down
          </div>
        </div>
      </div>
    </div>
  );
}
