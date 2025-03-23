import apiRequest from '@/utils/lib/api-request/request';
import { Teacher } from '@prisma/client';

export const createTeacher = async (teacher: Teacher) => {
  return await apiRequest.post<Teacher>('/teachers', teacher);
};

export const updateTeacher = async (id: string, teacher: Teacher) => {
  return await apiRequest.put<Teacher>(`/teachers/${id}`, teacher);
};

export const deleteTeacher = async (id: string) => {
  return await apiRequest.remove<string>(`/teachers/${id}`);
};