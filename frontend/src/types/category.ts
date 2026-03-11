export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children?: Category[];
  image?: string;
  description?: string;
  productCount?: number;
  sortOrder?: number;
}

export interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children: CategoryTree[];
  image?: string;
  description?: string;
  productCount?: number;
  sortOrder?: number;
}
