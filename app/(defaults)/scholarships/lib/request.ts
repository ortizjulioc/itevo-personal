import apiRequest from '@/utils/lib/api-request/request';
import { Scholarship } from '@prisma/client';

export const createScholarship = async (scholarship: Scholarship) => {
    return await apiRequest.post<Scholarship>('/scholarschips', scholarship);
};

export const updateScholarship = async (id: string, scholarship: Scholarship) => {
    return await apiRequest.put<Scholarship>(`/scholarschips/${id}`, scholarship);
};

export const deleteScholarship = async (id: string) => {
    return await apiRequest.remove<string>(`/scholarschips/${id}`);
};
