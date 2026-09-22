import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type {
    LoginCredentials,
    RegisterCredentials,
    User,
    AuthResponse,
    Product,
    Category,
    Order,
    CreateOrderRequest,
    PaginatedProducts, PortfolioWork,
    PortfolioWorkRequest, SupportTicket, SupportStats
} from '../types';

const API_BASE_URL = '/api';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: false,
        });

        // JWT интерсептор
        this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            const token = localStorage.getItem('jwt_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Глобальная обработка ошибок
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error.response?.status;
                const body = error.response?.data;

                const isSessionExpired =
                    status === 401 ||
                    status === 403 ||
                    (status === 400 && body?.error === 'Access Denied'); // fallback на старый бэк

                if (isSessionExpired) {
                    localStorage.removeItem('jwt_token');
                    localStorage.removeItem('user');
                    if (!window.location.pathname.startsWith('/auth')) {
                        window.location.href =
                            '/auth?reason=session-expired&redirect=' +
                            encodeURIComponent(window.location.pathname);
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    // ===== AUTH =====
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await this.client.post<AuthResponse>('/auth/login', credentials);
        return data;
    }

    async register(credentials: RegisterCredentials): Promise<User> {
        const { data } = await this.client.post<User>('/auth/register', credentials);
        return data;
    }

    // ===== PRODUCTS =====
    async getProduct(id: number): Promise<Product> {
        const { data } = await this.client.get<Product>(`/products/${id}`);
        return data;
    }

    async getProductsByCategory(categoryId: number, page = 0, size = 4): Promise<Product[]> {
        const { data } = await this.client.get<PaginatedProducts>(`/products/category/${categoryId}`, {
            params: { page, size, sortBy: 'id', sortDir: 'desc' },
        });
        return data.content;
    }

    async getProductById(id: number): Promise<Product> {
        const { data } = await this.client.get<Product>(`/products/${id}`);
        return data;
    }

    // ===== CATEGORIES =====
    async getCategories(): Promise<Category[]> {
        const { data } = await this.client.get<Category[]>('/categories');
        return data;
    }
    // ===== CATEGORIES (Admin) =====
    async createCategory(name: string): Promise<Category> {
        const { data } = await this.client.post<Category>('/categories', { name });
        return data;
    }

    async updateCategory(id: number, name: string): Promise<Category> {
        const { data } = await this.client.put<Category>(`/categories/${id}`, { name });
        return data;
    }

    async deleteCategory(id: number): Promise<void> {
        await this.client.delete(`/categories/${id}`);
    }

    // src/api/client.ts

// ===== ORDERS =====
    async createOrder(payload: CreateOrderRequest): Promise<Order> {
        const { data } = await this.client.post<Order>('/orders', payload);
        return data;
    }

// ✅ Для пользователя: свои заказы
    async getUserOrders(): Promise<Order[]> {
        const { data } = await this.client.get<Order[]>('/orders/user');
        return data;
    }

// ✅ ДЛЯ АДМИНА: все заказы всех пользователей
    async getAllOrders(): Promise<Order[]> {
        const { data } = await this.client.get<Order[]>('/orders');
        return data;
    }

    async updateOrderStatus(id: number, status: string): Promise<Order> {
        const { data } = await this.client.put<Order>(`/orders/${id}/status`, `"${status}"`, {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    }

    // ===== PRODUCTS (Admin) =====
    async createProduct(productData: {
        name: string;
        description: string;
        price: number;
        imageUrl?: string;
        categoryId: number;
    }): Promise<Product> {
        const { data } = await this.client.post<Product>('/products', productData);
        return data;
    }

    // ===== PORTFOLIO =====
    async getPortfolio(categoryId?: number): Promise<PortfolioWork[]> {
        const params = categoryId ? `?categoryId=${categoryId}` : '';
        const { data } = await this.client.get<PortfolioWork[]>(`/portfolio${params}`);
        return data;
    }

    async getPortfolioWork(id: number): Promise<PortfolioWork> {
        const { data } = await this.client.get<PortfolioWork>(`/portfolio/${id}`);
        return data;
    }

    // ===== PORTFOLIO (Admin) =====
    async createPortfolioWork(payload: PortfolioWorkRequest): Promise<PortfolioWork> {
        const { data } = await this.client.post<PortfolioWork>('/portfolio', payload);
        return data;
    }

    async updatePortfolioWork(id: number, payload: PortfolioWorkRequest): Promise<PortfolioWork> {
        const { data } = await this.client.put<PortfolioWork>(`/portfolio/${id}`, payload);
        return data;
    }

    async deletePortfolioWork(id: number): Promise<void> {
        await this.client.delete(`/portfolio/${id}`);
    }

    // ===== SUPPORT (Admin) =====
    async getSupportTickets(): Promise<SupportTicket[]> {
        const { data } = await this.client.get<SupportTicket[]>('/admin/support');
        return data;
    }

    async getSupportTicket(id: number): Promise<SupportTicket> {
        const { data } = await this.client.get<SupportTicket>(`/admin/support/${id}`);
        return data;
    }

    async getSupportStats(): Promise<SupportStats> {
        const { data } = await this.client.get<SupportStats>('/admin/support/stats');
        return data;
    }

    async supportReply(id: number, text: string): Promise<SupportTicket> {
        const { data } = await this.client.post<SupportTicket>(`/admin/support/${id}/reply`, { text });
        return data;
    }

    async supportResolve(id: number): Promise<SupportTicket> {
        const { data } = await this.client.post<SupportTicket>(`/admin/support/${id}/resolve`);
        return data;
    }

    async supportClose(id: number): Promise<SupportTicket> {
        const { data } = await this.client.post<SupportTicket>(`/admin/support/${id}/close`);
        return data;
    }

    async updateProduct(id: number, productData: {
        name: string;
        description: string;
        price: number;
        imageUrl?: string;
        categoryId: number;
    }): Promise<Product> {
        const { data } = await this.client.put<Product>(`/products/${id}`, productData);
        return data;
    }

    async deleteProduct(id: number): Promise<void> {
        await this.client.delete(`/products/${id}`);
    }

}

export const api = new ApiClient();
