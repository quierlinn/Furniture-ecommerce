import { ArrowRight, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import {formatPriceFrom} from "../../utils/format.ts";
import {stripMarkdown} from "../../utils/markdown.ts";

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
            <div className="aspect-[4/3] overflow-hidden bg-sand">
                <img
                    src={product.images?.[0] || 'https://placehold.co/400x300?text=No+Image'}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
            </div>
        </button>

        <div className="mt-4 flex items-baseline justify-between gap-3">
            <h3 className="font-bold tracking-tight">{product.name}</h3>
            <span className="shrink-0 font-extrabold text-walnut">{formatPriceFrom(product.price)}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
            {stripMarkdown(product.description).slice(0, 140)}...
        </p>

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
