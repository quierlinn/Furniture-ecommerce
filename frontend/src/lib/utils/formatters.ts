/**
 * Format price with currency
 * @param price - The price to format
 * @param currency - Currency code (default: RUB)
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = "RUB"): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format dimensions string
 * @param dimensions - Dimensions in format "width*height*depth"
 * @returns Formatted dimensions string
 */
export function formatDimensions(dimensions: string): string {
  if (!dimensions) return '';
  
  // Split dimensions by asterisk and format each part
  const parts = dimensions.split('*');
  if (parts.length !== 3) return dimensions;
  
  const [width, height, depth] = parts;
  return `${width} × ${height} × ${depth} мм`;
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
