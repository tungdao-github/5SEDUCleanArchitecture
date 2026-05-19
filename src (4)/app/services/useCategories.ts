import { useEffect, useState } from 'react';
import { categories as mockCategories } from '../data/mockData';
import { listCategories, type CategoryRecord } from './categoriesApi';

export function useCategories() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    listCategories()
      .then(result => {
        if (!isMounted) return;
        setCategories(result);
        setError(null);
      })
      .catch(error => {
        if (!isMounted) return;
        const mockCats = mockCategories.map(cat => ({
          id: Math.random(),
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
        }));
        setCategories(mockCats);
        setError(error instanceof Error ? error.message : 'Không gọi được API danh mục');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, isLoading, error };
}
