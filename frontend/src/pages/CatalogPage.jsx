import React, { useState, useEffect } from 'react';
import { productService } from '../api/productService';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          ...filters
        };
        
        const response = await productService.getProducts(params);
        setProducts(response.data.products || response.data);
        
        // Calculate total pages based on total count
        const totalCount = response.data.totalCount || response.data.length;
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, filters]);

  const handleSearch = (query) => {
    setFilters(prev => ({
      ...prev,
      search: query,
      page: 1
    }));
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="catalog-page">
      <div className="container">
        <h1>Our Furniture Collection</h1>
        
        <div className="filters">
          <SearchBar onSearch={handleSearch} />
          
          <select 
            value={filters.category} 
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="living-room">Living Room</option>
            <option value="bedroom">Bedroom</option>
            <option value="dining">Dining</option>
            <option value="office">Office</option>
          </select>
          
          <select 
            value={`${filters.sortBy}-${filters.sortOrder}`} 
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters(prev => ({
                ...prev,
                sortBy,
                sortOrder
              }));
            }}
            className="filter-select"
          >
            <option value="name-asc">Sort by Name (A-Z)</option>
            <option value="name-desc">Sort by Name (Z-A)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
        
        <ProductGrid products={products} loading={loading} error={error} />
        
        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
