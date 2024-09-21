import apiRequest from "@/utils/lib/api-request/request";
import { User } from "@prisma/client";

export interface UserResponse {
    users: User[];
    totalUsers: number;
}
export const fetchUsers = async (query: string) => {
    const response = await apiRequest.get<UserResponse>(`/users?${query}`);
    return response.data;
}

export const createUser = async (user: User) => {
    return await apiRequest.post<User>('/users', user);
}

export const updateUser = async (id: string, user: User) => {
    return await apiRequest.put<User>(`/users/${id}`, user);
}

export const deleteUser = async (id: string) => {
    return await apiRequest.remove(`/users/${id}`);
}

export const fetchUserById = async (id: string) => {
    return await apiRequest.get<User>(`/users/${id}`);
}


