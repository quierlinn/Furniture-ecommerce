import { Link, useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/catalog/ProductCard';
import { useCart } from '../hooks/useCart';
import type { Product } from '../types';

const FEATURED_PRODUCTS: Product[] = [
    { id: 1, name: 'Кухня Лофт-01', description: 'Современная кухня в стиле лофт', price: 65451, imageUrl: null, categoryId: 1 },
    { id: 2, name: 'Шкаф-купе Классик', description: 'Вместительный шкаф для прихожей', price: 32990, imageUrl: null, categoryId: 2 },
    { id: 3, name: 'Диван Уют', description: 'Мягкий диван для гостиной', price: 45000, imageUrl: null, categoryId: 3 },
    { id: 4, name: 'Кровать Сканди', description: 'Деревянная кровать в скандинавском стиле', price: 28500, imageUrl: null, categoryId: 4 },
];

export const HomePage = () => {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleViewDetails = (productId: number) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="space-y-12">
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Мебель для вашего дома</h1>
                <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-2xl">
                    Качественная мебель от производителя с доставкой по всей России
                </p>
                <Link to="/catalog" className="btn-primary inline-block bg-white text-primary hover:bg-gray-100">
                    Смотреть каталог →
                </Link>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6">Категории</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Кухни', 'Прихожие', 'Гостиные', 'Спальни'].map((cat, i) => (
                        <Link
                            key={cat}
                            to={`/catalog?categoryId=${i + 1}`}
                            className="card p-6 text-center hover:shadow-md transition-shadow"
                        >
                            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🪑</span>
                            </div>
                            <span className="font-medium">{cat}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Хиты продаж</h2>
                    <Link to="/catalog" className="text-primary hover:underline">Все товары →</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURED_PRODUCTS.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={addToCart}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};
