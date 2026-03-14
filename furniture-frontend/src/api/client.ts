import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type {
    LoginCredentials,
    RegisterCredentials,
    User,
    AuthResponse,
    Product,
    // ✅ ProductPage удалён — используем PaginatedProducts
    ProductFilters,
    Category,
    Order,
    CreateOrderRequest,
    PaginatedProducts  // ✅ Добавлен новый тип
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

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
                if (error.response?.status === 401) {
                    localStorage.removeItem('jwt_token');
                    localStorage.removeItem('user');
                    window.location.href = '/auth?redirect=' + encodeURIComponent(window.location.pathname);
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
    async getProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
        const params = new URLSearchParams({
            page: String(filters.page ?? 0),
            size: String(filters.size ?? 20),
            sortBy: filters.sortBy ?? 'id',
            sortDir: filters.sortDir ?? 'asc',
        });

        if (filters.query) params.append('q', filters.query);

        // Определяем эндпоинт в зависимости от параметров
        let endpoint = '/products';

        if (filters.categoryId && filters.query) {
            endpoint = `/products/search/category/${filters.categoryId}`;
        } else if (filters.categoryId) {
            endpoint = `/products/category/${filters.categoryId}`;
        } else if (filters.query) {
            endpoint = '/products/search';
        }

        // ✅ Исправлено: возвращаем PaginatedProducts вместо ProductPage
        const { data } = await this.client.get<PaginatedProducts>(`${endpoint}?${params}`);
        return data;
    }

    async getProductById(id: number): Promise<Product> {
        const { data } = await this.client.get<Product>(`/products/${id}`);
        return data;
    }

    // ===== CATEGORIES =====
    async getCategories(): Promise<Category[]> {
        return [
            { id: 1, name: 'Кухни' },
            { id: 2, name: 'Прихожие' },
            { id: 3, name: 'Гостиные' },
            { id: 4, name: 'Спальни' },
        ];
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
