import apiRequest from "@/utils/lib/api-request/request";
import { User } from "@prisma/client";

export const fetchUsers = async () => {
    const response = await apiRequest.get<User[]>('/users');
    return response.data;
}

export const createUser = async (user: User) => {
    return await apiRequest.post<User>('/users', user);
}
