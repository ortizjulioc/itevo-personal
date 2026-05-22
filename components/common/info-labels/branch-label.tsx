import { Branch } from '@/generated/prisma/client';
import React, { useEffect, useState } from 'react'
import apiRequest from '@/utils/lib/api-request/request';
import OptionalInfo from '../optional-info';

// Simple global cache to store branch promises
const branchCache: Record<string, Promise<Branch | null>> = {};

export default function BranchLabel({ branchId }: { branchId: string }) {
    const [branch, setbranch] = useState<Branch | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!branchId || branchId === 'unknown' || branchId === 'undefined') return;

        const fetchBranch = async () => {
            if (!branchCache[branchId]) {
                branchCache[branchId] = (async () => {
                    try {
                        const response = await apiRequest.get<Branch>(`/branches/${branchId}`);
                        if (response.success && response.data) {
                            return response.data;
                        }
                        return null;
                    } catch (error) {
                        console.error('Error fetching single branch:', error);
                        delete branchCache[branchId];
                        return null;
                    }
                })();
            }

            setLoading(true);
            const cachedBranch = await branchCache[branchId];
            setbranch(cachedBranch);
            setLoading(false);
        };

        fetchBranch();
    }, [branchId]);

    if (loading && !branch) return <span className="animate-pulse opacity-50">...</span>;

    return (
        <OptionalInfo content={branch?.name} message="No disponible" />
    )
}
