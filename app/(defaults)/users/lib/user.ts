import apiRequest from "@/utils/lib/api-request/request";
import { User } from "@prisma/client";

export const fetchUsers = async (query: string) => {
    const response = await apiRequest.get<User[]>(`/users?${query}`);
    return response.data;
}

export const createUser = async (user: User) => {
    return await apiRequest.post<User>('/users', user);
}
