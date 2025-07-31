import apiRequest from '@/utils/lib/api-request/request';
import { CourseBranch, Promotion } from '@prisma/client';

export const createCourseBranch = async (courseBranch: CourseBranch) => {
    return await apiRequest.post<CourseBranch>('/course-branch', courseBranch);
};

export const updateCourseBranch = async (id: CourseBranch['id'], courseBranch: CourseBranch) => {
    return await apiRequest.put<CourseBranch>(`/course-branch/${id}`, courseBranch);
};

export const deleteCourseBranch = async (id: CourseBranch['id']) => {
    return await apiRequest.remove<string>(`/course-branch/${id}`);
};

export const assignScheduleToCourseBranch = async (courseId: CourseBranch['id'], scheduleId: string) => {
    return await apiRequest.post(`/courses/${courseId}/schedules`, { scheduleId });
};

export const unassignScheduleToCourseBranch = async (courseId: CourseBranch['id'], scheduleId: CourseBranch['id']) => {
    return await apiRequest.remove(`/courses/${courseId}/schedules/${scheduleId}`);
};

export const assignPrerequisiteToCourseBranch = async (courseId: CourseBranch['id'], prerequisiteId: CourseBranch['id']) => {
    return await apiRequest.post(`/courses/${courseId}/prerequisites`, { prerequisiteId });
};

export const unassignPrerequisiteToCourseBranch = async (courseId: CourseBranch['id'], prerequisiteId: CourseBranch['id']) => {
    return await apiRequest.remove(`/courses/${courseId}/prerequisites/${prerequisiteId}`);
};

export const loadDefaultPromotion = async () => {
    return await apiRequest.get<Promotion>(`/promotions/current`);
};
