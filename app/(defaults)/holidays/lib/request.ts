import apiRequest from '@/utils/lib/api-request/request';
import { Holiday } from '@prisma/client';

export const createHoliday = async (holiday: Holiday) => {
  return await apiRequest.post<Holiday>('/holidays', holiday);
};

export const updateHoliday = async (id: string, holiday: Holiday) => {
  return await apiRequest.put<Holiday>(`/holidays/${id}`, holiday);
};

export const deleteHoliday = async (id: string) => {
  return await apiRequest.remove<string>(`/holidays/${id}`);
};