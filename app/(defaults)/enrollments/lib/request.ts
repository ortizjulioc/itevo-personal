import apiRequest from '@/utils/lib/api-request/request';
import { Enrollment } from '@prisma/client';

export const createEnrollment = async (enrollment: Enrollment) => {
  return await apiRequest.post<Enrollment>('/enrollments', enrollment);
};

export const updateEnrollment = async (id: string, enrollment: Enrollment) => {
  return await apiRequest.put<Enrollment>(`/enrollments/${id}`, enrollment);
};

export const deleteEnrollment = async (id: string) => {
  return await apiRequest.remove<string>(`/enrollments/${id}`);
};