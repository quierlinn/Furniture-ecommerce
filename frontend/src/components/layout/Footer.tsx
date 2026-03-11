import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Container from './Container';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-amber-400">МЕБЕЛЬГРАДЪ</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Производство и продажа мебели на заказ с доставкой по всей России
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors p-2 rounded-full hover:bg-gray-700">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors p-2 rounded-full hover:bg-gray-700">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors p-2 rounded-full hover:bg-gray-700">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors p-2 rounded-full hover:bg-gray-700">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-bold text-lg mb-6">Контакты</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="h-5 w-5 mt-0.5 mr-3 text-amber-400" />
                <span className="text-gray-300">+7 (495) 123-45-67</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mt-0.5 mr-3 text-amber-400" />
                <span className="text-gray-300">info@mебельград.рф</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-0.5 mr-3 text-amber-400" />
                <span className="text-gray-300">г. Москва, ул. Примерная, д. 1</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mt-0.5 mr-3 text-amber-400" />
                <span className="text-gray-300">Пн-Вс: 9:00 - 21:00</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Информация</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-300 hover:text-amber-400 transition-colors block py-1">О компании</Link></li>
              <li><Link to="/delivery" className="text-gray-300 hover:text-amber-400 transition-colors block py-1">Доставка и оплата</Link></li>
              <li><Link to="/warranty" className="text-gray-300 hover:text-amber-400 transition-colors block py-1">Гарантия</Link></li>
              <li><Link to="/assembly" className="text-gray-300 hover:text-amber-400 transition-colors block py-1">Сборка мебели</Link></li>
              <li><Link to="/projects" className="text-gray-300 hover:text-amber-400 transition-colors block py-1">Проекты</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-amber-400 transition-colors block py-1">Блог</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-6">Рассылка</h4>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Подпишитесь на рассылку и получайте скидки и новости
            </p>
            <div className="flex flex-col space-y-3">
              <Input
                type="email"
                placeholder="Ваш email"
                className="bg-gray-800 border-gray-700 text-white py-3 px-4 rounded-lg"
              />
              <Button className="bg-amber-600 hover:bg-amber-700 py-3 text-base font-medium">
                Подписаться
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2023 МЕБЕЛЬГРАДЪ. Все права защищены.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">Политика конфиденциальности</Link>
            <Link to="/agreement" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">Пользовательское соглашение</Link>
            <Link to="/offer" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">Договор оферты</Link>
            <Link to="/return" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">Возврат товара</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
