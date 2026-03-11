import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Container from '@/components/layout/Container';
import { useCartStore } from '@/store/cartStore';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const [promoCode, setPromoCode] = useState('');

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleApplyPromo = () => {
    // In a real app, this would validate the promo code
    alert(`Промокод "${promoCode}" применен!`);
    setPromoCode('');
  };

  return (
    <div className="py-8 bg-white">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Корзина</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ваша корзина пуста</h2>
            <p className="text-gray-600 mb-8">Добавьте товары в корзину, чтобы продолжить покупки</p>
            <Link to="/catalog">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                Перейти к покупкам
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center border border-gray-200 rounded-lg p-6">
                    <div className="flex-shrink-0 w-32 h-32">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="ml-6 flex-grow">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 mt-1">Артикул: {item.id}</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {(item.price * item.quantity).toLocaleString()} ₽
                          </p>
                          <p className="text-gray-600 line-through text-sm">
                            {(item.price * item.quantity * 1.1).toLocaleString()} ₽
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="ml-4 p-2 text-gray-500 hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Введите промокод"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Button 
                    onClick={handleApplyPromo}
                    className="bg-amber-600 hover:bg-amber-700 rounded-l-none"
                  >
                    Применить
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Итого</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Товары ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span className="font-medium">{getTotalPrice().toLocaleString()} ₽</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Доставка</span>
                    <span className="font-medium">500 ₽</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Скидка</span>
                    <span className="font-medium text-green-600">-0 ₽</span>
                  </div>
                  
                  <div className="border-t border-gray-300 pt-4 mt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Итого</span>
                      <span>{(getTotalPrice() + 500).toLocaleString()} ₽</span>
                    </div>
                  </div>
                </div>
                
                <Link to="/checkout">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 py-6 text-lg">
                    Оформить заказ
                  </Button>
                </Link>
                
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <h3 className="font-medium text-gray-900 mb-4">Способы доставки</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                      <span>Самовывоз: бесплатно</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                      <span>Доставка по Москве: 500 ₽</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                      <span>Доставка по области: от 1000 ₽</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <Link to="/catalog">
                  <Button variant="outline" className="w-full border-gray-300">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Продолжить покупки
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Cart;
