'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { useFetchTeacherById } from "../lib/use-fetch-teachers";
import UpdateTeacherForm from "../components/teacher-form/update-form";




export default function EditTeacher({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, teacher } = useFetchTeacherById(id);
    console.log(teacher);
    return (
        <div>
            <ViewTitle className='mb-6' title="Editar Sucursal" showBackPage />

            {loading && <FormSkeleton />}
            {teacher && <UpdateTeacherForm initialValues={teacher} />}
        </div>
    )
}
