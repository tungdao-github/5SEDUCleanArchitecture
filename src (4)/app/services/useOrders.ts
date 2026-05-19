import { useEffect, useState, useCallback } from 'react';
import { listOrders, type OrderRecord } from './ordersApi';

export function useOrders(email: string | null) {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      setOrders([]);
      return;
    }

    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const result = await listOrders(email);
        if (isMounted) {
          setOrders(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Lỗi tải đơn hàng');
          setOrders([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [email]);

  return { orders, isLoading, error };
}
