'use client';
import React from 'react';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { useFetchTeacherById } from "../lib/use-fetch-teachers";
import UpdateTeacherForm from "../components/teacher-form/update-form";




export default function EditTeacher({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { loading, teacher } = useFetchTeacherById(id);

    return (
        <div>
            <ViewTitle className='mb-6' title="Crear Profesor" showBackPage />

            {loading && <FormSkeleton />}
            {teacher && <UpdateTeacherForm initialValues={teacher} />}
        </div>
    )
}
