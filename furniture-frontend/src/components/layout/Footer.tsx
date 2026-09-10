import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, Phone, Send } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { api } from '../../api/client';
import type { Category } from '../../types';
import { SUPPORT_BOT_URL } from '../../lib/support';

export const Footer = () => {
    const { data: categories = [] } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: () => api.getCategories(),
        staleTime: 10 * 60 * 1000,
    });

    return (
        <footer className="bg-ink text-cream">
            <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
                <div>
                    <Logo tone="milk" size="lg" tagline />
                    <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/60">
                        Мебель собственного производства. Проектируем, изготавливаем и доставляем по всей России.
                    </p>
                </div>

                <div>
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-cream/40">Каталог</h3>
                    <ul className="space-y-2.5 text-sm font-medium">
                        {categories.map((cat) => (
                            <li key={cat.id}>
                                <Link to={`/catalog?categoryId=${cat.id}`} className="text-cream/75 transition-colors hover:text-cream">
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-cream/40">Компания</h3>
                    <ul className="space-y-2.5 text-sm font-medium">
                        <li><Link to="/portfolio" className="text-cream/75 transition-colors hover:text-cream">Портфолио</Link></li>
                        <li><Link to="/about" className="text-cream/75 transition-colors hover:text-cream">О производстве</Link></li>
                        <li><Link to="/delivery" className="text-cream/75 transition-colors hover:text-cream">Доставка и оплата</Link></li>
                        <li><Link to="/contacts" className="text-cream/75 transition-colors hover:text-cream">Контакты</Link></li>
                        <li><Link to="/profile" className="text-cream/75 transition-colors hover:text-cream">Мои заказы</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-cream/40">Связаться</h3>
                    <ul className="space-y-2.5 text-sm font-medium">
                        <li>
                            <a href="tel:+79200085416" className="flex items-center gap-2 text-cream/75 transition-colors hover:text-cream">
                                <Phone className="h-4 w-4" strokeWidth={1.75} /> +7 (920) 008-54-16
                            </a>
                        </li>
                        <li>
                            <a href="https://t.me/furniture_store_channel" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cream/75 transition-colors hover:text-cream">
                                <Send className="h-4 w-4" strokeWidth={1.75} /> Telegram-канал
                            </a>
                        </li>
                        <li>
                            <a href={SUPPORT_BOT_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cream/75 transition-colors hover:text-cream">
                                <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Поддержка
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-cream/10">
                <div className="container-site flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/40 md:flex-row">
                    <span>© 2026 Riff. Мебель собственного производства.</span>
                    <span>Сделано с вниманием к деталям</span>
                </div>
            </div>
        </footer>
    );
};
