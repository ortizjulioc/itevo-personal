import apiRequest from "@/utils/lib/api-request/request";

interface User {
    id: number;
    username: string;
    emai: string;
}

export const fetchUsers = async () => {
    const response = await apiRequest.get<User[]>('/users');
    console.log(response);
    return response.data;
}
