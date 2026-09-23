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
    images: string[];
    categoryId: number;
    category: { id: number; name: string };
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

// ===== PORTFOLIO =====
export interface PortfolioReview {
    id: number;
    authorName: string;
    text: string;
    rating: number;
    createdAt: string;
}

export interface PortfolioWork {
    id: number;
    title: string;
    description: string;
    categoryId?: number | null;
    categoryName?: string | null;
    images: string[];
    createdAt: string;
    reviews: PortfolioReview[];
}

export interface PortfolioWorkRequest {
    title: string;
    description: string;
    categoryId?: number | null;
    images: string[];
}

// ===== SUPPORT =====
export type SupportStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type SupportSender = 'USER' | 'ADMIN' | 'SYSTEM';

export interface SupportMessage {
    id: number;
    sender: SupportSender;
    text: string;
    createdAt: string;
}

export interface SupportTicket {
    id: number;
    telegramChatId?: number | null;
    telegramUsername?: string | null;
    telegramName?: string | null;
    status: SupportStatus;
    subject?: string | null;
    lastMessage?: string | null;
    createdAt: string;
    updatedAt: string;
    unreadByAdmin: number;
    messages: SupportMessage[];
}

export interface SupportStats {
    open: number;
    inProgress: number;
    resolved: number;
    total: number;
}

export interface Review {
    id: number;
    authorName: string;
    authorCity: string | null;
    rating: number;
    content: string;
    published: boolean;
    createdAt: string;
}

export interface PaginatedReviews {
    content: Review[];
    totalPages: number;
    totalElements: number;
    number: number;
    first: boolean;
    last: boolean;
}
