'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { useFetchHolidayById } from "../lib/use-fetch-holidays";
import UpdateHolidayForm from "../components/holiday-form/update-form";





export default function EditHoliday({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, holiday } = useFetchHolidayById(id);
   
    return (
        <div>
            <ViewTitle className='mb-6' title="Editar Curso" showBackPage />
            

            {loading && <FormSkeleton />}
            {holiday && <UpdateHolidayForm initialValues={holiday} />}
        </div>
    )
}
