import apiRequest from '@/utils/lib/api-request/request';
import { Course } from '@prisma/client';

export const createCourse = async (course: Course) => {
  return await apiRequest.post<Course>('/courses', course);
};

export const updateCourse = async (id: string, course: Course) => {
  return await apiRequest.put<Course>(`/courses/${id}`, course);
};

export const deleteCourse = async (id: string) => {
  return await apiRequest.remove<string>(`/courses/${id}`);
};