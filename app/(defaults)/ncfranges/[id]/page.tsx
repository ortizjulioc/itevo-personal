'use client';
import React from 'react';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { useFetchNcfRangesById } from "../libs/use-fetch-nfcranges";
import UpdateNcfRangeForm from "../components/ncfrange-forms/update-form";



export default function EditNcfRange({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { loading, ncfRange } = useFetchNcfRangesById(id);
    return (
        <div>
            <ViewTitle className='mb-6' title="Editar usuario" showBackPage />

            {loading && <FormSkeleton />}
            {ncfRange && <UpdateNcfRangeForm initialValues={ncfRange} />}
        </div>
    )
}
