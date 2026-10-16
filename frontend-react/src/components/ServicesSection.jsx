import React, { useEffect, useRef, useState } from 'react';

const services = [
  {
    icon: '🛒',
    title: 'Easy Shopping',
    description: 'Browse our curated collection of premium electronics. Smart search, category filters, and quick-view details make finding your perfect product effortless.',
    accent: '#6366f1'
  },
  {
    icon: '🚚',
    title: 'Express Delivery',
    description: 'Free 2-day express shipping on orders over $75. Real-time tracking from warehouse to your doorstep so you always know where your package is.',
    accent: '#10b981'
  },
  {
    icon: '🤖',
    title: 'AI Shopping Assistant',
    description: 'Got questions? Our intelligent AI concierge can help you compare products, find the best deals, and get instant answers about specs and availability.',
    accent: '#38bdf8'
  },
  {
    icon: '🔒',
    title: 'Secure Payments',
    description: '256-bit SSL encrypted checkout with support for Visa, Mastercard, Apple Pay, and Google Pay. Your payment information is always safe with us.',
    accent: '#f59e0b'
  },
  {
    icon: '🔄',
    title: 'Hassle-Free Returns',
    description: 'Changed your mind? No worries. Enjoy our 30-day money-back guarantee with free return shipping. No questions asked.',
    accent: '#f43f5e'
  },
  {
    icon: '⭐',
    title: 'Premium Quality',
    description: 'Every product in our catalog is backed by a 2-year hardware warranty. We partner only with top-tier brands to deliver excellence.',
    accent: '#a855f7'
  }
];

export function ServicesSection({ onCreateAccount }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="services-section"
      ref={sectionRef}
      aria-label="AeroStore Services"
    >
      <div className="services-container">
        <div className="services-header">
          <span className="services-eyebrow">WHY CHOOSE AEROSTORE</span>
          <h2 className="services-title">
            Everything You Need for a <span className="services-title-gradient">Premium Shopping Experience</span>
          </h2>
          <p className="services-subtitle">
            From browsing to delivery, we've crafted every step to be seamless, secure, and delightful.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`service-card ${visible ? 'service-card-visible' : ''}`}
              style={{
                transitionDelay: `${index * 100}ms`,
                '--service-accent': service.accent
              }}
            >
              <div className="service-card-icon" style={{ background: `${service.accent}18` }}>
                <span>{service.icon}</span>
              </div>
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-desc">{service.description}</p>
              <div className="service-card-accent-line" style={{ background: service.accent }} />
            </div>
          ))}
        </div>

        <div className="services-cta-wrap">
          <p className="services-cta-text">
            Ready to experience the future of online shopping?
          </p>
          <button
            className="btn-services-cta"
            onClick={onCreateAccount}
            aria-label="Create your AeroStore account"
          >
            Create Your Free Account
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
