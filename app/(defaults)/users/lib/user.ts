import apiRequest from "@/utils/lib/api-request/request";
import { User } from "@prisma/client";

// Interface for the user object { user: User, totalUsers: number }
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
