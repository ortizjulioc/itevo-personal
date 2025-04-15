'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { useFetchCashRegistersById } from "../lib/use-fetch-cash-register";
import CashRegisterDetails from "../components/cash-register/cash-register-details";







export default function EditCashRegister({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, CashRegister } = useFetchCashRegistersById(id);
   
    return (
        <div>
            <ViewTitle className='mb-6' title="Facturacion" showBackPage />
            

            {loading && <FormSkeleton />}
            
            {CashRegister && (
                <>
                <CashRegisterDetails CashRegister={CashRegister} />
                </>
            ) }
        </div>
    )
}
