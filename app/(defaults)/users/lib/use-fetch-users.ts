import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { Branch as PrismaBranch, Role, User } from "@prisma/client";

export interface UserResponse {
    users: User[];
    totalUsers: number;
}

interface Branch extends PrismaBranch {
    roles: Role[];
}
export interface UserWithBranchesAndRoles extends Omit<User, 'password'> {
    branches: Branch[];
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

    return { users, totalUsers, loading, error, setUsers };
};

export const useFetchUserById = (id: string) => {
    const [user, setUser] = useState<UserWithBranchesAndRoles | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async (id: string) => {
            try {
                const response = await apiRequest.get<UserWithBranchesAndRoles>(`/users/${id}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setUser(response.data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener el usuario');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData(id);
    }, [id]);

    return { user, loading, error, setUser };
}

export default useFetchUsers;
