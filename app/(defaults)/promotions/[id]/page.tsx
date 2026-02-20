'use client';
import React from 'react';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { UpdatePromotionForm } from "../components/promotion-forms";
import { useFetchPromotionsById } from "../lib/use-fetch-promotions";



export default function EditRol({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { loading, promotion } = useFetchPromotionsById(id);
    return (
        <div>
            <ViewTitle className='mb-6' title="Editar promoción" showBackPage />

            {loading && <FormSkeleton />}
            {promotion && <UpdatePromotionForm initialValues={promotion} />}
        </div>
    )
}
