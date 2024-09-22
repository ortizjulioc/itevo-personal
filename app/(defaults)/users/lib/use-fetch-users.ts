import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { User } from "@prisma/client";

export interface UserResponse {
    users: User[];
    totalUsers: number;
}

const useFetchUsers = (query: string) => {
    const [users, setUsers] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsersData = async (query: string) => {
            try {
                const response = await apiRequest.get<UserResponse>(`/users?${query}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setUsers(response.data?.users || []);
                setTotalUsers(response.data?.totalUsers || 0);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener los usuarios');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsersData(query);
    }, [query]);

    return { users, totalUsers, loading, error };
};

export default useFetchUsers;
