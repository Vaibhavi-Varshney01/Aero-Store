import React from 'react';

export function CategoryTabs({ selectedCategory, onSelectCategory }) {
  const categories = [
    { id: 'All', label: 'All Products' },
    { id: 'Electronics', label: 'Electronics' },
    { id: 'Accessories', label: 'Accessories' },
    { id: 'Wearables', label: 'Wearables' },
    { id: 'Apparel', label: 'Apparel (Flash Sale)' }
  ];

  return (
    <nav className="category-tabs" aria-label="Product Categories">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            id={`tab-${cat.id.toLowerCase()}`}
            className={`tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
            aria-pressed={isActive}
          >
            {cat.label}
          </button>
        );
      })}
    </nav>
  );
}
