import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { Branch } from "@prisma/client";

export interface BranchResponse {
    branches: Branch[];
    totalBranches: number;
}

const useFetchBranch = (query: string) => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [totalBranches, setTotalBranches] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBranchsData = async (query: string) => {
            try {
                const response = await apiRequest.get<BranchResponse>(`/branches?${query}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setBranches(response.data?.branches || []);
                setTotalBranches(response.data?.totalBranches || 0);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener los Branchs');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBranchsData(query);
    }, [query]);

    return { branches, totalBranches, loading, error, setBranches };
};

export const useFetchBranchById = (id: string) => {
    const [branch, setBranch] = useState<Branch | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBranchData = async (id: string) => {
            try {
                const response = await apiRequest.get<Branch>(`/branches/${id}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setBranch(response.data);
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

        fetchBranchData(id);
    }, [id]);

    return { branch, loading, error, setBranch };
}

export default useFetchBranch;
