import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from '../../api/client';
import type { Category, Subcategory } from '../../types';
import { Button } from '../../components/ui/Button';

export const SubcategoriesAdmin = () => {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Subcategory | null>(null);
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState<number>(0);
    const [formError, setFormError] = useState<string | null>(null);
    const [listError, setListError] = useState<string | null>(null);

    const { data: subcategories = [], isLoading } = useQuery<Subcategory[]>({
        queryKey: ['subcategories'],
        queryFn: () => api.getSubcategories(),
        staleTime: 0,
    });

    const { data: categories = [] } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: () => api.getCategories(),
    });

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['subcategories'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
    };

    const createMutation = useMutation({
        mutationFn: () => api.createSubcategory({ categoryId, name: name.trim() }),
        onSuccess: () => { invalidate(); closeModal(); },
        onError: (e: any) => setFormError(e.response?.data?.message || 'Ошибка создания'),
    });

    const updateMutation = useMutation({
        mutationFn: () => api.updateSubcategory(editing!.id, { categoryId, name: name.trim() }),
        onSuccess: () => { invalidate(); closeModal(); },
        onError: (e: any) => setFormError(e.response?.data?.message || 'Ошибка обновления'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.deleteSubcategory(id),
        onSuccess: () => { invalidate(); setListError(null); },
        onError: (e: any) => setListError(e.response?.data?.message || 'Не удалось удалить'),
    });

    const openCreate = () => {
        setEditing(null);
        setName('');
        setCategoryId(categories[0]?.id || 0);
        setFormError(null);
        setModalOpen(true);
    };

    const openEdit = (sub: Subcategory) => {
        setEditing(sub);
        setName(sub.name);
        setCategoryId(sub.categoryId);
        setFormError(null);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditing(null);
        setName('');
        setCategoryId(0);
        setFormError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setFormError('Название не может быть пустым');
            return;
        }
        if (!categoryId) {
            setFormError('Выберите категорию');
            return;
        }
        if (editing) {
            updateMutation.mutate();
        } else {
            createMutation.mutate();
        }
    };

    const pending = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="overline-title">
                        <Link to="/admin" className="hover:text-walnut">Админ-панель</Link> / Подкатегории
                    </p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Подкатегории</h1>
                </div>
                <Button onClick={openCreate} disabled={categories.length === 0}>
                    <Plus className="h-4 w-4" strokeWidth={1.75} /> Добавить подкатегорию
                </Button>
            </div>

            {listError && (
                <div className="flex items-center gap-2 rounded-card border border-terra/30 bg-terra/10 px-4 py-3 text-sm font-semibold text-terra-dark">
                    <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    {listError}
                </div>
            )}

            {isLoading ? (
                <div className="py-20 text-center text-ink-soft">Загрузка...</div>
            ) : (
                <div className="card divide-y divide-ink/5 overflow-hidden">
                    {subcategories.length === 0 && (
                        <div className="px-6 py-12 text-center text-ink-soft">
                            Подкатегорий пока нет. Создайте первую через кнопку выше.
                        </div>
                    )}
                    {subcategories.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between gap-4 px-6 py-4">
                            <div>
                                <p className="font-bold">{sub.name}</p>
                                <p className="mt-0.5 text-xs text-ink-soft">
                                    Категория: <span className="font-semibold text-walnut">{sub.categoryName}</span>
                                    <span className="ml-2 text-ink-soft/60">· ID #{sub.id}</span>
                                </p>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => openEdit(sub)}
                                    className="rounded-btn p-2.5 text-ink-soft transition-colors hover:bg-ink/5 hover:text-walnut"
                                >
                                    <Pencil className="h-4 w-4" strokeWidth={1.75} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm(`Удалить подкатегорию «${sub.name}»? Товары с ней останутся без подкатегории.`)) {
                                            deleteMutation.mutate(sub.id);
                                        }
                                    }}
                                    className="rounded-btn p-2.5 text-ink-soft transition-colors hover:bg-terra/10 hover:text-terra"
                                >
                                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={closeModal}>
                    <div
                        className="w-full max-w-md rounded-modal bg-milk p-6 shadow-lift"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-extrabold tracking-tight">
                                {editing ? 'Редактировать подкатегорию' : 'Новая подкатегория'}
                            </h2>
                            <button onClick={closeModal} className="rounded-btn p-2 text-ink-soft hover:bg-ink/5">
                                <X className="h-5 w-5" strokeWidth={1.75} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-ink-soft">
                                    Родительская категория
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(Number(e.target.value))}
                                    className="input-field"
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-ink-soft">
                                    Название
                                </label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Например: Шкаф-купе"
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
