import { useEffect, useState, useCallback } from 'react';
import { addToCart, getCart, type CartResponse, type CartItemResponse } from './cartApi';

const CART_ID_STORAGE_KEY = 'educlean_cart_id';

export function useCart() {
  const [cartId, setCartId] = useState<string>(() => {
    return localStorage.getItem(CART_ID_STORAGE_KEY) || '';
  });
  const [items, setItems] = useState<CartItemResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = useCallback(async (id: string) => {
    if (!id) return;
    try {
      setIsLoading(true);
      const cart = await getCart(id);
      setItems(cart.items);
      setTotal(cart.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi tải giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cartId) {
      refreshCart(cartId);
    }
  }, [cartId, refreshCart]);

  const add = useCallback(async (productId: number, quantity = 1) => {
    try {
      setIsLoading(true);
      const cart = await addToCart(productId, quantity, cartId);
      setCartId(cart.cartId);
      localStorage.setItem(CART_ID_STORAGE_KEY, cart.cartId);
      setItems(cart.items);
      setTotal(cart.total);
      setError(null);
      return cart;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi thêm vào giỏ hàng';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);

  const clear = useCallback(() => {
    setCartId('');
    setItems([]);
    setTotal(0);
    localStorage.removeItem(CART_ID_STORAGE_KEY);
  }, []);

  return {
    cartId,
    items,
    total,
    isLoading,
    error,
    add,
    clear,
    refreshCart: () => refreshCart(cartId),
  };
}
