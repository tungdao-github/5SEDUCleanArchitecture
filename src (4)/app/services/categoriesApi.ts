import { apiRequest } from './apiClient';

export interface CategoryRecord {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export async function listCategories(): Promise<CategoryRecord[]> {
  const response = await apiRequest<{ items: CategoryRecord[] }>('/Categories');
  return response.items;
}

