/**
 * API service for products
 */

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Fetch all products
 * @returns {Promise<Array>} Array of products
 */
export async function getProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch product by ID
 * @param {number|string} id - Product ID
 * @returns {Promise<Object>} Product object
 */
export async function getProductById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of products in the category
 */
export async function getProductsByCategory(category) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    throw error;
  }
}
