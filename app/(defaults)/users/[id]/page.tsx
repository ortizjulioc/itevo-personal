'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { UpdateUserForm } from "../components/user-forms";
import { useFetchUserById } from "../lib/use-fetch-users";


export default function EditUser({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, user } = useFetchUserById(id);
    return (
        <div>
            <ViewTitle className='mb-6' title="Editar usuario" showBackPage />

            {loading && <FormSkeleton />}
            {user && <UpdateUserForm initialValues={user} />}
        </div>
    )
}
