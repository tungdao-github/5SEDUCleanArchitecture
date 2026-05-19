import { useEffect, useState } from 'react';
import { getProduct, productToCourse, type ProductRecord } from './productsApi';
import type { Course } from '../data/mockData';

export function useCourse(id: number | null) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setCourse(null);
      return;
    }

    let isMounted = true;

    setIsLoading(true);
    getProduct(id)
      .then(product => {
        if (!isMounted) return;
        setCourse(productToCourse(product, id));
        setError(null);
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Không gọi được API khóa học');
        setCourse(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { course, isLoading, error };
}
