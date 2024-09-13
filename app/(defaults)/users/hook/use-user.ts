import useRequest from '@/utils/hooks/use-request';
import { AxiosRequestConfig } from 'axios';
import { useCallback } from 'react';


interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    // Add other user properties here
}

const useUser = () => {
    const { data: users, error, loading, makeRequest } = useRequest<User[]>();

    const fetchUsers = useCallback(() => {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: '/api/users',
        };
        makeRequest(config);
    }, [makeRequest]);

    const createUser = useCallback((user: Omit<User, 'id'>) => {
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: '/api/users',
            data: user,
        };
        makeRequest(config);
    }, [makeRequest]);

    const updateUser = useCallback((id: number, user: Partial<User>) => {
        const config: AxiosRequestConfig = {
            method: 'PUT',
            url: `/api/users/${id}`,
            data: user,
        };
        makeRequest(config);
    }, [makeRequest]);

    const deleteUser = useCallback((id: number) => {
        const config: AxiosRequestConfig = {
            method: 'DELETE',
            url: `/api/users/${id}`,
        };
        makeRequest(config);
    }, [makeRequest]);

    return {
        users,
        error,
        loading,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
    };
};

export default useUser;
