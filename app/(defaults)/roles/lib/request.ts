import apiRequest from "@/utils/lib/api-request/request";
import { Role } from "@prisma/client";

export interface RoleResponse {
    roles: Role[];
    totalRoles: number;
}

export const createRole = async (role: Role) => {
    return await apiRequest.post<Role>('/roles', role);
}

export const updateRole = async (id: string, role: Role) => {
    return await apiRequest.put<Role>(`/roles/${id}`, role);
}

export const deleteRole = async (id: string) => {
    return await apiRequest.remove<string>(`/roles/${id}`);
}