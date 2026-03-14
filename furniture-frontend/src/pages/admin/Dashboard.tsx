import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingCart, Users, TrendingUp, ArrowLeft } from 'lucide-react';
import { api } from '../../api/client';
import type { PaginatedProducts, Order } from '../../types';

export const AdminDashboard = () => {
    // ✅ Надёжный способ: получаем результат, затем извлекаем data
    const productsQuery = useQuery<PaginatedProducts>({
        queryKey: ['products', 'admin'],
        queryFn: () => api.getProducts({ page: 0, size: 100 }),
        staleTime: 5 * 60 * 1000,
    });
    const products = productsQuery.data;
    const productsLoading = productsQuery.isLoading;

    const ordersQuery = useQuery<Order[]>({
        queryKey: ['orders', 'admin'],
        queryFn: () => api.getUserOrders(),
        staleTime: 5 * 60 * 1000,
    });
    const orders = ordersQuery.data;
    const ordersLoading = ordersQuery.isLoading;

    const totalRevenue = orders?.reduce((sum: number, order: Order) => sum + order.totalAmount, 0) || 0;
    const pendingOrders = orders?.filter((o: Order) => o.status === 'PENDING').length || 0;

    if (productsLoading || ordersLoading) {
        return <div className="py-20 text-center">Загрузка статистики...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link to="/" className="text-gray-600 hover:text-primary">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold">🔧 Админ-панель</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Товаров</p>
                            <p className="text-2xl font-bold">{products?.totalElements || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Заказов</p>
                            <p className="text-2xl font-bold">{orders?.length || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">В обработке</p>
                            <p className="text-2xl font-bold">{pendingOrders}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Выручка</p>
                            <p className="text-2xl font-bold text-primary">{totalRevenue.toLocaleString('ru-RU')} ₽</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/admin/products" className="card p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold mb-2">📦 Управление товарами</h3>
                    <p className="text-gray-600">Добавление, редактирование, удаление товаров</p>
                </Link>

                <Link to="/admin/orders" className="card p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold mb-2">📋 Управление заказами</h3>
                    <p className="text-gray-600">Просмотр и обработка заказов клиентов</p>
                </Link>
            </div>
        </div>
    );
};
