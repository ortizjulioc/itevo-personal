'use client';
import React from 'react';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { UpdateBranchForm } from "../components/branch-forms";
import { useFetchBranchById } from "../lib/use-fecth-branches";



export default function EditBranch({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { loading, branch } = useFetchBranchById(id);
    return (
        <div>
            <ViewTitle className='mb-6' title="Editar Sucursal" showBackPage />

            {loading && <FormSkeleton />}
            {branch && <UpdateBranchForm initialValues={branch} />}
        </div>
    )
}
