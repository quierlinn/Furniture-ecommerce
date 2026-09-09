import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogOut, Menu, MessageCircle, Phone, Send, ShoppingBag, User, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { Logo } from '../brand/Logo';
import { cn } from '../../lib/cn';
import { SUPPORT_BOT_URL } from '../../lib/support';

const NAV = [
    { to: '/catalog', label: 'Каталог' },
    { to: '/portfolio', label: 'Портфолио' },
    { to: '/about', label: 'О нас' },
    { to: '/delivery', label: 'Доставка' },
    { to: '/contacts', label: 'Контакты' },
];

const CONTACTS = {
    phone: '+7 (920) 008-54-16',
    telegramChannel: 'https://t.me/furniture_store_channel',
};

export const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { items } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        setMobileOpen(false);
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50">
            {/* Тонкая сервисная полоса */}
            <div className="hidden bg-ink text-cream/70 md:block">
                <div className="container-site flex h-9 items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-6">
                        <a href={`tel:${CONTACTS.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 transition-colors hover:text-cream">
                            <Phone className="h-3.5 w-3.5" /> {CONTACTS.phone}
                        </a>
                        <a href={CONTACTS.telegramChannel} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-cream">
                            <Send className="h-3.5 w-3.5" /> Telegram-канал
                        </a>
                        <a href={SUPPORT_BOT_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-cream">
                            <MessageCircle className="h-3.5 w-3.5" /> Поддержка
                        </a>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/delivery" className="transition-colors hover:text-cream">Доставка по всей России</Link>
                    </div>
                </div>
            </div>

            {/* Основная полоса */}
            <div className="border-b border-ink/10 bg-cream/90 backdrop-blur-md">
                <div className="container-site flex h-16 items-center justify-between gap-6 md:h-20">
                    <Link to="/" aria-label="Riff — на главную" className="shrink-0">
                        <Logo size="sm" className="md:hidden" />
                        <Logo size="md" className="hidden md:inline-flex" />
                    </Link>

                    <nav className="hidden items-center gap-8 lg:flex">
                        {NAV.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={cn(
                                    'relative py-1 text-sm font-semibold transition-colors',
                                    'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:origin-left after:scale-x-0 after:bg-terra after:transition-transform after:duration-300',
                                    isActive(item.to)
                                        ? 'text-walnut after:scale-x-100'
                                        : 'text-ink-soft hover:text-walnut hover:after:scale-x-100'
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-1.5 md:gap-3">
                        <Link
                            to="/cart"
                            className="relative rounded-btn p-2.5 text-ink transition-colors hover:bg-ink/5 hover:text-walnut"
                            aria-label="Корзина"
                        >
                            <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
                            {cartCount > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-terra px-1 text-[11px] font-bold text-milk">
                  {cartCount}
                </span>
                            )}
                        </Link>

                        {isAuthenticated && user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setMenuOpen((v) => !v)}
                                    className="flex items-center gap-2 rounded-btn p-1.5 transition-colors hover:bg-ink/5"
                                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-walnut text-sm font-bold text-milk">
                    {user.firstName?.[0]?.toUpperCase()}
                  </span>
                                    <ChevronDown className={cn('h-4 w-4 text-ink-soft transition-transform', menuOpen && 'rotate-180')} />
                                </button>

                                <AnimatePresence>
                                    {menuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 6 }}
                                            transition={{ duration: 0.18 }}
                                            className="absolute right-0 top-[calc(100%+8px)] w-52 rounded-card border border-ink/10 bg-milk p-2 shadow-soft"
                                        >
                                            <div className="border-b border-ink/10 px-3 py-2">
                                                <p className="text-sm font-bold">{user.firstName} {user.lastName}</p>
                                                <p className="truncate text-xs text-ink-soft">{user.email}</p>
                                            </div>
                                            <Link to="/profile" onClick={() => setMenuOpen(false)} className="mt-1 flex items-center gap-2 rounded-btn px-3 py-2 text-sm font-medium hover:bg-ink/5">
                                                <User className="h-4 w-4" strokeWidth={1.75} /> Мои заказы
                                            </Link>
                                            {user.role === 'ADMIN' && (
                                                <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-btn px-3 py-2 text-sm font-medium hover:bg-ink/5">
                                                    <ChevronDown className="h-4 w-4 -rotate-90" strokeWidth={1.75} /> Админ-панель
                                                </Link>
                                            )}
                                            <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-btn px-3 py-2 text-sm font-medium text-terra hover:bg-terra/10">
                                                <LogOut className="h-4 w-4" strokeWidth={1.75} /> Выйти
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/auth" className="btn-secondary hidden !px-5 !py-2.5 md:inline-flex">
                                Войти
                            </Link>
                        )}

                        <button
                            onClick={() => setMobileOpen(true)}
                            className="rounded-btn p-2.5 text-ink hover:bg-ink/5 lg:hidden"
                            aria-label="Открыть меню"
                        >
                            <Menu className="h-5 w-5" strokeWidth={1.75} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Мобильное меню */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                            className="fixed bottom-0 right-0 top-0 z-50 flex w-[85%] max-w-sm flex-col bg-cream lg:hidden"
                        >
                            <div className="flex items-center justify-between px-6 py-5">
                                <Logo className="text-[22px]" />
                                <button onClick={() => setMobileOpen(false)} className="rounded-btn p-2 hover:bg-ink/5" aria-label="Закрыть меню">
                                    <X className="h-5 w-5" strokeWidth={1.75} />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-1 px-6 pt-4">
                                {NAV.map((item) => (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            'rounded-btn px-3 py-3 text-lg font-bold transition-colors',
                                            isActive(item.to) ? 'text-walnut' : 'text-ink hover:text-walnut'
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <Link to="/cart" onClick={() => setMobileOpen(false)} className="rounded-btn px-3 py-3 text-lg font-bold text-ink hover:text-walnut">
                                    Корзина {cartCount > 0 && <span className="ml-1 text-sm text-terra">({cartCount})</span>}
                                </Link>
                                {isAuthenticated ? (
                                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded-btn px-3 py-3 text-lg font-bold text-ink hover:text-walnut">
                                        Мои заказы
                                    </Link>
                                ) : (
                                    <Link to="/auth" onClick={() => setMobileOpen(false)} className="btn-primary mt-2">
                                        Войти
                                    </Link>
                                )}
                            </nav>

                            <div className="mt-auto space-y-3 border-t border-ink/10 px-6 py-6 text-sm text-ink-soft">
                                <a href={`tel:${CONTACTS.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 font-semibold text-ink">
                                    <Phone className="h-4 w-4" strokeWidth={1.75} /> {CONTACTS.phone}
                                </a>
                                <a href={SUPPORT_BOT_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-walnut">
                                    <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Поддержка в Telegram
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};
