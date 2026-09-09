import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Pencil, Plus, Star, Trash2, X } from 'lucide-react';
import { api } from '../../api/client';
import type { Category, PortfolioWork, PortfolioWorkRequest } from '../../types';
import { Button } from '../../components/ui/Button';

const emptyForm = { title: '', description: '', categoryId: '', imagesText: '' };

export const PortfolioAdmin = () => {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<PortfolioWork | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState<string | null>(null);
    const [listError, setListError] = useState<string | null>(null);

    const { data: works = [], isLoading } = useQuery<PortfolioWork[]>({
        queryKey: ['portfolio', 'admin'],
        queryFn: () => api.getPortfolio(),
        staleTime: 0,
    });

    const { data: categories = [] } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: () => api.getCategories(),
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['portfolio'] });

    const createMutation = useMutation({
        mutationFn: (p: PortfolioWorkRequest) => api.createPortfolioWork(p),
        onSuccess: () => { invalidate(); closeModal(); },
        onError: (e: any) => setFormError(e.response?.data?.message || 'Ошибка создания работы'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, p }: { id: number; p: PortfolioWorkRequest }) => api.updatePortfolioWork(id, p),
        onSuccess: () => { invalidate(); closeModal(); },
        onError: (e: any) => setFormError(e.response?.data?.message || 'Ошибка сохранения работы'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.deletePortfolioWork(id),
        onSuccess: () => { invalidate(); setListError(null); },
        onError: (e: any) => setListError(e.response?.data?.message || 'Не удалось удалить работу'),
    });

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setFormError(null);
        setModalOpen(true);
    };

    const openEdit = (w: PortfolioWork) => {
        setEditing(w);
        setForm({
            title: w.title,
            description: w.description,
            categoryId: w.categoryId ? String(w.categoryId) : '',
            imagesText: (w.images || []).join('\n'),
        });
        setFormError(null);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) return setFormError('Укажите название работы');
        if (!form.description.trim()) return setFormError('Добавьте описание работы');

        const payload: PortfolioWorkRequest = {
            title: form.title.trim(),
            description: form.description.trim(),
            categoryId: form.categoryId ? Number(form.categoryId) : null,
            images: form.imagesText.split('\n').map((s) => s.trim()).filter(Boolean),
        };

        setFormError(null);
        if (editing) updateMutation.mutate({ id: editing.id, p: payload });
        else createMutation.mutate(payload);
    };

    const handleDelete = (w: PortfolioWork) => {
        if (confirm(`Удалить работу «${w.title}»? Отзывы удалятся вместе с ней.`)) {
            deleteMutation.mutate(w.id);
        }
    };

    const pending = createMutation.isPending || updateMutation.isPending;
    const previewImages = form.imagesText.split('\n').map((s) => s.trim()).filter(Boolean);

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="overline-title">
                        <Link to="/admin" className="hover:text-walnut">Админ-панель</Link> / Портфолио
                    </p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Работы портфолио</h1>
                </div>
                <Button onClick={openCreate}>
                    <Plus className="h-4 w-4" strokeWidth={1.75} /> Добавить работу
                </Button>
            </div>

            {listError && (
                <div className="flex items-center gap-2 rounded-card border border-terra/30 bg-terra/10 px-4 py-3 text-sm font-semibold text-terra-dark">
                    <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    {listError}
                </div>
            )}

            {isLoading ? (
                <div className="py-20 text-center text-ink-soft">Загрузка работ...</div>
            ) : (
                <div className="card divide-y divide-ink/5 overflow-hidden">
                    {works.length === 0 && (
                        <div className="px-6 py-12 text-center text-ink-soft">Работ пока нет — добавьте первую.</div>
                    )}
                    {works.map((w) => (
                        <div key={w.id} className="flex items-center gap-4 px-6 py-4">
                            <div className="h-16 w-20 shrink-0 overflow-hidden rounded-btn bg-sand">
                                {w.images?.[0] ? (
                                    <img src={w.images[0]} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-bold">{w.title}</p>
                                <p className="mt-0.5 flex items-center gap-3 text-xs text-ink-soft">
                                    <span>{w.categoryName ?? 'Без категории'}</span>
                                    <span className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-terra text-terra" strokeWidth={1.5} />
                                        {w.reviews.length} отз.
                                    </span>
                                </p>
                            </div>
                            <div className="flex shrink-0 gap-1">
                                <button
                                    onClick={() => openEdit(w)}
                                    className="rounded-btn p-2.5 text-ink-soft transition-colors hover:bg-ink/5 hover:text-walnut"
                                    aria-label={`Редактировать ${w.title}`}
                                >
                                    <Pencil className="h-4 w-4" strokeWidth={1.75} />
                                </button>
                                <button
                                    onClick={() => handleDelete(w)}
                                    className="rounded-btn p-2.5 text-ink-soft transition-colors hover:bg-terra/10 hover:text-terra"
                                    aria-label={`Удалить ${w.title}`}
                                >
                                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ===== Модалка создания/редактирования ===== */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={closeModal}>
                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-modal bg-milk p-6 shadow-lift md:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-extrabold tracking-tight">
                                {editing ? 'Редактировать работу' : 'Новая работа'}
                            </h2>
                            <button onClick={closeModal} className="rounded-btn p-2 text-ink-soft hover:bg-ink/5" aria-label="Закрыть">
                                <X className="h-5 w-5" strokeWidth={1.75} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-ink-soft">Название *</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Например: Кухня из ясеня для квартиры в центре"
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-ink-soft">Категория</label>
                                <select
                                    value={form.categoryId}
                                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="">Без категории</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-ink-soft">Описание *</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={6}
                                    placeholder={'Расскажите про задачу и решение. Пустая строка = новый абзац.'}
                                    className="input-field resize-y"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-ink-soft">
                                    Фотографии — по одной ссылке в строке
                                </label>
                                <textarea
                                    value={form.imagesText}
                                    onChange={(e) => setForm({ ...form, imagesText: e.target.value })}
                                    rows={4}
                                    placeholder={'https://...\nhttps://...'}
                                    className="input-field resize-y font-mono text-xs"
                                />
                                {previewImages.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {previewImages.map((url, i) => (
                                            <img
                                                key={i}
                                                src={url}
                                                alt=""
                                                className="h-16 w-20 rounded-btn bg-sand object-cover"
                                                onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0.25')}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {formError && (
                                <div className="flex items-center gap-2 rounded-btn bg-terra/10 px-3 py-2.5 text-sm font-semibold text-terra-dark">
                                    <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                                    {formError}
                                </div>
                            )}

                            <div className="flex gap-3 pt-1">
                                <Button type="button" variant="secondary" className="flex-1" onClick={closeModal}>
                                    Отмена
                                </Button>
                                <Button type="submit" className="flex-1" loading={pending}>
                                    {editing ? 'Сохранить' : 'Опубликовать'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
