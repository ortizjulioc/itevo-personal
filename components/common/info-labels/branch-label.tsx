import { Branch } from '@/generated/prisma/client';
import React, { useEffect, useState, useCallback } from 'react'
import apiRequest from '@/utils/lib/api-request/request';
import OptionalInfo from '../optional-info';

export default function BranchLabel({ branchId }: { branchId: string }) {
    const [branch, setbranch] = useState<Branch | null>(null);

    const fetchBranchById = useCallback(async () => {
        if (!branchId || branchId === 'unknown' || branchId === 'undefined') return;
        try {
            const response = await apiRequest.get<Branch>(`/branches/${branchId}`);
            
            if (response.success && response.data) {
                setbranch(response.data);
            }
        } catch (error) {
            console.error('Error fetching single branch:', error);
        }
    }, [branchId]);

    useEffect(() => {
        fetchBranchById();
    }, [fetchBranchById]);

    return (
        <OptionalInfo content={branch?.name} message="No disponible" />
    )
}
