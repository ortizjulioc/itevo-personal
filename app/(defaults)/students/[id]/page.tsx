'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { useFetchStudentById } from "../lib/use-fetch-students";
import UpdateStudentForm from "../components/student-form/edit-form";




export default function EditStudent({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, student } = useFetchStudentById(id);
  
    return (
        <div>
            <ViewTitle className='mb-6' title="Editar Estudiante" showBackPage />
            

            {loading && <FormSkeleton />}
            {student && <UpdateStudentForm initialValues={student} />}
        </div>
    )
}
