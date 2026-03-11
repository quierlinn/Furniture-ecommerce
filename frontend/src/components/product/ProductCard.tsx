import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils/formatters';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: string, qty: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const addToCart = useCartStore(state => state.addItem);

  const handleAddToCart = () => {
    addToCart(product, 1);
    if (onAddToCart) {
      onAddToCart(product.id, 1);
    }
  };

  return (
    <div className="card-product overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.badges?.includes('new') && (
            <Badge className="badge-new">Новинка</Badge>
          )}
          {product.badges?.includes('hit') && (
            <Badge className="badge-hit">Хит</Badge>
          )}
          {product.badges?.includes('sale') && product.oldPrice && (
            <Badge className="badge-sale">Скидка</Badge>
          )}
        </div>

        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.image.hoverSrc || product.image.src}
            alt={product.image.alt}
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Quick add buttons overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-3">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full p-3 bg-white/90 hover:bg-white text-gray-900 backdrop-blur-sm"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full p-3 bg-white/90 hover:bg-white text-gray-900 backdrop-blur-sm"
            >
              <Eye className="h-5 w-5" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full p-3 bg-white/90 hover:bg-white text-gray-900 backdrop-blur-sm"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Article */}
        {product.article && (
          <p className="text-xs text-muted-foreground mb-1">{product.article}</p>
        )}

        {/* Name */}
        <h3 className="font-bold text-base mb-1 line-clamp-2 h-12 text-gray-900">
          {product.name}
        </h3>

        {/* Dimensions */}
        <p className="text-xs text-muted-foreground mb-3">
          {product.dimensions}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-amber-600">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {/* In stock indicator */}
        <div className="mb-3">
          {product.inStock ? (
            <span className="text-xs text-green-600 font-medium">В наличии</span>
          ) : (
            <span className="text-xs text-red-600 font-medium">Нет в наличии</span>
          )}
        </div>

        {/* Add to cart button */}
        <Button
          className="w-full py-5 text-base font-medium"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {!product.inStock ? 'Заказать' : 'В корзину'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
