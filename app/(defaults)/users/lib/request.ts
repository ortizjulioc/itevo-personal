import apiRequest from '@/utils/lib/api-request/request';
import { User } from '@prisma/client';

export interface UserResponse {
    users: User[];
    totalUsers: number;
}
export interface AssingRole {
    userId: string;
    branchId: string;
    roleId: string;
}

export const createUser = async (user: User) => {
    return await apiRequest.post<User>('/users', user);
};

export const updateUser = async (id: string, user: User) => {
    return await apiRequest.put<User>(`/users/${id}`, user);
};

export const deleteUser = async (id: string) => {
    return await apiRequest.remove<string>(`/users/${id}`);
};

export const AssingRole = async (data: AssingRole) => {
    return await apiRequest.post<AssingRole>(`/authorization/assign-role`, data);
};

export const RemoveRole = async (data: AssingRole) => {
    return await apiRequest.remove<AssingRole>(`/authorization/remove-role`, { data });
}
