// Components/Filters/ProductFilter.js
import { useState, useEffect } from 'react';
import Style from "./style.module.css";

export default function ProductFilter({ products, onFilterChange }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    searchQuery: '',
    sortBy: 'default'
  });

  const categories = [...new Set(products.map(product => product.section))];
  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: 'Under $100', value: '0-100000' },
    { label: '$100 to $500', value: '100000-500000' },
    { label: '$500 to $1000', value: '500000-1000000' },
    { label: 'Above $1000', value: '1000000-9999999' }
  ];

  const sortOptions = [
    { label: 'Default', value: 'default' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Newest', value: 'newest' }
  ];

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

  useEffect(() => {
    const filteredProducts = applyFilters(products, filters);
    onFilterChange(filteredProducts);
  }, [filters, products]);

  const applyFilters = (products, filters) => {
    let result = [...products];
    
    if (filters.category) {
      result = result.filter(product => product.section === filters.category);
    }
    
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(product => product.price >= min && product.price <= max);
    }
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(product => 
        product.productName.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    
    return result;
  };

  return (
    <div className={Style.filterWrapper}>
      <button 
        onClick={toggleFilters} 
        className={Style.filterToggleButton}
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
      
      {showFilters && (
        <div className={Style.filterContainer}>
          <div className={Style.filterSection}>
            <h3>Product Filters</h3>
            
            <div className={Style.filterGroup}>
              <label>Search</label>
              <input
                type="text"
                name="searchQuery"
                value={filters.searchQuery}
                onChange={handleInputChange}
                placeholder="Product name or description..."
              />
            </div>

            <div className={Style.filterGroup}>
              <label>Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleInputChange}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className={Style.filterGroup}>
              <label>Price Range</label>
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleInputChange}
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            <div className={Style.filterGroup}>
              <label>Sort By</label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleInputChange}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}