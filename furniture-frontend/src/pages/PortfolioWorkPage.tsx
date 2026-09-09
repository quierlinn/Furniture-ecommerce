import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar } from 'lucide-react';
import { api } from '../api/client';
import type { PortfolioWork } from '../types';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Stars } from '../components/ui/Stars';
import { Reveal } from '../components/ui/Reveal';
import { cn } from '../lib/cn';

export const PortfolioWorkPage = () => {
    const { id } = useParams<{ id: string }>();
    const numericId = id ? Number(id) : null;
    const [activeImg, setActiveImg] = useState(0);

    const { data: work, isLoading, isError } = useQuery<PortfolioWork>({
        queryKey: ['portfolio', 'work', numericId],
        queryFn: () => api.getPortfolioWork(numericId!),
        enabled: numericId !== null,
    });

    const { data: allWorks = [] } = useQuery<PortfolioWork[]>({
        queryKey: ['portfolio', 'all'],
        queryFn: () => api.getPortfolio(),
    });

    if (isLoading) return <div className="py-20 text-center text-ink-soft">Загрузка работы...</div>;
    if (isError || !work) {
        return (
            <div className="py-20 text-center">
                <h1 className="text-2xl font-extrabold">Работа не найдена</h1>
                <Link to="/portfolio" className="btn-secondary mt-6 inline-flex">← Все работы</Link>
            </div>
        );
    }

    const images = work.images?.length ? work.images : [];
    const avg = work.reviews.length
        ? work.reviews.reduce((s, r) => s + r.rating, 0) / work.reviews.length
        : null;
    const similar = allWorks
        .filter((w) => w.id !== work.id && w.categoryId === work.categoryId)
        .slice(0, 3);

    return (
        <div className="container-site py-10 md:py-16">
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-walnut">
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Все работы
            </Link>

            {/* ===== Шапка поста + галерея ===== */}
            <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
                <div>
                    {images.length > 0 && (
                        <>
                            <img
                                src={images[activeImg] ?? images[0]}
                                alt={work.title}
                                className="aspect-[4/3] w-full rounded-img bg-sand object-cover"
                            />
                            {images.length > 1 && (
                                <div className="mt-3 flex gap-3">
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImg(i)}
                                            className={cn(
                                                'h-20 w-24 overflow-hidden rounded-btn transition-all',
                                                i === activeImg ? 'ring-2 ring-walnut ring-offset-2 ring-offset-cream' : 'opacity-70 hover:opacity-100'
                                            )}
                                        >
                                            <img src={img} alt="" className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div>
                    <p className="overline-title">{work.categoryName ?? 'Портфолио'}</p>
                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{work.title}</h1>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-soft">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" strokeWidth={1.75} />
                            {new Date(work.createdAt).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                        </span>
                        {avg !== null && (
                            <span className="flex items-center gap-2">
                                <Stars value={avg} /> {avg.toFixed(1)} · {work.reviews.length} отз.
                            </span>
                        )}
                    </div>

                    <p className="mt-6 whitespace-pre-line leading-relaxed text-ink-soft">{work.description}</p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link to="/contacts" className="btn-primary">Рассчитать похожий заказ</Link>
                        <Link to="/catalog" className="btn-secondary">Смотреть каталог</Link>
                    </div>
                </div>
            </div>

            {/* ===== Отзывы ===== */}
            <section className="mt-16 md:mt-24">
                <SectionHeading overline="Отзывы" title="Что говорит заказчик" />
                {work.reviews.length === 0 ? (
                    <p className="text-ink-soft">Отзывов пока нет — эта работа совсем недавно у заказчиков.</p>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2">
                        {work.reviews.map((r, i) => (
                            <Reveal key={r.id} delay={i * 0.06}>
                                <div className="card h-full p-6 md:p-7">
                                    <Stars value={r.rating} />
                                    <p className="mt-4 text-sm leading-relaxed text-ink-soft">{r.text}</p>
                                    <p className="mt-5 text-sm font-extrabold">{r.authorName}</p>
                                    <p className="mt-0.5 text-xs text-ink-soft">
                                        {new Date(r.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                )}
            </section>

            {/* ===== Похожие работы ===== */}
            {similar.length > 0 && (
                <section className="mt-16 md:mt-24">
                    <SectionHeading overline="Похожее" title="Ещё работы в этой категории" />
                    <div className="grid gap-6 sm:grid-cols-3">
                        {similar.map((w) => (
                            <Link key={w.id} to={`/portfolio/${w.id}`} className="group block">
                                <div className="overflow-hidden rounded-img bg-sand">
                                    <img
                                        src={w.images?.[0]}
                                        alt={w.title}
                                        loading="lazy"
                                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                    />
                                </div>
                                <h3 className="mt-3 font-bold tracking-tight transition-colors group-hover:text-walnut">{w.title}</h3>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
