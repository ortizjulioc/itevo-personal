'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { useFetchCashRegistersById } from "../lib/use-fetch-cash-register";







export default function EditCashRegister({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, CashRegister } = useFetchCashRegistersById(id);
   
    return (
        <div>
            <ViewTitle className='mb-6' title="Facturacion" showBackPage />
            

            {loading && <FormSkeleton />}
            {/* {CashRegister && <UpdateCashRegisterForm initialValues={CashRegister} />} */}
        </div>
    )
}
