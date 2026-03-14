import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Phone, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

export const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { items } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const isActive = (path: string) => location.pathname === path;

    const contacts = {
        phone: '+7 (999) 123-45-67',
        telegramChannel: 'https://t.me/furniture_store_channel',
        telegramProfile: 'https://t.me/furniture_support',
    };

    return (
        <header className="bg-dark border-b border-border sticky top-0 z-50">

            {/* 🔹 Верхняя полоса с контактами */}
            <div className="hidden md:block bg-black border-b border-border">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center justify-between text-sm">
                        {/* Контакты */}
                        <div className="flex items-center gap-6 text-gray-400">
                            <a
                                href={`tel:${contacts.phone.replace(/\s/g, '')}`}
                                className="flex items-center gap-1 hover:text-primary transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                {contacts.phone}
                            </a>

                            <a
                                href={contacts.telegramChannel}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-primary transition-colors"
                            >
                                <Send className="w-4 h-4" />
                                Telegram-канал
                            </a>

                            <a
                                href={contacts.telegramProfile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-primary transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Поддержка
                            </a>
                        </div>

                        {/* Доп. ссылки */}
                        <div className="flex items-center gap-4">
                            <Link to="/delivery" className="hover:text-primary transition-colors text-gray-400">
                                Доставка
                            </Link>
                            <Link to="/contacts" className="hover:text-primary transition-colors text-gray-400">
                                Контакты
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔹 Основная полоса хедера */}
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    {/* Логотип */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src="/logo.png"
                            alt="RIF Furniture"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>

                    {/* Десктоп навигация */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link
                            to="/catalog"
                            className={`px-4 py-2 transition-colors rounded-lg font-medium ${isActive('/catalog')
                                ? 'bg-primary text-black'
                                : 'text-gray-300 hover:text-primary hover:bg-white/5'}`}
                        >
                            Каталог
                        </Link>
                        <Link
                            to="/about"
                            className={`px-4 py-2 transition-colors rounded-lg font-medium ${isActive('/about')
                                ? 'bg-primary text-black'
                                : 'text-gray-300 hover:text-primary hover:bg-white/5'}`}
                        >
                            О нас
                        </Link>
                        <Link
                            to="/delivery"
                            className={`px-4 py-2 transition-colors rounded-lg font-medium ${isActive('/delivery')
                                ? 'bg-primary text-black'
                                : 'text-gray-300 hover:text-primary hover:bg-white/5'}`}
                        >
                            Доставка
                        </Link>
                        <Link
                            to="/contacts"
                            className={`px-4 py-2 transition-colors rounded-lg font-medium ${isActive('/contacts')
                                ? 'bg-primary text-black'
                                : 'text-gray-300 hover:text-primary hover:bg-white/5'}`}
                        >
                            Контакты
                        </Link>

                        {/* Профиль и админка */}
                        {isAuthenticated && user && (
                            <>
                                <Link
                                    to="/profile"
                                    className={`px-4 py-2 transition-colors rounded-lg font-medium ${isActive('/profile')
                                        ? 'bg-primary text-black'
                                        : 'text-gray-300 hover:text-primary hover:bg-white/5'}`}
                                >
                                    👤 {user.firstName}
                                </Link>

                                {user.role === 'ADMIN' && (
                                    <Link
                                        to="/admin"
                                        className={`px-4 py-2 transition-colors rounded-lg font-medium ${isActive('/admin')
                                            ? 'bg-primary text-black'
                                            : 'text-gray-300 hover:text-primary hover:bg-white/5'}`}
                                    >
                                        🔧 Админка
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>

                    {/* Правая часть: корзина + авторизация */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Корзина */}
                        <Link
                            to="/cart"
                            className="relative p-2 hover:bg-white/5 rounded-lg transition-colors"
                            title="Корзина"
                        >
                            <ShoppingCart className="w-5 h-5 text-gray-300 hover:text-primary transition-colors" />
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-black text-xs rounded-full flex items-center justify-center font-bold">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>

                        {/* Авторизация / Выход */}
                        {isAuthenticated && user ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-red-400 transition-colors"
                                title="Выйти"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        ) : (
                            <Link
                                to="/auth"
                                className="flex items-center gap-2 px-4 py-2 btn-primary"
                            >
                                <User className="w-4 h-4" />
                                Войти
                            </Link>
                        )}
                    </div>

                    {/* Мобильное меню кнопка */}
                    <button
                        className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Меню"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6 text-white" />
                        ) : (
                            <Menu className="w-6 h-6 text-white" />
                        )}
                    </button>
                </div>

                {/* 🔹 Мобильное меню */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border">

                        {/* Контакты в мобильном меню */}
                        <div className="px-4 pb-4 border-b border-border space-y-3">
                            <a
                                href={`tel:${contacts.phone.replace(/\s/g, '')}`}
                                className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                {contacts.phone}
                            </a>
                            <a
                                href={contacts.telegramChannel}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors"
                            >
                                <Send className="w-4 h-4" />
                                Telegram-канал
                            </a>
                            <a
                                href={contacts.telegramProfile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Поддержка
                            </a>
                        </div>

                        {/* Навигация */}
                        <nav className="flex flex-col px-4 py-2 gap-1">
                            <Link
                                to="/catalog"
                                className="px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-primary rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Каталог
                            </Link>
                            <Link
                                to="/about"
                                className="px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-primary rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                О нас
                            </Link>
                            <Link
                                to="/delivery"
                                className="px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-primary rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Доставка
                            </Link>
                            <Link
                                to="/contacts"
                                className="px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-primary rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Контакты
                            </Link>

                            {/* Профиль и админка */}
                            {isAuthenticated && user && (
                                <>
                                    <Link
                                        to="/profile"
                                        className="px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-primary rounded-lg transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        👤 {user.firstName} {user.lastName}
                                    </Link>

                                    {user.role === 'ADMIN' && (
                                        <Link
                                            to="/admin"
                                            className="px-4 py-3 text-gray-300 hover:bg-primary/10 hover:text-primary rounded-lg font-medium transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            🔧 Админ-панель
                                        </Link>
                                    )}
                                </>
                            )}

                            {/* Корзина */}
                            <Link
                                to="/cart"
                                className="px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-primary rounded-lg flex items-center justify-between transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span>🛒 Корзина</span>
                                {cartItemsCount > 0 && (
                                    <span className="bg-primary text-black text-xs px-2 py-1 rounded-full font-bold">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </Link>
                        </nav>

                        {/* Кнопка входа/выхода */}
                        <div className="mt-4 pt-4 border-t border-border px-4">
                            {isAuthenticated && user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-400/10 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Выйти
                                </button>
                            ) : (
                                <Link
                                    to="/auth"
                                    className="w-full px-4 py-3 btn-primary text-center block"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    👤 Войти
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
