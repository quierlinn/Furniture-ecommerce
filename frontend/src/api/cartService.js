import api from './api';

export const cartService = {
  // Add item to cart
  addToCart: (productId, quantity = 1) => {
    return api.post('/cart/add', { productId, quantity });
  },

  // Get cart items
  getCart: () => {
    return api.get('/cart');
  },

  // Remove item from cart
  removeFromCart: (itemId) => {
    return api.delete(`/cart/item/${itemId}`);
  },

  // Update item quantity in cart
  updateCartItem: (itemId, quantity) => {
    return api.put(`/cart/item/${itemId}`, { quantity });
  },

  // Clear cart
  clearCart: () => {
    return api.delete('/cart');
  }
};
