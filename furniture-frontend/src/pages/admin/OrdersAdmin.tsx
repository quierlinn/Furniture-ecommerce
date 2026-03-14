import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Eye, RefreshCw, Phone, Mail, MapPin, User } from 'lucide-react';
import { api } from '../../api/client';
import type { Order, OrderItem } from '../../types';
import { formatPrice } from '../../utils/format';

const statusLabels: Record<string, string> = {
    PENDING: 'Ожидает обработки',
    PROCESSING: 'В обработке',
    SHIPPED: 'Отправлен',
    DELIVERED: 'Доставлен',
    CANCELLED: 'Отменён',
};

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
};

const statusOptions = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export const OrdersAdmin = () => {
    const queryClient = useQueryClient();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const { data: orders, isLoading, refetch } = useQuery<Order[]>({
        queryKey: ['orders', 'admin'],
        queryFn: () => api.getAllOrders(),
        staleTime: 2 * 60 * 1000,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            api.updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setSelectedOrder(null);
        },
    });

    const handleStatusChange = (orderId: number, newStatus: string) => {
        if (confirm(`Изменить статус заказа на "${statusLabels[newStatus]}"?`)) {
            updateStatusMutation.mutate({ id: orderId, status: newStatus });
        }
    };

    if (isLoading) {
        return <div className="py-20 text-center">Загрузка заказов...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin" className="text-gray-600 hover:text-primary">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold">📋 Управление заказами</h1>
                </div>
                <button onClick={() => refetch()} className="btn-outline flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Обновить
                </button>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№ Заказа</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Покупатель</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сумма</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Загрузка...</td>
                        </tr>
                    ) : !orders || orders.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Заказов нет</td>
                        </tr>
                    ) : (
                        orders.map((order: Order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium">#{order.id.toString().padStart(6, '0')}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {order.customerFirstName || 'N/A'} {order.customerLastName || ''}
                                        </p>
                                        <p className="text-xs text-gray-500">{order.customerEmail || 'N/A'}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">{formatPrice(order.totalAmount)}</td>
                                <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                        title="Просмотр деталей"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Модальное окно деталей заказа */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Заказ #{selectedOrder.id.toString().padStart(6, '0')}</h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* ✅ КОНТАКТНЫЕ ДАННЫЕ ЗАКАЗЧИКА */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Контактные данные
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600 flex items-center gap-1">
                                            <User className="w-4 h-4" /> ФИО
                                        </p>
                                        <p className="font-medium mt-1">
                                            {selectedOrder.customerFirstName || 'N/A'} {selectedOrder.customerLastName || ''}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 flex items-center gap-1">
                                            <Mail className="w-4 h-4" /> Email
                                        </p>
                                        <a href={`mailto:${selectedOrder.customerEmail}`} className="font-medium text-primary hover:underline mt-1 block">
                                            {selectedOrder.customerEmail || 'N/A'}
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 flex items-center gap-1">
                                            <Phone className="w-4 h-4" /> Телефон
                                        </p>
                                        <a href={`tel:${selectedOrder.customerPhone}`} className="font-medium text-primary hover:underline mt-1 block">
                                            {selectedOrder.customerPhone || 'N/A'}
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 flex items-center gap-1">
                                            <MapPin className="w-4 h-4" /> Адрес доставки
                                        </p>
                                        <p className="font-medium mt-1">{selectedOrder.deliveryAddress || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Информация о заказе */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Дата оформления</p>
                                    <p className="font-medium">
                                        {new Date(selectedOrder.createdAt).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Статус</p>
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        disabled={updateStatusMutation.isPending}
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>{statusLabels[status]}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Товары в заказе */}
                            <div className="border-t pt-4">
                                <p className="text-sm font-medium text-gray-700 mb-3">📦 Товары в заказе</p>
                                <div className="space-y-2">
                                    {selectedOrder.items?.map((item: OrderItem, idx: number) => (
                                        <div key={idx} className="flex justify-between text-sm py-2 border-b last:border-0">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.productName}</p>
                                                <p className="text-gray-500 text-xs">Кол-во: {item.quantity} шт.</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{formatPrice(item.price)}</p>
                                                <p className="text-gray-500 text-xs">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Итого */}
                            <div className="border-t pt-4 flex justify-between items-center bg-gray-50 rounded-lg p-4">
                                <span className="text-lg font-medium">Итого оплачено:</span>
                                <span className="text-2xl font-bold text-primary">{formatPrice(selectedOrder.totalAmount)}</span>
                            </div>

                            {/* Кнопки */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="flex-1 btn-outline"
                                >
                                    Закрыть
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
