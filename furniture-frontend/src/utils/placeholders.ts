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
    if (product.images?.[0]) return product.images[0];
    const pool = POOLS[product.categoryId ?? 0] ?? FALLBACK;
    return pool[product.id % pool.length];
}

export function getCategoryImage(categoryId: number): string {
    return (POOLS[categoryId] ?? FALLBACK)[0];
}

// ===== ABOUT PAGE =====
const uAbout = (id: string, w = 1200) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const ABOUT_WORKSHOP = uAbout('photo-1581091226825-a6a2a5aee158', 1600); // фото цеха
export const ABOUT_HERO = uAbout('photo-1600585154340-be6161a56a0c', 1600);    // главное фото
export const ABOUT_CUSTOM = uAbout('photo-1618221195710-dd6b41faaea6', 1600);   // индивидуальный проект
export const ABOUT_PROCESS = [
    uAbout('photo-1504148455328-c376907d081c', 800),  // раскрой
    uAbout('photo-1565793298595-6a879b1d9492', 800),  // обработка
    uAbout('photo-1581092918056-0c4c3acd3789', 800),  // покраска
    uAbout('photo-1558618666-fcd25c85cd64', 800),      // сборка
    uAbout('photo-1581092160562-40aa08e78837', 800),   // монтаж
];
export const ABOUT_CATEGORIES = [
    { name: 'Кухни', img: uAbout('photo-1556909114-f6e7ad7d3136', 800) },
    { name: 'Корпусная мебель', img: uAbout('photo-1595428774223-ef52624120d2', 800) },
    { name: 'Лестницы', img: uAbout('photo-1600566753190-17f0baa2a6c3', 800) },
    { name: 'Гостиные', img: uAbout('photo-1567016432779-094069958ea5', 800) },
    { name: 'Гардеробные', img: uAbout('photo-1558997519-83ea9252edf8', 800) },
    { name: 'Индивидуальные проекты', img: uAbout('photo-1616486338812-3dadae4b4ace', 800) },
];
export const ABOUT_CUSTOM_SMALL = [
    { title: 'Нестандартный размер', img: uAbout('photo-1600607687939-ce8a6c25118c', 600) },
    { title: 'Сложная конструкция', img: uAbout('photo-1600566753086-00f18fb6b3ea', 600) },
    { title: 'Индивидуальное решение', img: uAbout('photo-1615529182904-14819c35db37', 600) },
];
