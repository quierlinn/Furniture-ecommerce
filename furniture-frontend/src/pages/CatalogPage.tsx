import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, SlidersHorizontal, Search, X } from 'lucide-react';
import { ProductCard } from '../components/catalog/ProductCard';
import { useCart } from '../hooks/useCart';
import { api } from '../api/client';
import type { Product, PaginatedProducts, Category } from '../types';

export const CatalogPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('categoryId') || '');
    const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('query') || '');
    const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') || 'id');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>(searchParams.get('sortDir') as 'asc' | 'desc' || 'asc');
    const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 0);
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

    const pageSize = 20;

    // ✅ ИСПРАВЛЕНО: правильная деструктуризация - data: variableName
    const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: () => api.getCategories(),
        staleTime: 10 * 60 * 1000,
    });

    const { data: productsData, isLoading, isError, refetch } = useQuery<PaginatedProducts>({
        queryKey: ['products', currentPage, selectedCategory, searchQuery, sortBy, sortDir],
        queryFn: () => api.getProducts({
            page: currentPage,
            size: pageSize,
            categoryId: selectedCategory ? Number(selectedCategory) : undefined,
            query: searchQuery || undefined,
            sortBy: sortBy as any,
            sortDir,
        }),
        staleTime: 2 * 60 * 1000,
    });

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('categoryId', selectedCategory);
        if (searchQuery) params.set('query', searchQuery);
        if (sortBy) params.set('sortBy', sortBy);
        if (sortDir) params.set('sortDir', sortDir);
        if (currentPage > 0) params.set('page', String(currentPage));
        setSearchParams(params);
    }, [selectedCategory, searchQuery, sortBy, sortDir, currentPage, setSearchParams]);

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setCurrentPage(0);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(0);
        refetch();
    };

    const handleSortChange = (newSortBy: string) => {
        if (sortBy === newSortBy) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortDir('asc');
        }
        setCurrentPage(0);
    };

    const handleViewDetails = (productId: number) => {
        navigate(`/product/${productId}`);
    };

    if (isError) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Ошибка загрузки товаров</h2>
                <p className="text-gray-600 mb-6">Проверьте, запущен ли бэкенд на http://localhost:8080</p>
                <button onClick={() => refetch()} className="btn-primary">
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold">Каталог товаров</h1>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1 md:flex-none md:w-64">
                        <input
                            type="text"
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <button type="submit" className="btn-primary whitespace-nowrap">
                        Найти
                    </button>
                </form>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <button
                    className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg"
                    onClick={() => setFiltersOpen(!filtersOpen)}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Фильтры
                </button>

                <div className={`w-full md:w-auto ${filtersOpen ? 'block' : 'hidden md:block'}`}>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`px-4 py-2 rounded-lg border transition-colors ${
                                !selectedCategory
                                    ? 'bg-primary text-white border-primary'
                                    : 'hover:bg-gray-50 border-gray-300'
                            }`}
                        >
                            Все
                        </button>
                        {categories.map((cat: Category) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(String(cat.id))}
                                className={`px-4 py-2 rounded-lg border transition-colors ${
                                    selectedCategory === String(cat.id)
                                        ? 'bg-primary text-white border-primary'
                                        : 'hover:bg-gray-50 border-gray-300'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-gray-600">Сортировать:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="id">По ID</option>
                        <option value="name">По названию</option>
                        <option value="price">По цене</option>
                    </select>
                    <button
                        onClick={() => setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        title={sortDir === 'asc' ? 'По возрастанию' : 'По убыванию'}
                    >
                        {sortDir === 'asc' ? '↑' : '↓'}
                    </button>
                </div>
            </div>

            {(selectedCategory || searchQuery) && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600">Фильтры:</span>
                    {selectedCategory && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {categories.find((c: Category) => String(c.id) === selectedCategory)?.name || 'Категория'}
                            <button onClick={() => handleCategoryChange('')} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
                    )}
                    {searchQuery && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              Поиск: "{searchQuery}"
              <button onClick={() => { setSearchQuery(''); setCurrentPage(0); }} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
                    )}
                    <button
                        onClick={() => { setSelectedCategory(''); setSearchQuery(''); setCurrentPage(0); }}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        Сбросить всё
                    </button>
                </div>
            )}

            {isLoading || categoriesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="card animate-pulse">
                            <div className="aspect-square bg-gray-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-full" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                <div className="h-8 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : !productsData || productsData.content.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-600 mb-4">🔍 Товары не найдены</p>
                    <button
                        onClick={() => { setSelectedCategory(''); setSearchQuery(''); }}
                        className="btn-primary"
                    >
                        Сбросить фильтры
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {productsData.content.map((product: Product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>

                    {productsData.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                disabled={productsData.first}
                                className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {Array.from({ length: productsData.totalPages }, (_, i) => i).slice(
                                Math.max(0, currentPage - 2),
                                Math.min(productsData.totalPages, currentPage + 3)
                            ).map((page: number) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg border transition-colors ${
                                        currentPage === page
                                            ? 'bg-primary text-white border-primary'
                                            : 'hover:bg-gray-50 border-gray-300'
                                    }`}
                                >
                                    {page + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(productsData.totalPages - 1, p + 1))}
                                disabled={productsData.last}
                                className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </>
            )}

            {productsData && !isLoading && (
                <p className="text-center text-sm text-gray-500 mt-4">
                    Показано {productsData.content.length} из {productsData.totalElements} товаров • Страница {productsData.number + 1} из {productsData.totalPages}
                </p>
            )}
        </div>
    );
};
