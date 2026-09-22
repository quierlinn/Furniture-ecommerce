import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft } from 'lucide-react';
import { api } from '../api/client';
import type { Product } from '../types';
import { formatPriceFrom } from '../utils/format';
import { cn } from '../lib/cn';

export const ProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const [activeImg, setActiveImg] = useState(0);

    const { data: product, isLoading, isError } = useQuery<Product>({
        queryKey: ['product', id],
        queryFn: () => api.getProduct(Number(id)),
        enabled: !!id,
    });

    const { data: similar = [] } = useQuery<Product[]>({
        queryKey: ['similar', product?.categoryId],
        queryFn: () => api.getProductsByCategory(product!.categoryId),
        enabled: !!product?.categoryId,
    });

    if (isLoading) return <div className="py-20 text-center text-ink-soft">Загрузка...</div>;
    if (isError || !product) {
        return (
            <div className="py-20 text-center">
                <h1 className="text-2xl font-extrabold">Товар не найден</h1>
                <Link to="/catalog" className="btn-secondary mt-6 inline-flex">← В каталог</Link>
            </div>
        );
    }

    const images = product.images?.length ? product.images : [];

    return (
        <div className="container-site py-10 md:py-16">
            <Link
                to="/catalog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-walnut"
            >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> В каталог
            </Link>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
                <div>
                    {images.length > 0 ? (
                        <>
                            <div className="overflow-hidden rounded-img bg-sand">
                                <img
                                    src={images[activeImg] ?? images[0]}
                                    alt={product.name}
                                    className="aspect-[4/3] w-full object-cover"
                                />
                            </div>
                            {images.length > 1 && (
                                <div className="mt-3 flex gap-3 overflow-x-auto">
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImg(i)}
                                            className={cn(
                                                'h-20 w-24 shrink-0 overflow-hidden rounded-btn transition-all',
                                                i === activeImg
                                                    ? 'ring-2 ring-walnut ring-offset-2 ring-offset-cream'
                                                    : 'opacity-70 hover:opacity-100'
                                            )}
                                        >
                                            <img src={img} alt="" className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex aspect-[4/3] items-center justify-center rounded-img bg-sand text-sm text-ink-soft">
                            Изображение скоро появится
                        </div>
                    )}
                </div>

                <div>
                    <p className="overline-title">{product.category?.name}</p>
                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{product.name}</h1>

                    <div className="mt-6 space-y-2">
                        <p className="text-3xl font-extrabold tracking-tight text-ink">
                            {formatPriceFrom(product.price)}
                        </p>
                        <p className="text-sm leading-relaxed text-ink-soft">
                            Стартовая цена за минимальную комплектацию. Точную стоимость под ваши
                            размеры и материалы посчитаем при подтверждении заказа.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link to="/contacts" className="btn-primary">Обсудить заказ</Link>
                        <Link to="/catalog" className="btn-secondary">В каталог</Link>
                    </div>
                </div>
            </div>

            {product.description && (
                <section className="prose prose-ink mt-16 max-w-none md:mt-24">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: (props) => <h1 className="text-4xl font-extrabold tracking-tight" {...props} />,
                            h2: (props) => <h2 className="mt-12 text-3xl font-extrabold tracking-tight" {...props} />,
                            h3: (props) => <h3 className="mt-8 text-2xl font-bold" {...props} />,
                            p: (props) => <p className="mt-4 leading-relaxed text-ink-soft" {...props} />,
                            ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-soft" {...props} />,
                            ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-ink-soft" {...props} />,
                            strong: (props) => <strong className="font-bold text-ink" {...props} />,
                            a: (props) => (
                                <a className="font-semibold text-terra hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                            ),
                            blockquote: (props) => (
                                <blockquote className="my-6 border-l-4 border-walnut/40 pl-6 italic text-ink-soft" {...props} />
                            ),
                            hr: () => <hr className="my-10 border-ink/10" />,
                        }}
                    >
                        {product.description}
                    </ReactMarkdown>
                </section>
            )}

            {similar.filter((p) => p.id !== product.id).length > 0 && (
                <section className="mt-16 md:mt-24">
                    <h2 className="overline-title">Похожие товары</h2>
                    <h3 className="mt-2 text-2xl font-extrabold tracking-tight">В этой категории</h3>
                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {similar
                            .filter((p) => p.id !== product.id)
                            .slice(0, 3)
                            .map((p) => (
                                <Link key={p.id} to={`/product/${p.id}`} className="group block">
                                    <div className="aspect-[4/3] overflow-hidden rounded-img bg-sand">
                                        <img
                                            src={p.images?.[0] || 'https://placehold.co/400x300?text=No+Image'}
                                            alt={p.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                        />
                                    </div>
                                    <h4 className="mt-3 font-bold tracking-tight transition-colors group-hover:text-walnut">
                                        {p.name}
                                    </h4>
                                    <p className="mt-1 text-sm font-bold text-walnut">{formatPriceFrom(p.price)}</p>
                                </Link>
                            ))}
                    </div>
                </section>
            )}
        </div>
    );
};
