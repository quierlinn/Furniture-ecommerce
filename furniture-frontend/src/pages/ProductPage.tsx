import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { ProductCard } from '../components/catalog/ProductCard';
import { useCart } from '../hooks/useCart';
import { api } from '../api/client';
import type { Product, PaginatedProducts } from '../types';
import { formatPrice } from '../utils/format';
import { getProductImage } from '../utils/placeholders';

export const ProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState<number>(1);
    const [addedToCart, setAddedToCart] = useState<boolean>(false);

    const numericId = id ? Number(id) : null;

    // ✅ ИСПРАВЛЕНО: data: product
    const { data: product, isLoading, isError } = useQuery<Product>({
        queryKey: ['product', numericId],
        queryFn: () => api.getProductById(numericId!),
        enabled: numericId !== null,
        staleTime: 5 * 60 * 1000,
    });

    // ✅ ИСПРАВЛЕНО: data: relatedProducts
    const { data: relatedProducts } = useQuery<PaginatedProducts>({
        queryKey: ['products', 'category', product?.categoryId],
        queryFn: () => api.getProducts({
            categoryId: product?.categoryId ?? undefined,
            size: 4,
            sortBy: 'id',
            sortDir: 'desc',
        }),
        enabled: !!product?.categoryId,
        staleTime: 10 * 60 * 1000,
    });

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handleAddToCart = () => {
        if (product) {
            for (let i = 0; i < quantity; i++) {
                addToCart(product);
            }
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    if (isLoading) {
        return (
            <div className="py-12">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-48" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="aspect-square bg-gray-200 rounded-lg" />
                        <div className="space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                            <div className="h-10 bg-gray-200 rounded w-32" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Товар не найден</h2>
                <p className="text-gray-600 mb-6">Возможно, товар был удалён или ссылка устарела</p>
                <Link to="/catalog" className="btn-primary inline-flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Вернуться в каталог
                </Link>
            </div>
        );
    }

    const imageUrl = getProductImage(product);
    const relatedItems = relatedProducts?.content.filter((p: Product) => p.id !== product.id).slice(0, 4) || [];

    return (
        <div className="space-y-12">
            <nav className="text-sm text-gray-500">
                <ol className="flex items-center gap-2">
                    <li>
                        <Link to="/" className="hover:text-primary transition-colors">Главная</Link>
                    </li>
                    <li>/</li>
                    <li>
                        <Link
                            to={`/catalog?categoryId=${product.categoryId ?? ''}`}
                            className="hover:text-primary transition-colors"
                        >
                            {product.category?.name || 'Категория'}
                        </Link>
                    </li>
                    <li>/</li>
                    <li className="text-gray-900 font-medium truncate max-w-xs">{product.name}</li>
                </ol>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div className="space-y-4">
                    <div className="card overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full aspect-square object-cover"
                        />
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map((i: number) => (
                            <button
                                key={i}
                                className="w-20 h-20 border-2 border-transparent hover:border-primary rounded-lg overflow-hidden transition-colors"
                            >
                                <img
                                    src={imageUrl}
                                    alt={`${product.name} - вид ${i}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    {product.category && (
                        <Link
                            to={`/catalog?categoryId=${product.categoryId ?? ''}`}
                            className="inline-block text-sm text-primary hover:underline"
                        >
                            {product.category.name}
                        </Link>
                    )}

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>

                    <div className="space-y-2">
                        <p className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                        <p className="text-sm text-success flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            В наличии
                        </p>
                    </div>

                    <div className="prose prose-sm text-gray-600">
                        <p>{product.description || 'Описание товара будет добавлено позже.'}</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">Количество:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    className="p-2 hover:bg-gray-50 disabled:opacity-50"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="p-2 hover:bg-gray-50"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                className={`btn-primary flex-1 flex items-center justify-center gap-2 py-3 text-lg transition-all ${
                                    addedToCart ? 'bg-success hover:bg-green-600' : ''
                                }`}
                            >
                                {addedToCart ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Добавлено!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5" />
                                        В корзину
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                className="btn-outline px-6"
                            >
                                Назад
                            </button>
                        </div>
                    </div>

                    {product.id && (
                        <p className="text-sm text-gray-500">
                            Артикул: <span className="font-mono">#{product.id}</span>
                        </p>
                    )}
                </div>
            </div>

            {relatedItems.length > 0 && (
                <section className="pt-8 border-t">
                    <h2 className="text-2xl font-bold mb-6">Похожие товары</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedItems.map((related: Product) => (
                            <ProductCard
                                key={related.id}
                                product={related}
                                onAddToCart={addToCart}
                                onViewDetails={(pid: number) => navigate(`/product/${pid}`)}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
