'use client';
import React from 'react';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { useFetchHolidayById } from "../lib/use-fetch-holidays";
import UpdateHolidayForm from "../components/holiday-form/update-form";





export default function EditHoliday({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { loading, holiday } = useFetchHolidayById(id);

    return (
        <div>
            <ViewTitle className='mb-6' title="Editar dia feriado" showBackPage />


            {loading && <FormSkeleton />}
            {holiday && <UpdateHolidayForm initialValues={holiday} />}
        </div>
    )
}
