import { Branch } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import apiRequest from '@/utils/lib/api-request/request';



export default function BranchLabel({ branchId }: { branchId: string }) {
    const [branch, setbranch] = useState<Branch | null>(null);

    const fetchBranchById = async () => {
        try {
            const response = await apiRequest.get<Branch>(`/branches/${branchId}`);
            
            if (response.success && response.data) {
                setbranch(response.data);
            }
        } catch (error) {
            console.error('Error fetching single branch:', error);
        }
    };

    useEffect(() => {
        fetchBranchById();
    }, []);

    return (
        <span >{branch ?  branch?.name  : '...'}</span>
    )
}
