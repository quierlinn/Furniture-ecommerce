import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, ArrowLeft, Search, X } from 'lucide-react';
import { api } from '../../api/client';
import type { Product, PaginatedProducts, Category } from '../../types';
import { formatPrice } from '../../utils/format';

const productSchema = z.object({
    name: z.string().min(1, 'Название обязательно'),
    description: z.string().min(1, 'Описание обязательно'),
    price: z.number().min(0, 'Цена должна быть положительной'),
    imageUrl: z.string().optional(),
    categoryId: z.number().min(1, 'Категория обязательна'),
});

type ProductFormData = z.infer<typeof productSchema>;

export const ProductsAdmin = () => {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    // ✅ Надёжный способ: явно извлекаем data
    const productsQuery = useQuery<PaginatedProducts>({
        queryKey: ['products', 'admin', currentPage, searchQuery],
        queryFn: () => api.getProducts({
            page: currentPage,
            size: 10,
            query: searchQuery || undefined,
        }),
        staleTime: 2 * 60 * 1000,
    });
    const productsData = productsQuery.data;
    const isLoading = productsQuery.isLoading;

    const categoriesQuery = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: () => api.getCategories(),
        staleTime: 10 * 60 * 1000,
    });
    const categories = categoriesQuery.data;

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            imageUrl: '',
            categoryId: 1,
        },
    });

    const createMutation = useMutation({
        mutationFn: (formData: ProductFormData) => api.createProduct(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setShowModal(false);
            form.reset();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, formData }: { id: number; formData: ProductFormData }) =>
            api.updateProduct(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setShowModal(false);
            setEditingProduct(null);
            form.reset();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const onSubmit = (formData: ProductFormData) => {
        if (editingProduct) {
            updateMutation.mutate({ id: editingProduct.id, formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        form.setValue('name', product.name);
        form.setValue('description', product.description);
        form.setValue('price', product.price);
        form.setValue('imageUrl', product.imageUrl || '');
        form.setValue('categoryId', product.categoryId || 1);
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        form.reset();
    };

    if (isLoading) {
        return <div className="py-20 text-center">Загрузка товаров...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin" className="text-gray-600 hover:text-primary">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold">📦 Управление товарами</h1>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Добавить товар
                </button>
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Поиск товаров..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(0); }}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => { setSearchQuery(''); setCurrentPage(0); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Категория</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Цена</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {!productsData || productsData.content.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Товары не найдены</td>
                        </tr>
                    ) : (
                        productsData.content.map((product: Product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-500">#{product.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                                            <img
                                                src={product.imageUrl || `https://placehold.co/40x40?text=${product.name.charAt(0)}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="font-medium">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {product.category?.name || `ID: ${product.categoryId}`}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">{formatPrice(product.price)}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
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

            {productsData && productsData.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                        disabled={productsData.first}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Назад
                    </button>
                    <span className="px-4 py-2">
            Страница {productsData.number + 1} из {productsData.totalPages}
          </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(productsData.totalPages - 1, p + 1))}
                        disabled={productsData.last}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Вперёд
                    </button>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {editingProduct ? 'Редактировать товар' : 'Новый товар'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
                                <input
                                    type="text"
                                    {...form.register('name')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                {form.formState.errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Описание *</label>
                                <textarea
                                    {...form.register('description')}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                {form.formState.errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.description.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Цена *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...form.register('price', { valueAsNumber: true })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                {form.formState.errors.price && (
                                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.price.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL изображения</label>
                                <input
                                    type="url"
                                    {...form.register('imageUrl')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Категория *</label>
                                <select
                                    {...form.register('categoryId', { valueAsNumber: true })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {categories?.map((cat: Category) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {form.formState.errors.categoryId && (
                                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.categoryId.message}</p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 btn-outline"
                                >
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
