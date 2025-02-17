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

export type SetupOrderProps = {
  id: string;
  operation: 'START' | 'STOP',
  counter?: number
}

export const findAllOrders = async (): Promise<OrderProps[]> => api.get('/orders')

export const findOrderById = async (id: string) => api.get<OrderProps>(`/orders/${id}`);

export const createOrder = async (order: CreateOrderProps) => api.post('orders', order);

export const redirectOrder = async ({ id, deviceId }: RedirectOrderProps) => api.post(`/orders/${id}/redirect`, { deviceId });

export const closeOrder = async (id: string) => api.patch(`/orders/${id}/closed`);

export const setupOrder = async ({id, operation, counter}: SetupOrderProps) => api.post(`/orders/${id}/setup/${operation}`, { counter });

export const openOrder = async (id: string) => api.post(`/orders/${id}/open`);

export const removeOrder = async (id: string) => api.delete(`/orders/${id}`);