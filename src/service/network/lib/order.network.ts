import type { OrderProps } from "src/sections/order/types/order.type";

import { api } from "../api";

export type CreateOrderProps = {
  productOrderId: string,
  name?: string,
  description?: string,
  deviceId: string
}

export type RedirectOrderProps = {
  id: string;
  deviceId: string
}

export const findAllOrders = async (): Promise<OrderProps[]> => api.get('/orders')

export const findOrderById = async (id: string) => api.get<OrderProps>(`/orders/${id}`);

export const createOrder = async (order: CreateOrderProps) => api.post('orders', order);

export const redirectOrder = async ({ id, deviceId }: RedirectOrderProps) => api.post(`/orders/${id}/redirect`, { deviceId });

export const closeOrder = async (id: string) => api.patch(`/orders/${id}/closed`);

export const removeOrder = async (id: string) => api.delete(`/orders/${id}`);