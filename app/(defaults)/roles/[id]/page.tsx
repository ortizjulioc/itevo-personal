'use client';
import React from 'react';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { UpdateRoleForm} from "../components/role-forms";
import { useFetchRoleById } from "../lib/use-fetch-roles";



export default function EditRol({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { loading, role } = useFetchRoleById(id);
    return (
        <div>
            <ViewTitle className='mb-6' title="Editar Rol" showBackPage />

            {loading && <FormSkeleton />}
            {role && <UpdateRoleForm initialValues={role} />}
        </div>
    )
}
