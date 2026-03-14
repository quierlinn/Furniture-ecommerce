import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/client';
import { formatPrice } from '../utils/format';
import type { CreateOrderRequest } from '../types';

export const CartPage = () => {
    const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [orderSuccess, setOrderSuccess] = useState<{ id: number; number: string } | null>(null);

    // Форма контактных данных (предзаполняем из профиля, если есть)
    const [customerData, setCustomerData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        address: '',
    });

    const handleQuantityChange = (productId: number, delta: number) => {
        const item = items.find((i) => i.product.id === productId);
        if (item) {
            updateQuantity(productId, item.quantity + delta);
        }
    };

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            navigate('/auth', { state: { from: { pathname: '/cart' } } });
            return;
        }

        if (items.length === 0) {
            setOrderError('Корзина пуста');
            return;
        }

        // Валидация данных
        if (!customerData.firstName || !customerData.lastName || !customerData.email || !customerData.phone || !customerData.address) {
            setOrderError('Заполните все поля для оформления заказа');
            return;
        }

        setIsSubmitting(true);
        setOrderError(null);

        try {
            // Формируем товары для заказа
            const orderItems = items.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price,
            }));

            // ✅ Формируем правильный запрос с контактами
            const orderPayload: CreateOrderRequest = {
                items: orderItems,
                customerFirstName: customerData.firstName,
                customerLastName: customerData.lastName,
                customerEmail: customerData.email,
                customerPhone: customerData.phone,
                deliveryAddress: customerData.address,
            };

            // Отправляем заказ
            const order = await api.createOrder(orderPayload);

            // Сохраняем данные для страницы подтверждения
            setOrderSuccess({
                id: order.id,
                number: `ORD-${order.id.toString().padStart(6, '0')}`,
            });

            // Очищаем корзину
            clearCart();
        } catch (error: any) {
            console.error('Order error:', error);
            setOrderError(error.response?.data?.message || 'Ошибка при оформлении заказа. Попробуйте позже.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Страница успешного заказа
    if (orderSuccess) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <div className="card p-8">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Заказ оформлен!</h1>
                    <p className="text-gray-600 mb-6">
                        Спасибо за покупку. Номер вашего заказа: <span className="font-bold text-primary">{orderSuccess.number}</span>
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600">
                            Мы отправили подтверждение на email <span className="font-medium">{customerData.email}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Телефон для связи: <span className="font-medium">{customerData.phone}</span>
                        </p>
                    </div>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link to="/catalog" className="btn-primary">
                            Продолжить покупки
                        </Link>
                        <Link to="/profile" className="btn-outline">
                            Мои заказы
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Пустая корзина
    if (items.length === 0) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Корзина пуста</h1>
                <p className="text-gray-600 mb-6">Добавьте товары из каталога</p>
                <Link to="/catalog" className="btn-primary inline-flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Перейти в каталог
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Ваша корзина</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Товары */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="card divide-y">
                        {items.map((item) => (
                            <div key={item.product.id} className="p-4 flex gap-4 flex-wrap sm:flex-nowrap">
                                {/* Изображение */}
                                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={item.product.imageUrl || `https://placehold.co/100x100?text=${encodeURIComponent(item.product.name.substring(0, 10))}`}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Информация */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 truncate">{item.product.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {item.product.category?.name || 'Категория не указана'}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formatPrice(item.product.price)} × {item.quantity}
                                    </p>
                                </div>

                                {/* Количество */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleQuantityChange(item.product.id, -1)}
                                        className="p-1 border rounded hover:bg-gray-50"
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(item.product.id, 1)}
                                        className="p-1 border rounded hover:bg-gray-50"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Цена */}
                                <div className="text-right min-w-[100px]">
                                    <p className="font-bold text-gray-900">{formatPrice(item.product.price * item.quantity)}</p>
                                    <button
                                        onClick={() => removeFromCart(item.product.id)}
                                        className="text-sm text-red-600 hover:text-red-700 mt-1 flex items-center gap-1 justify-end"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Итого */}
                    <div className="card p-4 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-medium">Итого:</span>
                            <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                        </div>
                    </div>
                </div>

                {/* Форма оформления */}
                <div className="lg:col-span-1">
                    <div className="card p-6 sticky top-24">
                        <h2 className="text-lg font-bold mb-4">Данные покупателя</h2>

                        {orderError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                {orderError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Имя *</label>
                                    <input
                                        type="text"
                                        value={customerData.firstName}
                                        onChange={(e) => setCustomerData({ ...customerData, firstName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Иван"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия *</label>
                                    <input
                                        type="text"
                                        value={customerData.lastName}
                                        onChange={(e) => setCustomerData({ ...customerData, lastName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Иванов"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={customerData.email}
                                    onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                                <input
                                    type="tel"
                                    value={customerData.phone}
                                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="+7 (999) 123-45-67"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Адрес доставки *</label>
                                <textarea
                                    value={customerData.address}
                                    onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    rows={3}
                                    placeholder="Город, улица, дом, квартира"
                                />
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isSubmitting}
                                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Оформление...' : `Оформить за ${formatPrice(total)}`}
                            </button>

                            {!isAuthenticated && (
                                <p className="text-xs text-gray-500 text-center">
                                    Для оформления заказа необходимо{' '}
                                    <Link to="/auth" className="text-primary hover:underline">войти</Link>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
