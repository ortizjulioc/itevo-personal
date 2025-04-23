import { User } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import apiRequest from '@/utils/lib/api-request/request';
import { formatPhoneNumber } from '@/utils';

export default function UserLabel({ UserId }: { UserId: string }) {
    const [User, setUser] = useState<User | null>(null);

    const fetchUserById = async () => {
        try {
            const response = await apiRequest.get<User>(`/users/${UserId}`);

            if (response.success && response.data) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Error fetching single User:', error);
        }
    };

    useEffect(() => {
        fetchUserById();
    }, []);

    return (
        <span>
            {User
                ? `${User.name} ${User.lastName}` 
                : '...'
            }
        </span>
    )
}
