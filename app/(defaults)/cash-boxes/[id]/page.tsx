'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";

import UpdateCashBoxForm from "../components/cash-box-forms/update-form";
import { useFetchCashBoxById } from "../lib/use-fetch-cash-boxes";



export default function EditCashBox({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, CashBox } = useFetchCashBoxById(id);
    return (
        <div>
            <ViewTitle className='mb-6' title="Editar Caja fisica" showBackPage />

            {loading && <FormSkeleton />}
            {CashBox && <UpdateCashBoxForm initialValues={CashBox} />}
        </div>
    )
}
