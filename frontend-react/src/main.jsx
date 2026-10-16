import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b0f19',
          color: '#f8fafc',
          padding: '2rem',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.85)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '1rem',
            padding: '2.5rem',
            maxWidth: '520px',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛍️</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: '#f8fafc' }}>
              Welcome to AeroStore
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              A live interface update was completed. Please reload the page to refresh your session.
            </p>
            {this.state.error && (
              <div style={{
                color: '#fca5a5',
                background: 'rgba(0,0,0,0.5)',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.82rem',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '1.25rem',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                maxHeight: '180px'
              }}>
                <strong>Error:</strong> {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: '#fff',
                border: 'none',
                padding: '0.8rem 2rem',
                borderRadius: '0.5rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)'
              }}
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
