export function formatPrice(price: number): string {
    return `${price.toLocaleString('ru-RU')} ₽`;
}

/** Стартовая цена: «от 99 999 ₽» */
export function formatPriceFrom(price: number): string {
    return `от ${price.toLocaleString('ru-RU')} ₽`;
}

/**
 * Форматирует дату в читаемый вид.
 * Пример: "2024-03-13T10:30:00" → "13 марта 2024"
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
};

/**
 * Обрезает текст до указанной длины с многоточием.
 */
export const truncate = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
};
