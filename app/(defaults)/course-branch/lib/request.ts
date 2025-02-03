import apiRequest from '@/utils/lib/api-request/request';
import { CourseBranch } from '@prisma/client';

export const createCourseBranch = async (courseBranch: CourseBranch) => {
  return await apiRequest.post<CourseBranch>('/course-branch', courseBranch);
};

export const updateCourseBranch = async (id: string, courseBranch: CourseBranch) => {
  return await apiRequest.put<CourseBranch>(`/course-branch/${id}`, courseBranch);
};

export const deleteCourseBranch = async (id: string) => {
  return await apiRequest.remove<string>(`/course-branch/${id}`);
};