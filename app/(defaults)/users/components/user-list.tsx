'use client';
import React, { useEffect, useState } from 'react';

interface User {
    nombres: string;
    apellidos: string;
    correo: string;
    username: string;
}

interface UserListProps {
    users?: User[];
}

const UserTable: React.FC<UserListProps> = ({ users = [] }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (users.length > 0) {
            setLoading(false); // Set loading to false when users data arrives
        } else {
            // Simulate a fetch for demonstration
            setTimeout(() => {
                setLoading(false);
            }, 1000); // Simulate loading time
        }
    }, [users]);

    return (
        <div className="mt-5 flex items-center justify-center">
            <div className="w-full max-w-5xl">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-center">
                        <thead className="sticky top-0 bg-gray-200">
                            <tr>
                                <th>#</th>
                                <th>Nombres</th>
                                <th>Apellidos</th>
                                <th>Correo</th>
                                <th>Username</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        <div className="flex justify-center">
                                            <span className="m-auto mb-10 h-5 w-5">
                                                <span className="inline-flex h-full w-full animate-ping rounded-full bg-info"></span>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-4 text-center">
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className="whitespace-nowrap">{user.nombres}</td>
                                        <td className="whitespace-nowrap">{user.apellidos}</td>
                                        <td className="whitespace-nowrap">{user.correo}</td>
                                        <td className="whitespace-nowrap">{user.username}</td>
                                        <td className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                            <button type="button" title="Edit">
                                                <svg>{/* Add your SVG here */}</svg>
                                            </button>
                                            <button type="button" title="Delete">
                                                <svg>{/* Add your SVG here */}</svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
