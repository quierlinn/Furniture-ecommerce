import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Hammer, ShieldCheck, Truck } from 'lucide-react';
import { api } from '../api/client';
import { useCart } from '../hooks/useCart';
import type { Category, PaginatedProducts } from '../types';
import { ProductCard } from '../components/catalog/ProductCard';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/ui/Reveal';
import { getCategoryImage, HERO_IMAGE, WORKSHOP_IMAGE } from '../utils/placeholders';
import { cn } from '../lib/cn';
import { ReviewsSection } from '../components/home/ReviewsSection';

const STEPS = [
    { n: '01', title: 'Заявка', text: 'Вы выбираете мебель или оставляете заявку — мы связываемся и уточняем детали.' },
    { n: '02', title: 'Проект и расчёт', text: 'Подгоняем размеры, материалы и фурнитуру под ваше пространство. Фиксируем цену.' },
    { n: '03', title: 'Производство', text: 'Изготавливаем на собственном цехе. Без посредников и скрытых замен материалов.' },
    { n: '04', title: 'Доставка и сборка', text: 'Привозим, собираем и устанавливаем. Проверяем вместе с вами каждую деталь.' },
];

export const HomePage = () => {
    const { addToCart } = useCart();

    const { data: categories = [] } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: () => api.getCategories(),
    });

    const { data: featured } = useQuery<PaginatedProducts>({
        queryKey: ['products', 'featured'],
        queryFn: () => api.getProducts({ page: 0, size: 4, sortBy: 'id', sortDir: 'asc' }),
    });

    return (
        <div>
            {/* ===== HERO ===== */}
            <section className="container-site grid items-center gap-10 pb-20 pt-10 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
                <Reveal>
                    <p className="overline-title">Собственное производство · доставка по России</p>
                    <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
                        Мебель, которую хочется оставить надолго
                    </h1>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
                        Проектируем и изготавливаем мебель на своём производстве. Честные материалы, точные сроки, спокойный сервис.
                    </p>
                    <div className="mt-9 flex flex-wrap gap-3">
                        <Link to="/catalog" className="btn-primary !px-8 !py-3.5">Смотреть каталог</Link>
                        <Link to="/contacts" className="btn-secondary !px-8 !py-3.5">Рассчитать заказ</Link>
                    </div>
                    <div className="mt-12 flex flex-wrap gap-x-10 gap-y-3 text-sm font-semibold text-ink-soft">
                        <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-terra" strokeWidth={1.75} /> Гарантия 5 лет</span>
                        <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-terra" strokeWidth={1.75} /> Доставка по РФ</span>
                        <span className="flex items-center gap-2"><Hammer className="h-4 w-4 text-terra" strokeWidth={1.75} /> Свой цех</span>
                    </div>
                </Reveal>

                <Reveal delay={0.15} className="relative">
                    <div className="absolute -right-4 -top-4 hidden h-full w-full rounded-img bg-sand md:block" aria-hidden />
                    <img
                        src={HERO_IMAGE}
                        alt="Мебель Riff в интерьере"
                        className="relative aspect-[4/5] w-full object-cover md:aspect-[5/6]"
                    />
                </Reveal>
            </section>

            {/* ===== КАТЕГОРИИ ===== */}
            <section className="container-site pb-20 md:pb-28">
                <SectionHeading
                    overline="Каталог"
                    title="Что мы делаем"
                    action={<Link to="/catalog" className="btn-secondary">Весь каталог</Link>}
                />
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
                    {categories.map((cat, i) => (
                        <Reveal key={cat.id} delay={i * 0.06} className={cn(i === 0 && 'col-span-2 row-span-2')}>
                            <Link to={`/catalog?categoryId=${cat.id}`} className="group relative block h-full overflow-hidden rounded-img bg-sand">
                                <img
                                    src={getCategoryImage(cat.id)}
                                    alt={cat.name}
                                    loading="lazy"
                                    className={cn(
                                        'w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]',
                                        i === 0 ? 'aspect-square h-full' : 'aspect-square'
                                    )}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-ink/0" />
                                <span className="absolute bottom-4 left-5 text-lg font-extrabold text-milk md:text-xl">
                  {cat.name}
                </span>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ===== ХИТЫ ===== */}
            <section className="bg-milk py-20 md:py-28">
                <div className="container-site">
                    <SectionHeading
                        overline="Выбор покупателей"
                        title="Мебель, которую заказывают чаще всего"
                        action={<Link to="/catalog" className="btn-secondary">Все товары</Link>}
                    />
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                        {featured?.content.map((p, i) => (
                            <Reveal key={p.id} delay={i * 0.07}>
                                <ProductCard product={p} onAddToCart={addToCart} onViewDetails={(id) => (window.location.href = `/product/${id}`)} />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== ПРОИЗВОДСТВО ===== */}
            <section className="container-site grid items-center gap-10 py-20 md:py-28 lg:grid-cols-2 lg:gap-16">
                <Reveal className="order-2 lg:order-1">
                    <img src={WORKSHOP_IMAGE} alt="Наше производство" className="aspect-[4/3] w-full rounded-img object-cover" />
                </Reveal>
                <Reveal delay={0.1} className="order-1 lg:order-2">
                    <p className="overline-title">Производство</p>
                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
                        Делаем сами —<br />поэтому отвечаем сами
                    </h2>
                    <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
                        У нас нет перекупленных складов и безликого ассортимента. Каждая позиция проходит через наш цех:
                        от раскроя и кромки до финальной сборки и проверки.
                    </p>
                    <div className="mt-10 grid grid-cols-3 gap-6">
                        {[
                            { v: '12', l: 'лет делаем мебель' },
                            { v: '1400+', l: 'выполненных заказов' },
                            { v: '5 лет', l: 'официальной гарантии' },
                        ].map((s) => (
                            <div key={s.l}>
                                <p className="text-3xl font-extrabold text-walnut md:text-4xl">{s.v}</p>
                                <p className="mt-1 text-sm text-ink-soft">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </section>

            {/* ===== ПРОЦЕСС ===== */}
            <section className="bg-sand/40 py-20 md:py-28">
                <div className="container-site">
                    <SectionHeading overline="Как мы работаем" title="Спокойный процесс без сюрпризов" />
                    <div className="grid gap-10 md:grid-cols-4 md:gap-8">
                        {STEPS.map((s, i) => (
                            <Reveal key={s.n} delay={i * 0.08}>
                                <p className="text-sm font-extrabold text-terra">{s.n}</p>
                                <h3 className="mt-3 text-lg font-extrabold tracking-tight">{s.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <ReviewsSection />

            {/* ===== CTA ===== */}
            <section className="bg-ink py-20 text-cream md:py-24">
                <div className="container-site flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
                    <Reveal>
                        <h2 className="max-w-xl text-3xl font-extrabold tracking-tight md:text-4xl">
                            Обсудим ваш заказ?
                        </h2>
                        <p className="mt-4 max-w-md text-cream/60">
                            Подскажем по материалам и срокам, посчитаем стоимость под ваше пространство.
                        </p>
                    </Reveal>
                    <Reveal delay={0.1} className="flex flex-wrap gap-3">
                        <Link to="/catalog" className="btn-primary">Смотреть каталог</Link>
                        <a href="tel:+79200085416" className="inline-flex items-center gap-2 rounded-btn border border-cream/25 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:border-cream/60">
                            +7 (920) 008-54-16
                        </a>
                    </Reveal>
                </div>
            </section>
        </div>
    );
};
