import apiRequest from '@/utils/lib/api-request/request';
import { Student } from '@/generated/prisma/client';

export const createStudent = async (student: Student) => {
  return await apiRequest.post<Student>('/students', student);
};

export const updateStudent = async (id: string, student: Student) => {
  return await apiRequest.put<Student>(`/students/${id}`, student);
};

export const deleteStudent = async (id: string) => {
  return await apiRequest.remove<string>(`/students/${id}`);
};

export const restoreStudent = async (id: string) => {
  return await apiRequest.patch<{ message: string }>(`/students/${id}/restore`);
};