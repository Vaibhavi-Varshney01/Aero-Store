import React from 'react';
import { ProductCard } from './ProductCard';

export function ProductGrid({
  products,
  loading,
  error,
  onRetry,
  onQuickView,
  onToggleCompare,
  comparedProductIds = []
}) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
        <p style={{ fontWeight: 600 }}>Loading flagship electronics catalog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        style={{
          gridColumn: '1 / -1',
          padding: '2.5rem',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          textAlign: 'center',
          maxWidth: '520px',
          margin: '2rem auto'
        }}
      >
        <h3 style={{ marginBottom: '0.5rem', color: '#f87171' }}>Unable to load catalog</h3>
        <p style={{ color: '#94a3b8', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
          {error || 'Please ensure the backend is running at http://127.0.0.1:8000.'}
        </p>
        <button
          onClick={onRetry}
          className="btn-checkout"
          style={{ maxWidth: '180px', margin: '0 auto', padding: '0.65rem' }}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '4rem 1rem', color: '#94a3b8' }}>
        <p style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>🔍 No products match your criteria</p>
        <p style={{ fontSize: '0.9rem' }}>Try clearing your search query or selecting a different collection tab.</p>
      </div>
    );
  }

  return (
    <section className="product-grid" id="product-grid" aria-label="Product Catalog">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
          onToggleCompare={onToggleCompare}
          isCompared={comparedProductIds.includes(product.id)}
        />
      ))}
    </section>
  );
}
