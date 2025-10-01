// Components/Filters/ProductFilter.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import Style from "./style.module.css";

export default function ProductFilter({ products, onFilterChange }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    searchQuery: '',
    sortBy: 'default'
  });

  // Memoize expensive calculations
  const categories = useMemo(() => 
    [...new Set(products.map(product => product.section).filter(Boolean))], 
    [products]
  );

  const priceRanges = useMemo(() => [
  { label: 'All Prices', value: '' },
  { label: 'Under $10', value: '0-10' },
  { label: '$10 to $50', value: '10-50' },
  { label: '$50 to $100', value: '50-100' },
  { label: '$100 to $200', value: '100-200' },
  { label: '$200 to $400', value: '200-400' },
  { label: '$600 to $800', value: '600-800' },
  { label: '$800 to $1000', value: '800-1000' },
  { label: '$1000 to $2000', value: '1000-2000' },
  { label: '$2000 to $3000', value: '2000-3000' },
  { label: 'Above $4000', value: '4000-9999' }
], []);

  const sortOptions = useMemo(() => [
    { label: 'Default', value: 'default' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Newest', value: 'newest' }
  ], []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Memoized filter function
  const applyFilters = useCallback((products, filters) => {
    let result = [...products];
    
    // Category filter
    if (filters.category) {
      result = result.filter(product => product.section === filters.category);
    }
    
    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(product => {
        const price = product.price || 0;
        return price >= min && price <= max;
      });
    }
    
    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(product => {
        const productName = product.productName || '';
        const description = product.description || '';
        return (
          productName.toLowerCase().includes(query) || 
          description.toLowerCase().includes(query)
        );
      });
    }
    
    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        // Default sorting (no change)
        break;
    }
    
    return result;
  }, []);

  // Debounced filter effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filteredProducts = applyFilters(products, filters);
      onFilterChange(filteredProducts);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters, products, applyFilters, onFilterChange]);

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      searchQuery: '',
      sortBy: 'default'
    });
  };

  return (
    <div className={Style.filterWrapper}>
      <div className={Style.filterHeader}>
        <button 
          onClick={toggleFilters} 
          className={Style.filterToggleButton}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        {(filters.category || filters.priceRange || filters.searchQuery || filters.sortBy !== 'default') && (
          <button onClick={clearFilters} className={Style.clearFiltersButton}>
            Clear All Filters
          </button>
        )}
      </div>
      
      {showFilters && (
        <div className={Style.filterContainer}>
          <div className={Style.filterSection}>
            <h3>Product Filters</h3>
            
            <div className={Style.filterGroup}>
              <label>Search Products</label>
              <input
                type="text"
                name="searchQuery"
                value={filters.searchQuery}
                onChange={handleInputChange}
                placeholder="Search by product name or description..."
                className={Style.filterInput}
              />
            </div>

            <div className={Style.filterGroup}>
              <label>Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleInputChange}
                className={Style.filterSelect}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className={Style.filterGroup}>
              <label>Price Range</label>
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleInputChange}
                className={Style.filterSelect}
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={Style.filterGroup}>
              <label>Sort By</label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleInputChange}
                className={Style.filterSelect}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}