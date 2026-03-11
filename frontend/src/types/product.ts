export interface Product {
  id: string;
  name: string;
  article?: string;
  dimensions: string;
  price: number;
  oldPrice?: number;
  currency: "RUB";
  inStock: boolean;
  badges?: Array<"new" | "hit" | "sale">;
  image: {
    src: string;
    alt: string;
    hoverSrc?: string;
  };
  description?: string;
  category?: string;
  brand?: string;
  rating?: number;
  reviewsCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children?: Category[];
  image?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  attributes?: Record<string, string>;
}

export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  colors: string[];
  materials: string[];
  inStock: boolean;
  sortBy: 'price-asc' | 'price-desc' | 'popularity' | 'newest';
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  page?: number;
  size?: number;
}
