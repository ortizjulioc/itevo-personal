'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { UpdateBranchForm } from "../components/branch-forms";
import { useFetchBranchById } from "../lib/use-fecth-branches";



export default function EditBranch({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, branch } = useFetchBranchById(id);
    return (
        <div>
            <ViewTitle className='mb-6' title="Editar Sucursal" showBackPage />

            {loading && <FormSkeleton />}
            {branch && <UpdateBranchForm initialValues={branch} />}
        </div>
    )
}
