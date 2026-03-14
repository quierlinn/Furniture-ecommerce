// src/types/index.ts

// ===== AUTH =====
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'USER' | 'ADMIN';
}

// ===== PRODUCTS =====
export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    categoryId?: number;
    category?: Category;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaginatedProducts {
    content: Product[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export interface ProductFilters {
    page?: number;
    size?: number;
    categoryId?: number;
    query?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

// ===== CART =====
export interface CartItem {
    product: Product;
    quantity: number;
}

// ===== ORDERS =====
export interface OrderItem {
    id?: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

// ✅ ОБНОВЛЁНО: Добавлены контактные поля
export interface Order {
    id: number;
    userId: number;
    items: OrderItem[];
    totalAmount: number;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;

    // ✅ КОНТАКТНЫЕ ДАННЫЕ ЗАКАЗЧИКА
    customerFirstName?: string;
    customerLastName?: string;
    customerEmail?: string;
    customerPhone?: string;
    deliveryAddress?: string;
}

// ✅ ОБНОВЛЁНО: Тип для создания заказа (с контактами)
export interface CreateOrderRequest {
    items: Array<{
        productId: number;
        quantity: number;
        price: number;
    }>;
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
}
