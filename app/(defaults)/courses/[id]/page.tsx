'use client';
import React from 'react';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { useFetchCourseById } from "../lib/use-fetch-courses";
import UpdateCourseForm from "../components/course-form/update-form";




export default function EditCourse({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { loading, course } = useFetchCourseById(id);
   
    return (
        <div>
            <ViewTitle className='mb-6' title="Editar Curso" showBackPage />
            

            {loading && <FormSkeleton />}
            {course && <UpdateCourseForm initialValues={course} />}
        </div>
    )
}
