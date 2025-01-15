
import { api } from "../api";

export interface DeviceProps {
  id: string
  deviceId: string
  availability: string
  status: string
  networkStatus: string
  createdAt: Date
  updatedAt: Date
}



export const findAllDevices = async (): Promise<DeviceProps[]> => api.get('/devices')

export const findDeviceByAvailability = async (availability: 'AVAILABLE' | 'UNAVAILABLE'): Promise<DeviceProps[]> => api.get(`/device?availability=${availability}`);

export const findDeviceLogs = async (id: string): Promise<{ title: string; info: string; createdAt: string }[]> => api.get(`/devices/${id}/logs`);

export const removeDevice = async (id: string) => api.delete(`/devices/${id}`);