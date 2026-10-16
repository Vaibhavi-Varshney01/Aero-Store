import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function UseCaseModal({ isOpen, initialUcId, onClose }) {
  const [activeUc, setActiveUc] = useState(initialUcId || 1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [simScenario, setSimScenario] = useState('out_of_stock');

  useEffect(() => {
    if (initialUcId) {
      setActiveUc(initialUcId);
    }
  }, [initialUcId]);

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    async function loadData() {
      setLoading(true);
      setData(null);
      try {
        const res = await api.getUseCaseData(activeUc, simScenario);
        if (mounted) setData(res);
      } catch (err) {
        if (mounted) setData({ error: err.message || 'Failed to load telemetry' });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => { mounted = false; };
  }, [isOpen, activeUc, simScenario]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="use-case-modal"
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      aria-label="Use Case Details Modal"
    >
      <div className="modal-card" style={{ maxWidth: '820px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🚀</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>AI Engineering Suite Inspector</h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                Inspect live generated architectures, OpenAPI contracts, accessibility audits, and edge simulations
              </p>
            </div>
          </div>
          <button
            id="btn-close-use-case"
            className="btn-close-icon"
            onClick={onClose}
            aria-label="Close Use Case inspector"
          >
            &times;
          </button>
        </div>

        {/* UC Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', marginBottom: '1.25rem' }}>
          {[
            { id: 1, label: 'UC1: Architecture' },
            { id: 2, label: 'UC2: OpenAPI Contract' },
            { id: 3, label: 'UC3: A11y & UI Risk' },
            { id: 4, label: 'UC4: AI Code Review' },
            { id: 5, label: 'UC5: Edge Simulations' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeUc === tab.id ? 'active' : ''}`}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
              onClick={() => setActiveUc(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content body */}
        <div style={{ minHeight: '320px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
              <p>Fetching real-time Use Case telemetry...</p>
            </div>
          ) : !data ? (
            <p style={{ color: '#94a3b8' }}>No data loaded.</p>
          ) : (
            <div>
              {/* UC 1 */}
              {activeUc === 1 && (
                <div>
                  <h4 style={{ color: '#38bdf8', marginBottom: '0.4rem' }}>
                    System Architecture: {data.architecture_json?.architecture_style || 'Microservices'}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                    Target Scale: {data.architecture_json?.target_scale || '10k concurrent users'} | Protocol: Contract-First REST & OpenAPI 3.0
                  </p>

                  <h5 style={{ color: '#a5b4fc', marginBottom: '0.35rem' }}>ADR-001 (Microservices Adoption):</h5>
                  <pre className="telemetry-pre">{data.adr_001}</pre>

                  <h5 style={{ color: '#a5b4fc', marginTop: '1rem', marginBottom: '0.35rem' }}>
                    ADR-002 (Non-AI in Payment Logic):
                  </h5>
                  <pre className="telemetry-pre">{data.adr_002}</pre>
                </div>
              )}

              {/* UC 2 */}
              {activeUc === 2 && (
                <div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <span
                      style={{
                        background: data.validation_result?.valid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: data.validation_result?.valid ? '#34d399' : '#f87171',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '999px',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      {data.validation_result?.valid ? 'OpenAPI 3.0 Contract: 100% VALID' : 'INVALID'}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      Title: {data.validation_result?.title} | Version: {data.validation_result?.version}
                    </span>
                  </div>

                  <h5 style={{ color: '#a5b4fc', marginBottom: '0.35rem' }}>Retry vs Re-prompt Benchmark Telemetry:</h5>
                  <pre className="telemetry-pre">{JSON.stringify(data.retry_vs_reprompt, null, 2)}</pre>

                  <h5 style={{ color: '#a5b4fc', marginTop: '1rem', marginBottom: '0.35rem' }}>OpenAPI Contract Snippet:</h5>
                  <pre className="telemetry-pre">{data.openapi_yaml_snippet || data.openapi_yaml?.substring(0, 1200) || 'Loaded'}</pre>
                </div>
              )}

              {/* UC 3 */}
              {activeUc === 3 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h4 style={{ color: '#34d399', margin: 0 }}>
                      WCAG 2.1 AA Compliance Score: {data.a11y_audit?.compliance_score || '100%'}
                    </h4>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      Passed {data.a11y_audit?.passed_checks} of {data.a11y_audit?.total_checks} checks
                    </span>
                  </div>

                  <h5 style={{ color: '#a5b4fc', marginBottom: '0.35rem' }}>Accessibility Audit Findings:</h5>
                  <pre className="telemetry-pre">{JSON.stringify(data.a11y_audit?.detailed_findings, null, 2)}</pre>

                  <h5 style={{ color: '#a5b4fc', marginTop: '1rem', marginBottom: '0.35rem' }}>UI Risk Analysis & Mitigations:</h5>
                  <pre className="telemetry-pre">{JSON.stringify(data.ui_risks, null, 2)}</pre>
                </div>
              )}

              {/* UC 4 */}
              {activeUc === 4 && (
                <div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                      Risk Level: {data.ai_review_json?.risk_level}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      Complexity Score: {data.ai_review_json?.complexity_score}
                    </span>
                  </div>

                  <h5 style={{ color: '#a5b4fc', marginBottom: '0.35rem' }}>AI Code Review Report:</h5>
                  <pre className="telemetry-pre">{JSON.stringify(data.ai_review_json, null, 2)}</pre>

                  <h5 style={{ color: '#a5b4fc', marginTop: '1rem', marginBottom: '0.35rem' }}>SonarQube Static AST Scan:</h5>
                  <pre className="telemetry-pre">{JSON.stringify(data.sonarqube_report, null, 2)}</pre>
                </div>
              )}

              {/* UC 5 */}
              {activeUc === 5 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#a5b4fc' }}>Select Edge Simulation:</span>
                    {[
                      { id: 'out_of_stock', label: 'Out of Stock' },
                      { id: 'payment_timeout', label: 'Payment Timeout (1500ms SLA)' },
                      { id: 'invalid_coupon', label: 'Invalid Coupon' },
                      { id: 'occ_race_condition', label: 'OCC Version Conflict' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        className={`pill-btn ${simScenario === s.id ? 'active' : ''}`}
                        style={{
                          fontSize: '0.78rem',
                          background: simScenario === s.id ? 'var(--accent-primary)' : 'rgba(15, 23, 42, 0.8)'
                        }}
                        onClick={() => setSimScenario(s.id)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span
                      style={{
                        background: data.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                        color: data.status === 'SUCCESS' ? '#34d399' : '#38bdf8',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 700
                      }}
                    >
                      Simulation: {data.scenario || simScenario}
                    </span>
                    {data.latency_ms !== undefined && (
                      <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        Latency: {data.latency_ms}ms | SLA Breached: {data.sla_breached ? 'YES' : 'NO'}
                      </span>
                    )}
                  </div>

                  <pre className="telemetry-pre">{JSON.stringify(data, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
