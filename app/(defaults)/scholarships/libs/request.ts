import apiRequest from "@/utils/lib/api-request/request";

// Define local interface if not available in Prisma Client yet, or export it to be used elsewhere
export interface Scholarship {
    id: string;
    name: string;
    description?: string;
    percentage: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ScholarshipResponse {
    scholarships: Scholarship[];
    totalScholarships: number;
}

export const createScholarship = async (scholarship: Scholarship) => {
    return await apiRequest.post<Scholarship>('/scholarships', scholarship);
}

export const updateScholarship = async (id: string, scholarship: Scholarship) => {
    return await apiRequest.put<Scholarship>(`/scholarships/${id}`, scholarship);
}

export const deleteScholarship = async (id: string) => {
    return await apiRequest.remove<string>(`/scholarships/${id}`);
}
