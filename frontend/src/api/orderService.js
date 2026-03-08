import api from './api';

export const orderService = {
  // Create a new order
  createOrder: (orderData) => {
    return api.post('/orders', orderData);
  },

  // Get user's orders
  getUserOrders: () => {
    return api.get('/orders/user');
  },

  // Get order by ID
  getOrderById: (id) => {
    return api.get(`/orders/${id}`);
  },

  // Get all orders (admin only)
  getAllOrders: () => {
    return api.get('/orders');
  },

  // Update order status (admin only)
  updateOrderStatus: (orderId, status) => {
    return api.put(`/orders/${orderId}/status`, { status });
  }
};
