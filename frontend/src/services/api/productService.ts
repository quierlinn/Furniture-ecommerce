import { apiClient } from '@/lib/api/client';
import { Product, ProductFilters } from '@/types/product';

export const productService = {
  // Get all products with optional filters
  getProducts: async (filters?: ProductFilters) => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.size) params.append('size', filters.size.toString());
    }
    
    const response = await apiClient.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: string) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId: string, filters?: ProductFilters) => {
    const params = new URLSearchParams();
    params.append('category', categoryId);
    
    if (filters) {
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.size) params.append('size', filters.size.toString());
    }
    
    const response = await apiClient.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get product categories
  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id: string) => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },
};
