import { User } from '@/generated/prisma/client';
import React, { useEffect, useState } from 'react'
import apiRequest from '@/utils/lib/api-request/request';
import OptionalInfo from '../optional-info';

export default function UserLabel({ UserId }: { UserId: string }) {
    const [User, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchUserById = async () => {
        if (!UserId || UserId === 'unknown') return;
        
        setLoading(true);
        try {
            const response = await apiRequest.get<User>(`/users/${UserId}`);

            if (response.success && response.data) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Error fetching single User:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserById();
    }, [UserId]);

    if (UserId === 'unknown' || !UserId) {
        return <OptionalInfo message="No disponible" />;
    }

    if (loading) return <span>...</span>;

    return (
        <span>
            {User
                ? `${User.name} ${User.lastName}` 
                : <OptionalInfo message="No disponible" />
            }
        </span>
    )
}
