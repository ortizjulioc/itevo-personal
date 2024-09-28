import apiRequest from "@/utils/lib/api-request/request";
import { Branch } from "@prisma/client";

export interface BranchResponse {
    branches: Branch[];
    totalBranches: number;
}

export const createBranch = async (branch: Branch) => {
    return await apiRequest.post<Branch>('/branches', branch);
}

export const updateBranch = async (id: string, branch: Branch) => {
    return await apiRequest.put<Branch>(`/branches/${id}`, branch);
}

export const deleteBranch = async (id: string) => {
    return await apiRequest.remove<string>(`/branches/${id}`);
}