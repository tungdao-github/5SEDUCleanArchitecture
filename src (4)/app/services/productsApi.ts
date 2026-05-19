import { apiRequest } from './apiClient';
import type { Course } from '../data/mockData';

export interface PagedResult<T> {
  items: T[];
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

export interface ProductRecord {
  id: number;
  name: string;
  slug: string;
  instructor: string;
  category: string;
  categorySlug: string;
  unitPrice: number;
  originalPrice: number;
  rating: number;
  ratingCount: number;
  students: number;
  duration: string;
  lessons: number;
  level: string;
  language: string;
  thumbnail: string;
  description: string;
  isBestseller: boolean;
  isNew: boolean;
  isFlashSale: boolean;
}

export async function listProducts(page = 1, perPage = 50): Promise<PagedResult<ProductRecord>> {
  return apiRequest<PagedResult<ProductRecord>>(`/Products?page=${page}&per_page=${perPage}`);
}

export async function getProduct(id: number): Promise<ProductRecord> {
  return apiRequest<ProductRecord>(`/Products/${id}`);
}

export function productToCourse(product: ProductRecord, index: number): Course {
  const discount = product.originalPrice > product.unitPrice
    ? Math.round(100 - (product.unitPrice / product.originalPrice) * 100)
    : 0;

  return {
    id: product.id,
    title: product.name,
    slug: product.slug || `product-${product.id}`,
    instructor: product.instructor,
    instructorAvatar: `https://i.pravatar.cc/150?img=${(index % 60) + 1}`,
    category: product.category,
    categorySlug: product.categorySlug,
    price: product.unitPrice,
    originalPrice: product.originalPrice || product.unitPrice,
    discount,
    rating: product.rating,
    ratingCount: product.ratingCount,
    students: product.students,
    duration: product.duration,
    lessons: product.lessons,
    level: product.level,
    language: product.language,
    thumbnail: product.thumbnail,
    tags: [product.category, product.level].filter(Boolean),
    description: product.description,
    bestseller: product.isBestseller,
    isNew: product.isNew,
    isFlashSale: product.isFlashSale,
  };
}
