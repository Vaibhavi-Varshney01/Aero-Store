import React from 'react';

export function TrustBar() {
  const pillars = [
    {
      icon: '🚚',
      title: 'Free 2-Day Express Delivery',
      desc: 'On all orders above $75 with automated tracking'
    },
    {
      icon: '🛡️',
      title: '2-Year Hardware Warranty',
      desc: 'Comprehensive protection and fast replacement'
    },
    {
      icon: '🔄',
      title: '30-Day Risk-Free Returns',
      desc: 'No-hassle returns and 100% money back'
    },
    {
      icon: '🤖',
      title: '24/7 AI Personal Concierge',
      desc: 'Instant answers on specs, policies & orders'
    }
  ];

  return (
    <section className="trust-bar-section" aria-label="Customer Guarantees and Services">
      <div className="trust-bar-container">
        {pillars.map((item, idx) => (
          <div key={idx} className="trust-card">
            <div className="trust-icon-box">{item.icon}</div>
            <div className="trust-text">
              <h4 className="trust-title">{item.title}</h4>
              <p className="trust-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
