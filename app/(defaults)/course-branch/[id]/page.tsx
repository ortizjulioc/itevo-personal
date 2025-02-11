'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { useFetchCourseBranchById } from "../lib/use-fetch-course-branch";
import UpdateCourseBranchForm from "../components/course-branch-form/update-form";





export default function EditCourseBranch({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, courseBranch } = useFetchCourseBranchById(id);

    return (
        <div>
            <ViewTitle className='mb-6' title="Editar Curso" showBackPage />
            

            {loading && <FormSkeleton />}
            {courseBranch && <UpdateCourseBranchForm initialValues={courseBranch} />}
        </div>
    )
}
