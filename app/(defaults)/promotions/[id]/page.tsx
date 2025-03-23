'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { UpdatePromotionForm } from "../components/promotion-forms";
import { useFetchPromotionsById } from "../lib/use-fetch-promotions";



export default function EditRol({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, promotion } = useFetchPromotionsById(id);
    return (
        <div>
            <ViewTitle className='mb-6' title="Editar usuario" showBackPage />

            {loading && <FormSkeleton />}
            {promotion && <UpdatePromotionForm initialValues={promotion} />}
        </div>
    )
}
