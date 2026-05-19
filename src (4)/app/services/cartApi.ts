import { apiRequest } from './apiClient';

export interface CartItemResponse {
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CartResponse {
  cartId: string;
  items: CartItemResponse[];
  total: number;
}

export interface CheckoutResponse {
  orderId: string;
}

export async function addToCart(productId: number, quantity = 1, cartId?: string): Promise<CartResponse> {
  return apiRequest<CartResponse>('/cart', {
    method: 'POST',
    body: JSON.stringify({ cartId, productId, quantity }),
  });
}

export async function getCart(cartId: string): Promise<CartResponse> {
  return apiRequest<CartResponse>(`/cart/${cartId}`);
}

export async function checkout(cartId: string, email: string): Promise<CheckoutResponse> {
  return apiRequest<CheckoutResponse>(`/cart/${cartId}/checkout`, {
    method: 'POST',
    body: JSON.stringify({ cartId, email }),
  });
}
