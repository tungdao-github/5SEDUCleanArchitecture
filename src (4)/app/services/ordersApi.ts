import { apiRequest } from './apiClient';

export interface OrderItemRecord {
  productId: number;
  title: string;
  price: number;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItemRecord[];
  paymentMethod: string;
}

export async function listOrders(email: string): Promise<OrderRecord[]> {
  return apiRequest<OrderRecord[]>(`/Orders?email=${encodeURIComponent(email)}`);
}
