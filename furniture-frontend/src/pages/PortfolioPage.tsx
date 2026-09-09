import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { api } from '../api/client';
import type { Category, PortfolioWork } from '../types';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/ui/Reveal';
import { cn } from '../lib/cn';

const chip = (active: boolean) =>
    cn(
        'rounded-btn border px-4 py-2 text-sm font-semibold transition-colors',
        active
            ? 'border-walnut bg-walnut text-milk'
            : 'border-ink/15 bg-milk text-ink-soft hover:border-walnut/40 hover:text-walnut'
    );

export const PortfolioPage = () => {
    const [categoryId, setCategoryId] = useState<number | null>(null);

    const { data: categories = [] } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: () => api.getCategories(),
    });

    const { data: works = [], isLoading } = useQuery<PortfolioWork[]>({
        queryKey: ['portfolio', categoryId],
        queryFn: () => api.getPortfolio(categoryId ?? undefined),
    });

    return (
        <div className="container-site py-10 md:py-16">
            <SectionHeading
                overline="Портфолио"
                title="Работы, которые уже живут у людей"
            />
            <p className="-mt-4 mb-10 max-w-xl text-ink-soft md:mb-12">
                Каждая работа — под конкретное пространство и сценарии семьи. Без складов и «типовых решений».
            </p>

            <div className="mb-10 flex flex-wrap gap-2">
                <button onClick={() => setCategoryId(null)} className={chip(categoryId === null)}>
                    Все работы
                </button>
                {categories.map((c) => (
                    <button key={c.id} onClick={() => setCategoryId(c.id)} className={chip(categoryId === c.id)}>
                        {c.name}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="py-20 text-center text-ink-soft">Загрузка работ...</div>
            ) : works.length === 0 ? (
                <div className="py-20 text-center text-ink-soft">В этой категории работ пока нет.</div>
            ) : (
                <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
                    {works.map((w, i) => {
                        const avg = w.reviews.length
                            ? (w.reviews.reduce((s, r) => s + r.rating, 0) / w.reviews.length).toFixed(1)
                            : null;
                        return (
                            <Reveal key={w.id} delay={(i % 2) * 0.08}>
                                <Link to={`/portfolio/${w.id}`} className="group block">
                                    <div className="overflow-hidden rounded-img bg-sand">
                                        <img
                                            src={w.images?.[0]}
                                            alt={w.title}
                                            loading="lazy"
                                            className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                        />
                                    </div>
                                    <div className="mt-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-terra">
                                        {w.categoryName}
                                        {avg && (
                                            <span className="flex items-center gap-1 normal-case tracking-normal text-ink-soft">
                                                <Star className="h-3.5 w-3.5 fill-terra text-terra" strokeWidth={1.5} />
                                                {avg} · {w.reviews.length} отз.
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="mt-2 text-lg font-extrabold tracking-tight transition-colors group-hover:text-walnut md:text-xl">
                                        {w.title}
                                    </h3>
                                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                                        {w.description}
                                    </p>
                                </Link>
                            </Reveal>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
