import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Search, Menu, ShoppingCart, User, Phone, MapPin, ChevronDown } from 'lucide-react';
import Container from './Container';
import { useCartStore } from '@/store/cartStore';

const Header = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const cartItemsCount = useCartStore(state => state.getTotalItems());

  const categories = [
    { id: 'kitchen', name: 'Кухни', subcategories: ['Угловые', 'Прямые', 'П-образные', 'Островные'] },
    { id: 'wardrobe', name: 'Шкафы-купе', subcategories: ['Распашные', 'Раздвижные', 'Угловые', 'Купе'] },
    { id: 'living-room', name: 'Гостиные', subcategories: ['Модульные', 'Классические', 'Минималистичные', 'Софа + кресла'] },
    { id: 'bedroom', name: 'Спальни', subcategories: ['Классические', 'Современные', 'Детские', 'Молодежные'] },
    { id: 'office', name: 'Офисная мебель', subcategories: ['Столы', 'Кресла', 'Шкафы', 'Перегородки'] },
    { id: 'children', name: 'Детская мебель', subcategories: ['Для новорожденных', 'Дошкольники', 'Школьники', 'Тематические'] },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      {/* Top bar with contacts */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm">
        <Container className="py-2 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span>+7 (495) 123-45-67</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>г. Москва, ул. Примерная, д. 1</span>
            </div>
          </div>
          <div className="flex items-center">
            <span>Работаем ежедневно с 9:00 до 21:00</span>
          </div>
        </Container>
      </div>

      {/* Main header */}
      <Container className="py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-bold text-amber-600 hover:text-amber-700 transition-colors">
              МЕБЕЛЬГРАДЪ
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10 flex-1 max-w-4xl mx-12">
            <div
              className="relative group"
              onMouseEnter={() => setIsCatalogOpen(true)}
              onMouseLeave={() => setIsCatalogOpen(false)}
            >
              <button className="flex items-center gap-2 text-base font-semibold text-gray-900 hover:text-amber-600 transition-colors">
                Каталог
                <ChevronDown className={`h-4 w-4 transition-transform ${isCatalogOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Mega menu */}
              {isCatalogOpen && (
                <div className="absolute left-0 mt-3 w-[900px] bg-white rounded-xl shadow-2xl p-8 border border-gray-100 z-50">
                  <div className="grid grid-cols-3 gap-8">
                    {categories.map((category) => (
                      <div key={category.id} className="group/category">
                        <h3 className="font-bold text-lg mb-4 text-gray-900 group-hover/category:text-amber-600 transition-colors">
                          {category.name}
                        </h3>
                        <ul className="space-y-3">
                          {category.subcategories.map((sub, idx) => (
                            <li key={idx}>
                              <a
                                href="#"
                                className="text-base text-gray-600 hover:text-amber-600 transition-colors block py-1 hover:pl-2"
                              >
                                {sub}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4">Популярные коллекции</h4>
                    <div className="flex flex-wrap gap-4">
                      {['Лофт', 'Скандинавский', 'Минимализм', 'Классика', 'Модерн', 'Прованс', 'Хай-тек'].map((style) => (
                        <a
                          key={style}
                          href="#"
                          className="text-base bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-full transition-colors border border-amber-100"
                        >
                          {style}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/about" className="text-base font-medium text-gray-700 hover:text-amber-600 transition-colors">О компании</Link>
            <Link to="/delivery" className="text-base font-medium text-gray-700 hover:text-amber-600 transition-colors">Доставка</Link>
            <Link to="/contacts" className="text-base font-medium text-gray-700 hover:text-amber-600 transition-colors">Контакты</Link>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-5">
            <div className="hidden md:relative w-72">
              <Input
                type="search"
                placeholder="Поиск товаров..."
                className="pl-12 h-12 rounded-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 text-base"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            
            <Button variant="ghost" size="icon" className="relative h-12 w-12">
              <User className="h-6 w-6 text-gray-700" />
            </Button>
            
            <Button variant="ghost" size="icon" className="relative h-12 w-12">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            {/* Mobile menu button */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-12 w-12">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col space-y-6">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Поиск товаров..."
                      className="pl-10 h-12 rounded-full border-gray-300 text-base"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  
                  <nav className="flex flex-col space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">Каталог</h3>
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/catalog/${category.id}`}
                          className="block py-2 text-base text-gray-700 hover:text-amber-600 font-medium"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <Link to="/about" className="block py-2 text-base text-gray-700 hover:text-amber-600 font-medium">О компании</Link>
                      <Link to="/delivery" className="block py-2 text-base text-gray-700 hover:text-amber-600 font-medium">Доставка</Link>
                      <Link to="/contacts" className="block py-2 text-base text-gray-700 hover:text-amber-600 font-medium">Контакты</Link>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
