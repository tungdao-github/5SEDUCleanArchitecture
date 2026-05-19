import { useEffect, useState } from 'react';

import { courses as mockCourses, type Course } from '../data/mockData';
import { listProducts, productToCourse } from './productsApi';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    listProducts(1, 100)
      .then(result => {
        if (!isMounted) return;
        setCourses(result.items.map(productToCourse));
        setError(null);
      })
      .catch(error => {
        if (!isMounted) return;
        setCourses(mockCourses);
        setError(error instanceof Error ? error.message : 'Không gọi được API khóa học');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { courses, isLoading, error };
}
