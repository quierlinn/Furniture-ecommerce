import type { Product } from '../types';

const u = (id: string, w = 900) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const HERO_IMAGE = u('photo-1618221195710-dd6b41faaea6', 1600);
export const WORKSHOP_IMAGE = u('photo-1504148455328-c376907d081c', 1200);

const POOLS: Record<number, string[]> = {
    1: [ // Кухни
        u('photo-1556911220-bff31c812dba'),
        u('photo-1600585154340-be6161a56a0c'),
        u('photo-1600566753086-00f18fb6b3ea'),
    ],
    2: [ // Прихожие
        u('photo-1595428774223-ef52624120d2'),
        u('photo-1600607687939-ce8a6c25118c'),
        u('photo-1600607687920-4e2a09cf159d'),
    ],
    3: [ // Гостиные
        u('photo-1555041469-a586c61ea9bc'),
        u('photo-1567016432779-094069958ea5'),
        u('photo-1616486338812-3dadae4b4ace'),
        u('photo-1618221195710-dd6b41faaea6'),
    ],
    4: [ // Спальни
        u('photo-1505693416388-ac5ce068fe85'),
        u('photo-1540518614846-7eded433c457'),
        u('photo-1616594039964-ae9021a400a0'),
    ],
};

const FALLBACK = [
    u('photo-1592078615290-033ee584e267'),
    u('photo-1503602642458-232111445657'),
    u('photo-1549497538-303791108f95'),
    u('photo-1586023492125-27b2c045efd7'),
];

export function getProductImage(product: Product): string {
    if (product.imageUrl) return product.imageUrl;
    const pool = POOLS[product.categoryId ?? 0] ?? FALLBACK;
    return pool[product.id % pool.length];
}

export function getCategoryImage(categoryId: number): string {
    return (POOLS[categoryId] ?? FALLBACK)[0];
}
