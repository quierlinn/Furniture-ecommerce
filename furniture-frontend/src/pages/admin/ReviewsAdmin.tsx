import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, ArrowLeft, X, Star, Eye, EyeOff } from 'lucide-react';
import { api } from '../../api/client';
import type { Review, PaginatedReviews } from '../../types';

const reviewSchema = z.object({
    authorName: z.string().min(1, 'Имя обязательно'),
    authorCity: z.string().optional(),
    rating: z.number().min(1).max(5),
    content: z.string().min(10, 'Текст отзыва минимум 10 символов'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const Stars = ({ value }: { value: number }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
            />
        ))}
    </div>
);

export const ReviewsAdmin = () => {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const reviewsQuery = useQuery<PaginatedReviews>({
        queryKey: ['admin-reviews', currentPage],
        queryFn: () => api.adminGetReviews(currentPage, 10),
    });
    const reviewsData = reviewsQuery.data;

    const form = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: { authorName: '', authorCity: '', rating: 5, content: '' },
    });

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
        queryClient.invalidateQueries({ queryKey: ['reviews'] });
    };

    const createMutation = useMutation({
        mutationFn: (data: ReviewFormData) => api.createReview({ ...data, published: true }),
        onSuccess: () => { invalidate(); closeModal(); },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: ReviewFormData }) => api.updateReview(id, data),
        onSuccess: () => { invalidate(); closeModal(); },
    });

    const toggleMutation = useMutation({
        mutationFn: (id: number) => api.toggleReview(id),
        onSuccess: invalidate,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.deleteReview(id),
        onSuccess: invalidate,
    });

    const openCreate = () => {
        setEditingReview(null);
        form.reset({ authorName: '', authorCity: '', rating: 5, content: '' });
        setShowModal(true);
    };

    const openEdit = (review: Review) => {
        setEditingReview(review);
        form.reset({
            authorName: review.authorName,
            authorCity: review.authorCity ?? '',
            rating: review.rating,
            content: review.content,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingReview(null);
        form.reset();
    };

    const onSubmit = (data: ReviewFormData) => {
        if (editingReview) {
            updateMutation.mutate({ id: editingReview.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin" className="text-gray-600 hover:text-primary">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold">💬 Отзывы</h1>
                </div>
                <button onClick={openCreate} className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Добавить отзыв
                </button>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Автор</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Оценка</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Отзыв</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {!reviewsData || reviewsData.content.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                Отзывов пока нет
                            </td>
                        </tr>
                    ) : (
                        reviewsData.content.map((review) => (
                            <tr key={review.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <p className="font-medium">{review.authorName}</p>
                                    {review.authorCity && (
                                        <p className="text-sm text-gray-500">{review.authorCity}</p>
                                    )}
                                </td>
                                <td className="px-6 py-4"><Stars value={review.rating} /></td>
                                <td className="max-w-md px-6 py-4">
                                    <p className="line-clamp-2 text-sm text-gray-600">{review.content}</p>
                                </td>
                                <td className="px-6 py-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            review.published
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {review.published ? 'Опубликован' : 'Скрыт'}
                                        </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleMutation.mutate(review.id)}
                                            title={review.published ? 'Скрыть' : 'Опубликовать'}
                                            className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                        >
                                            {review.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => openEdit(review)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Удалить отзыв?')) deleteMutation.mutate(review.id);
                                            }}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {reviewsData && reviewsData.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        disabled={reviewsData.first}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Назад
                    </button>
                    <span className="px-4 py-2">
                        Страница {reviewsData.number + 1} из {reviewsData.totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(reviewsData.totalPages - 1, p + 1))}
                        disabled={reviewsData.last}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Вперёд
                    </button>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="mx-4 w-full max-w-lg rounded-lg bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                {editingReview ? 'Редактировать отзыв' : 'Новый отзыв'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Имя *</label>
                                    <input
                                        type="text"
                                        {...form.register('authorName')}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Мария К."
                                    />
                                    {form.formState.errors.authorName && (
                                        <p className="mt-1 text-sm text-red-600">{form.formState.errors.authorName.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Город</label>
                                    <input
                                        type="text"
                                        {...form.register('authorCity')}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Москва"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Оценка *</label>
                                <select
                                    {...form.register('rating', { valueAsNumber: true })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {[5, 4, 3, 2, 1].map((r) => (
                                        <option key={r} value={r}>{'★'.repeat(r)} ({r})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Текст отзыва *</label>
                                <textarea
                                    {...form.register('content')}
                                    rows={5}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Заказывали кухню в марте. Очень довольны результатом..."
                                />
                                {form.formState.errors.content && (
                                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.content.message}</p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="flex-1 btn-outline">
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                    className="flex-1 btn-primary"
                                >
                                    {createMutation.isPending || updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
