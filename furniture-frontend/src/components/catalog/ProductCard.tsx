import { ArrowRight, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { getProductImage } from '../../utils/placeholders';
import { formatPriceFrom } from '../../utils/format';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onViewDetails: (id: number) => void;
}

export const ProductCard = ({ product, onAddToCart, onViewDetails }: ProductCardProps) => (
    <article className="group flex flex-col">
        <button
            onClick={() => onViewDetails(product.id)}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-img bg-sand"
            aria-label={product.name}
        >
            <img
                src={getProductImage(product)}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
        </button>

        <div className="mt-4 flex items-baseline justify-between gap-3">
            <h3 className="font-bold tracking-tight">{product.name}</h3>
            <span className="shrink-0 font-extrabold text-walnut">{formatPriceFrom(product.price)}</span>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-ink-soft">{product.description}</p>

        <div className="mt-3 flex items-center gap-2">
            <button
                onClick={() => onViewDetails(product.id)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-terra"
            >
                Подробнее <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
            </button>
            <button
                onClick={() => onAddToCart(product)}
                className="ml-auto rounded-btn border border-ink/15 bg-milk p-2.5 text-ink transition-colors hover:border-walnut hover:bg-walnut hover:text-milk"
                aria-label={`Добавить ${product.name} в корзину`}
            >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
            </button>
        </div>
    </article>
);
