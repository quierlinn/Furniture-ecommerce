import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from '../../api/client';
import type { Category } from '../../types';
import { Button } from '../../components/ui/Button';

export const CategoriesAdmin = () => {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [name, setName] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [listError, setListError] = useState<string | null>(null);

    const { data: categories = [], isLoading } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: () => api.getCategories(),
        staleTime: 0, // в админке всегда свежие
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['categories'] });

    const createMutation = useMutation({
        mutationFn: (n: string) => api.createCategory(n),
        onSuccess: () => { invalidate(); closeModal(); },
        onError: (e: any) => setFormError(e.response?.data?.message || 'Ошибка создания категории'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, n }: { id: number; n: string }) => api.updateCategory(id, n),
        onSuccess: () => { invalidate(); closeModal(); },
        onError: (e: any) => setFormError(e.response?.data?.message || 'Ошибка обновления категории'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.deleteCategory(id),
        onSuccess: () => { invalidate(); setListError(null); },
        onError: (e: any) => setListError(e.response?.data?.message || 'Не удалось удалить категорию'),
    });

    const openCreate = () => {
        setEditing(null);
        setName('');
        setFormError(null);
        setModalOpen(true);
    };

    const openEdit = (cat: Category) => {
        setEditing(cat);
        setName(cat.name);
        setFormError(null);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditing(null);
        setName('');
        setFormError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            setFormError('Название не может быть пустым');
            return;
        }
        if (editing) {
            updateMutation.mutate({ id: editing.id, n: trimmed });
        } else {
            createMutation.mutate(trimmed);
        }
    };

    const handleDelete = (cat: Category) => {
        if (confirm(`Удалить категорию «${cat.name}»?`)) {
            deleteMutation.mutate(cat.id);
        }
    };

    const pending = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="overline-title">
                        <Link to="/admin" className="hover:text-walnut">Админ-панель</Link> / Категории
                    </p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Категории каталога</h1>
                </div>
                <Button onClick={openCreate}>
                    <Plus className="h-4 w-4" strokeWidth={1.75} /> Добавить категорию
                </Button>
            </div>

            {listError && (
                <div className="flex items-center gap-2 rounded-card border border-terra/30 bg-terra/10 px-4 py-3 text-sm font-semibold text-terra-dark">
                    <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    {listError}
                </div>
            )}

            {isLoading ? (
                <div className="py-20 text-center text-ink-soft">Загрузка категорий...</div>
            ) : (
                <div className="card divide-y divide-ink/5 overflow-hidden">
                    {categories.length === 0 && (
                        <div className="px-6 py-12 text-center text-ink-soft">Категорий пока нет</div>
                    )}
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center justify-between gap-4 px-6 py-4">
                            <div>
                                <p className="font-bold">{cat.name}</p>
                                <p className="mt-0.5 text-xs text-ink-soft">ID #{cat.id}</p>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => openEdit(cat)}
                                    className="rounded-btn p-2.5 text-ink-soft transition-colors hover:bg-ink/5 hover:text-walnut"
                                    aria-label={`Редактировать ${cat.name}`}
                                >
                                    <Pencil className="h-4 w-4" strokeWidth={1.75} />
                                </button>
                                <button
                                    onClick={() => handleDelete(cat)}
                                    className="rounded-btn p-2.5 text-ink-soft transition-colors hover:bg-terra/10 hover:text-terra"
                                    aria-label={`Удалить ${cat.name}`}
                                >
                                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Модалка создания/редактирования */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={closeModal}>
                    <div
                        className="w-full max-w-md rounded-modal bg-milk p-6 shadow-lift"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-extrabold tracking-tight">
                                {editing ? 'Редактировать категорию' : 'Новая категория'}
                            </h2>
                            <button onClick={closeModal} className="rounded-btn p-2 text-ink-soft hover:bg-ink/5" aria-label="Закрыть">
                                <X className="h-5 w-5" strokeWidth={1.75} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-ink-soft">Название</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Например: Столы и стулья"
                                    className="input-field"
                                />
                            </div>

                            {formError && (
                                <div className="flex items-center gap-2 rounded-btn bg-terra/10 px-3 py-2.5 text-sm font-semibold text-terra-dark">
                                    <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                                    {formError}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="secondary" className="flex-1" onClick={closeModal}>
                                    Отмена
                                </Button>
                                <Button type="submit" className="flex-1" loading={pending}>
                                    {editing ? 'Сохранить' : 'Создать'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
