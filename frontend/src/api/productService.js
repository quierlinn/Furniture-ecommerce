import api from './api';

export const productService = {
  // Get all products with optional filters
  getProducts: (params = {}) => {
    return api.get('/products', { params });
  },

  // Get a single product by ID
  getProductById: (id) => {
    return api.get(`/products/${id}`);
  },

  // Get products by category
  getProductsByCategory: (categoryId, params = {}) => {
    return api.get('/products', { 
      params: { 
        ...params,
        category: categoryId 
      } 
    });
  },

  // Create a new product (admin only)
  createProduct: (productData) => {
    return api.post('/products', productData);
  },

  // Update a product (admin only)
  updateProduct: (id, productData) => {
    return api.put(`/products/${id}`, productData);
  },

  // Delete a product (admin only)
  deleteProduct: (id) => {
    return api.delete(`/products/${id}`);
  }
};
