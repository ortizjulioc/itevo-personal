'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { UpdateRoleForm} from "../components/role-forms";
import { useFetchRoleById } from "../lib/use-fecth-roles";



export default function EditUser({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, role } = useFetchRoleById(id);
    return (
        <div>
            <ViewTitle className='mb-6' title="Editar usuario" showBackPage />

            {loading && <FormSkeleton />}
            {role && <UpdateRoleForm initialValues={role} />}
        </div>
    )
}
