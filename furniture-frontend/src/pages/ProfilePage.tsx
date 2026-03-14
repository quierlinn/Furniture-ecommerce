import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ArrowLeft, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/client';
import type { Order, OrderItem } from '../types';
import { formatPrice } from '../utils/format';

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

export const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();

  // ✅ ИСПРАВЛЕНО: правильная деструктуризация data: variableName
  const { data: orders, isLoading, isError, refetch } = useQuery<Order[]>({
    queryKey: ['orders', 'user'],
    queryFn: () => api.getUserOrders(),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });

  if (!isAuthenticated) {
    return (
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Войдите для просмотра профиля</h1>
          <Link to="/auth" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Войти
          </Link>
        </div>
    );
  }

  if (isLoading) {
    return (
        <div className="py-20 text-center text-gray-600">Загрузка данных...</div>
    );
  }

  if (isError) {
    return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Ошибка загрузки</h2>
          <button onClick={() => refetch()} className="btn-primary">Попробовать снова</button>
        </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        {/* Информация о пользователе */}
        <div className="card p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-600">{user?.email}</p>
          {user?.role === 'ADMIN' && (
              <Link to="/admin" className="inline-block mt-3 text-sm text-primary hover:underline">
                🔧 Перейти в админ-панель
              </Link>
          )}
        </div>

        {/* История заказов */}
        <div className="card">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Package className="w-5 h-5" />
              История заказов
            </h2>
          </div>

          {!orders || orders.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <p className="mb-4">У вас пока нет заказов</p>
                <Link to="/catalog" className="btn-primary">Перейти в каталог</Link>
              </div>
          ) : (
              <div className="divide-y">
                {/* ✅ ИСПРАВЛЕНО: добавлен тип для order */}
                {orders.map((order: Order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold text-gray-900">Заказ #{order.id.toString().padStart(6, '0')}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                      </div>

                      {/* Товары в заказе */}
                      <div className="space-y-2 mb-4">
                        {/* ✅ ИСПРАВЛЕНО: добавлены типы для item и idx */}
                        {order.items.map((item: OrderItem, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.productName} × {item.quantity}
                      </span>
                              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                      </div>

                      {/* Итого */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex items-center gap-2 text-gray-600">
                          <CreditCard className="w-4 h-4" />
                          <span>Оплачено:</span>
                        </div>
                        <span className="text-lg font-bold text-primary">{formatPrice(order.totalAmount)}</span>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
};
