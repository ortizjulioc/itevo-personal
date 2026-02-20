'use client';
import React from 'react';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { useFetchCourseBranchById } from "../lib/use-fetch-course-branch";
import UpdateCourseBranchForm from "../components/course-branch-form/update-form";

export default function EditCourseBranch({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { loading, courseBranch } = useFetchCourseBranchById(id);

    return (
        <div>
            <ViewTitle className='mb-6' title="Editar Oferta Academica" showBackPage />

            {loading && <FormSkeleton />}
            {courseBranch && <UpdateCourseBranchForm initialValues={courseBranch} />}
        </div>
    )
}
