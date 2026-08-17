import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export const FilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  ordering,
  setOrdering,
  categoryCounts = {}
}) => {
  const categories = [
    'All',
    'Trip',
    'Birthday',
    'Launch',
    'Wedding',
    'Exam',
    'Anniversary',
    'Other',
  ];

  return (
    <div className="filter-bar">
      <div className="search-input-wrapper">
        <Search className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search events by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-categories">
        {categories.map((cat) => {
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              className={`filter-chip ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat} {cat !== 'All' && count > 0 && <sup style={{ fontSize: '0.65rem', marginLeft: '2px' }}>{count}</sup>}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowUpDown size={15} style={{ color: '#888' }} />
        <select
          className="form-select"
          style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '9999px' }}
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
        >
          <option value="target_date">Nearest First</option>
          <option value="-target_date">Furthest First</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
