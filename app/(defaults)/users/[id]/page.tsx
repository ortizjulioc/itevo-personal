'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { UpdateUserForm } from "../components/user-forms";
import { useFetchUserById, UserWithBranchesAndRoles } from "../lib/use-fetch-users";
import { createContext } from "react";

const UserInitialValues = {
    user: {
        id: '',
        name: '',
        email: '',
        search: '',
        firstName: '',
        lastName: '',
        username: '',
        phone: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        inactive: false,
        deleted: false,
        branches: [
            {
                id: '',
                name: '',
                address: '',
                phone: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                deleted: false,
                roles: [],
            }
        ],
    },
    onChange: (user: UserWithBranchesAndRoles | null) => { },
};

interface UserContextType {
    user: UserWithBranchesAndRoles | null;
    onChange: (user: UserWithBranchesAndRoles | null) => void;
}

export const UserContext = createContext<UserContextType>(UserInitialValues);

export default function EditUser({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, user, setUser } = useFetchUserById(id);

    const onChange = (user: UserWithBranchesAndRoles | null) => {
        setUser(user);
    }

    return (
        <UserContext.Provider value={ { user, onChange }}>
            <ViewTitle className='mb-6' title="Editar usuario" showBackPage />

            {loading ? <FormSkeleton /> : <UpdateUserForm />}
        </UserContext.Provider>
    )
}
