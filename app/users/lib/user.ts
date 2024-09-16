import apiRequest from "@/utils/lib/api-request/request";
import { Users } from "@prisma/client";

export const fetchUsers = async () => {
    const response = await apiRequest.get<Users[]>('/users');
    return response.data;
}
