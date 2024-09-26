import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { Role } from "@prisma/client";

export interface RoleResponse {
    roles: Role[];
    totalroles: number;
}

const useFetchRole = (query: string) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [totalroles, setTotalRoles] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchrolesData = async (query: string) => {
            try {
                const response = await apiRequest.get<RoleResponse>(`/roles?${query}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setRoles(response.data?.roles || []);
                setTotalRoles(response.data?.totalroles || 0);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener los roles');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchrolesData(query);
    }, [query]);

    return { roles, totalroles, loading, error, setRoles };
};

export const useFetchRoleById = (id: string) => {
    const [Role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoleData = async (id: string) => {
            try {
                const response = await apiRequest.get<Role>(`/roles/${id}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setRole(response.data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener el rol');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRoleData(id);
    }, [id]);

    return { Role, loading, error, setRole };
}

export default useFetchRole;
