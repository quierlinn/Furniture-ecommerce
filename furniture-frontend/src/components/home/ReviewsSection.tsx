import { useQuery } from '@tanstack/react-query';
import { Star, Quote } from 'lucide-react';
import { api } from '../../api/client';
import type { Review } from '../../types';

export const ReviewsSection = () => {
    const { data: reviews = [] } = useQuery<Review[]>({
        queryKey: ['reviews'],
        queryFn: () => api.getReviews(),
        staleTime: 10 * 60 * 1000,
    });

    if (reviews.length === 0) return null;

    return (
        <section className="bg-sand/40 py-16 md:py-24">
            <div className="container-site">
                <p className="overline-title">Отзывы клиентов</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                    Нам доверяют самое важное — уют дома
                </h2>

                <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reviews.slice(0, 6).map((review) => (
                        <article
                            key={review.id}
                            className="relative rounded-card bg-milk p-6 shadow-sm transition-shadow hover:shadow-md md:p-8"
                        >
                            <Quote className="absolute right-6 top-6 h-8 w-8 text-terra/20" />
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <p className="mt-4 leading-relaxed text-ink-soft">«{review.content}»</p>
                            <footer className="mt-6">
                                <p className="font-bold tracking-tight">{review.authorName}</p>
                                {review.authorCity && (
                                    <p className="text-sm text-ink-soft">{review.authorCity}</p>
                                )}
                            </footer>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};
