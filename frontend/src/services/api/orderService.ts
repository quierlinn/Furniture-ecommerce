import { apiClient } from '@/lib/api/client';
import { Order, CreateOrderRequest, CreateOrderResponse } from '@/types/order';

export const orderService = {
  // Create a new order
  createOrder: async (orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<CreateOrderResponse>('/orders', orderData);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${orderId}`);
    return response.data;
  },

  // Get orders for a user
  getUserOrders: async (userId: string) => {
    const response = await apiClient.get(`/orders/user/${userId}`);
    return response.data;
  },

  // Get all orders (for admin)
  getAllOrders: async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  // Update order status (for admin)
  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    const response = await apiClient.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId: string) => {
    const response = await apiClient.delete(`/orders/${orderId}`);
    return response.data;
  },
};
