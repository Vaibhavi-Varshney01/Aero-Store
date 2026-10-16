import React from 'react';

export function UseCaseBanner({ onSelectUseCase }) {
  const useCases = [
    { id: 1, label: '🏛️ UC1: Architecture & ADRs', title: 'Inspect Use Case 1: Architecture & ADRs' },
    { id: 2, label: '📄 UC2: OpenAPI Scaffolding', title: 'Inspect Use Case 2: OpenAPI 3.0 Contract' },
    { id: 3, label: '🎨 UC3: A11y & UI Risk', title: 'Inspect Use Case 3: Frontend Accessibility Audit' },
    { id: 4, label: '🔍 UC4: AI Code Review', title: 'Inspect Use Case 4: AI Code Review & Sonar' },
    { id: 5, label: '🧪 UC5: Edge Simulations', title: 'Inspect Use Case 5: Edge Case Simulations' }
  ];

  return (
    <aside className="use-cases-banner" aria-label="AI Engineering Use Cases Quick Launcher">
      <div className="use-cases-header">
        <div className="use-cases-title">
          <span>🚀 Capgemini AI Engineering Suite (Use Cases 1–5)</span>
        </div>
        <div className="use-cases-desc">
          Click any use case to inspect live generated architectures, OpenAPI contracts, accessibility audits, and simulations:
        </div>
      </div>
      <nav className="use-cases-pills" aria-label="Use Case Shortcuts">
        {useCases.map((uc) => (
          <button
            key={uc.id}
            id={`btn-uc-${uc.id}`}
            className="pill-btn"
            onClick={() => onSelectUseCase(uc.id)}
            aria-label={uc.title}
          >
            {uc.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
