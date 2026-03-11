export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  attributes?: Record<string, string>;
}

export interface OrderAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  address: OrderAddress;
  createdAt: string;
  updatedAt: string;
  paymentMethod: 'card' | 'cash' | 'online' | 'installments';
  deliveryMethod: 'courier' | 'pickup' | 'transport';
  comment?: string;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
    attributes?: Record<string, string>;
  }[];
  address: OrderAddress;
  paymentMethod: 'card' | 'cash' | 'online' | 'installments';
  deliveryMethod: 'courier' | 'pickup' | 'transport';
  comment?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  status: string;
  totalAmount: number;
}
