import type { Product } from '../types';

/**
 * Возвращает URL изображения для товара.
 * Если imageUrl не задан — генерирует заглушку с цветом и текстом.
 */
export const getProductImage = (product: Product, index: number = 0): string => {
    if (product.imageUrl && product.imageUrl.trim() !== '') {
        return product.imageUrl;
    }

    // Детерминированный выбор цвета по ID или индексу
    const colors = ['3b82f6', '10b981', 'f59e0b', 'ef4444', '8b5cf6', '06b6d4'];
    const colorIndex = product.id ? product.id % colors.length : index % colors.length;
    const color = colors[colorIndex];

    // Короткий текст для заглушки (макс. 20 символов)
    const text = encodeURIComponent(product.name.substring(0, 20));

    return `https://placehold.co/400x400/${color}/ffffff?text=${text}`;
};

/**
 * Генерирует массив заглушек для товаров (для демо-режима).
 */
export const generatePlaceholderProducts = (count: number): Product[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Товар #${i + 1}`,
        description: 'Описание товара для демонстрации',
        price: Math.floor(Math.random() * 50000) + 10000,
        imageUrl: null,
        categoryId: (i % 4) + 1,
    }));
};
