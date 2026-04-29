import { User } from '@/generated/prisma/client';
import React, { useEffect, useState } from 'react'
import apiRequest from '@/utils/lib/api-request/request';
import OptionalInfo from '../optional-info';

// Simple global cache to store user promises
const userCache: Record<string, Promise<User | null>> = {};

export default function UserLabel({ UserId }: { UserId: string }) {
    const [User, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!UserId || UserId === 'unknown' || UserId === 'undefined') return;

        const fetchUser = async () => {
            // Check if we already have a promise for this user in the cache
            if (!userCache[UserId]) {
                userCache[UserId] = (async () => {
                    try {
                        const response = await apiRequest.get<User>(`/users/${UserId}`);
                        if (response.success && response.data) {
                            return response.data;
                        }
                        return null;
                    } catch (error) {
                        console.error('Error fetching single User:', error);
                        // Delete from cache so it can be retried if it fails
                        delete userCache[UserId];
                        return null;
                    }
                })();
            }

            setLoading(true);
            const cachedUser = await userCache[UserId];
            setUser(cachedUser);
            setLoading(false);
        };

        fetchUser();
    }, [UserId]);

    if (UserId === 'unknown' || !UserId || UserId === 'undefined') {
        return <OptionalInfo message="No disponible" />;
    }

    if (loading && !User) return <span className="animate-pulse opacity-50">...</span>;

    return (
        <span>
            {User
                ? `${User.name} ${User.lastName}` 
                : <OptionalInfo message="No disponible" />
            }
        </span>
    )
}
