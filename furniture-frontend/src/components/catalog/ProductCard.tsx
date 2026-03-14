import { ShoppingCart } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/format';
import { getProductImage } from '../../utils/placeholders';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onViewDetails: (productId: number) => void;
}

export const ProductCard = ({ product, onAddToCart, onViewDetails }: ProductCardProps) => {
    const imageUrl = getProductImage(product);

    return (
        <div className="card group hover:shadow-md transition-shadow">
            <div
                className="aspect-square bg-gray-100 overflow-hidden cursor-pointer"
                onClick={() => onViewDetails(product.id)}
            >
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
            </div>

            <div className="p-4">
                {/* ✅ Теперь category существует в типе Product */}
                {product.category && (
                    <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mb-2">
            {product.category.name}
          </span>
                )}

                <h3
                    className="font-medium text-gray-900 line-clamp-2 cursor-pointer hover:text-primary"
                    onClick={() => onViewDetails(product.id)}
                >
                    {product.name}
                </h3>

                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {product.description}
                </p>

                <div className="mt-3 flex items-center justify-between">
                    <div>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
                        <p className="text-xs text-success">✓ В наличии</p>
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    <button
                        onClick={() => onAddToCart(product)}
                        className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        В корзину
                    </button>
                    <button
                        onClick={() => onViewDetails(product.id)}
                        className="btn-outline text-sm"
                    >
                        Подробнее
                    </button>
                </div>
            </div>
        </div>
    );
};
