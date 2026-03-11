import React, { useState, useEffect } from 'react';
import { productService } from '../api/productService';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts({ size: 8 });
        setProducts(response.data.content);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      const response = await productService.getProducts({ search: query });
      setProducts(response.data.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1>Welcome to Our Furniture Store</h1>
          <p>Discover beautiful and affordable furniture for your home</p>
        </div>
      </section>

      <section className="search-section">
        <div className="container">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          <ProductGrid products={products} loading={loading} error={error} />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
