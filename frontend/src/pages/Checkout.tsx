import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Container from '@/components/layout/Container';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCartStore } from '@/store/cartStore';

const Checkout = () => {
  const { items, getTotalPrice } = useCartStore();
  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    comment: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would process the order
    alert('Заказ успешно оформлен!');
  };

  return (
    <div className="py-8 bg-white">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Оформление заказа</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Контактная информация</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Имя</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Фамилия</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Способ доставки</h2>
                
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <RadioGroupItem value="courier" id="courier" />
                    <div className="space-y-1">
                      <Label htmlFor="courier" className="text-base font-medium">Курьером</Label>
                      <p className="text-sm text-gray-600">Доставка по Москве и области</p>
                      <p className="text-sm font-medium">500 ₽</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <div className="space-y-1">
                      <Label htmlFor="pickup" className="text-base font-medium">Самовывоз</Label>
                      <p className="text-sm text-gray-600">г. Москва, ул. Примерная, д. 1</p>
                      <p className="text-sm font-medium">Бесплатно</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <RadioGroupItem value="transport" id="transport" />
                    <div className="space-y-1">
                      <Label htmlFor="transport" className="text-base font-medium">Транспортной компанией</Label>
                      <p className="text-sm text-gray-600">Доставка в регионы России</p>
                      <p className="text-sm font-medium">Рассчитывается индивидуально</p>
                    </div>
                  </div>
                </RadioGroup>
                
                {deliveryMethod !== 'pickup' && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="city">Город</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите город" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="moscow">Москва</SelectItem>
                          <SelectItem value="spb">Санкт-Петербург</SelectItem>
                          <SelectItem value="ekb">Екатеринбург</SelectItem>
                          <SelectItem value="nsk">Новосибирск</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Адрес доставки</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Улица, дом, квартира"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Способ оплаты</h2>
                
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <div className="space-y-1">
                      <Label htmlFor="card" className="text-base font-medium">Банковской картой</Label>
                      <p className="text-sm text-gray-600">Visa, Mastercard, МИР</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <RadioGroupItem value="online" id="online" />
                    <div className="space-y-1">
                      <Label htmlFor="online" className="text-base font-medium">Онлайн-оплата</Label>
                      <p className="text-sm text-gray-600">Яндекс.Касса, Qiwi, WebMoney</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <RadioGroupItem value="cash" id="cash" />
                    <div className="space-y-1">
                      <Label htmlFor="cash" className="text-base font-medium">Наличными</Label>
                      <p className="text-sm text-gray-600">При получении (только для Москвы)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <RadioGroupItem value="installments" id="installments" />
                    <div className="space-y-1">
                      <Label htmlFor="installments" className="text-base font-medium">В рассрочку</Label>
                      <p className="text-sm text-gray-600">Оплата частями без переплаты</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Comment */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Комментарий к заказу</h2>
                
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Укажите дополнительную информацию к заказу"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Ваш заказ</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">x{item.quantity}</p>
                      </div>
                      <p className="font-medium">{(item.price * item.quantity).toLocaleString()} ₽</p>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-300 pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Товары</span>
                      <span>{getTotalPrice().toLocaleString()} ₽</span>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Доставка</span>
                      <span>{deliveryMethod === 'pickup' ? 'Бесплатно' : '500 ₽'}</span>
                    </div>
                    
                    <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-300">
                      <span>Итого</span>
                      <span>{(getTotalPrice() + (deliveryMethod === 'pickup' ? 0 : 500)).toLocaleString()} ₽</span>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 py-6 text-lg">
                  Оплатить заказ
                </Button>
                
                <p className="text-xs text-gray-500 mt-4">
                  Нажимая на кнопку, вы принимаете условия пользовательского соглашения и политики обработки персональных данных
                </p>
              </div>
              
              <div className="mt-6">
                <Link to="/cart">
                  <Button variant="outline" className="w-full border-gray-300">
                    Вернуться в корзину
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default Checkout;
