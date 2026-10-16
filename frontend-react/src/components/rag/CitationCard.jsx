import React, { useState } from 'react';

export default function CitationCard({ citation, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.7)',
      border: '1px solid rgba(99, 102, 241, 0.25)',
      borderRadius: '8px',
      padding: '0.6rem 0.85rem',
      marginBottom: '0.4rem',
      fontSize: '0.8rem',
      color: '#cbd5e1',
      transition: 'all 0.2s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#fff',
            padding: '0.1rem 0.45rem',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 700
          }}>
            #{index + 1}
          </span>
          <strong style={{ color: '#f8fafc' }}>📄 {citation.filename}</strong>
          <span style={{
            background: 'rgba(148, 163, 184, 0.15)',
            padding: '0.1rem 0.4rem',
            borderRadius: '4px',
            fontSize: '0.72rem',
            color: '#94a3b8'
          }}>
            {citation.section_or_page}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            color: citation.score > 0.4 ? '#34d399' : '#38bdf8',
            fontSize: '0.75rem',
            fontWeight: 600
          }}>
            Score: {(citation.score * 100).toFixed(1)}%
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'none',
              border: 'none',
              color: '#818cf8',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.1rem 0.3rem'
            }}
          >
            {expanded ? 'Hide Excerpt ▲' : 'Inspect Excerpt ▼'}
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{
          marginTop: '0.5rem',
          padding: '0.5rem 0.75rem',
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '6px',
          borderLeft: '3px solid #6366f1',
          fontSize: '0.78rem',
          lineHeight: '1.45',
          color: '#e2e8f0',
          whiteSpace: 'pre-wrap'
        }}>
          {citation.content || citation.snippet}
        </div>
      )}
    </div>
  );
}
