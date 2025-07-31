'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { useFetchEnrollmentById } from "../lib/use-fetch-enrollments";
import UpdateEnrollmentForm from "../components/enrollment-form/update-form";
import PrintEnrollment from "@/components/common/print/enrollment";



export default function EditEnrollment({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, enrollment } = useFetchEnrollmentById(id);

    return (
        <div>
            <ViewTitle className='mb-6' title="Editar Inscripcion" showBackPage />

            {loading && <FormSkeleton />}
            {enrollment && <UpdateEnrollmentForm initialValues={enrollment} />}
        </div>
    )
}
