/**
 * Форматирует число в строку с валютой (рубли).
 * Пример: 65451 → "65 451 руб."
 */
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
    }).format(price).replace('₽', 'руб.');
};

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
