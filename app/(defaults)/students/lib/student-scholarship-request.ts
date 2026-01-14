import apiRequest from '@/utils/lib/api-request/request';
import { objectToQueryString } from '@/utils';

export const getStudentScholarships = async (studentId: string, params: any = {}) => {
    const queryString = objectToQueryString(params);
    return await apiRequest.get<any>(`/students/${studentId}/student-scholarship${queryString}`);
};

export const assignScholarship = async (studentId: string, payload: any) => {
    return await apiRequest.post<any>(`/students/${studentId}/student-scholarship`, payload);
};

export const removeStudentScholarship = async (studentId: string, studentScholarshipId: string) => {
    return await apiRequest.remove<any>(`/students/${studentId}/student-scholarship/${studentScholarshipId}`);
};

export const getScholarships = async (studentId: string) => {
    return await apiRequest.get<any>(`/students/${studentId}/student-scholarship`);
};
