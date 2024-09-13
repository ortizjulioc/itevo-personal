'use client';
import { useEffect } from 'react';
import useUser from './hook/use-user';

export default function Users() {
    const { users, loading, fetchUsers } = useUser();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    console.log(users);
    return (
        <div>
            <div>
                <h2 className='text-xl'>Usuarios</h2>
            </div>
        </div>
    );
}
