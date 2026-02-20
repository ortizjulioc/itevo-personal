'use client';
import React from 'react';

import { FormSkeleton, ViewTitle } from "@/components/common";
import { useFetchCashRegistersById } from "../../invoices/lib/cash-register/use-fetch-cash-register";
import CashRegisterDetails from "../components/cash-register-details";
import { useSession } from "next-auth/react";

export default function EditCashRegister({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { loading, CashRegister } = useFetchCashRegistersById(id);
    const { data: session } = useSession();

    return (
        <div>
            <ViewTitle className='mb-6' title="Detalle de Caja" showBackPage />


            {loading && <FormSkeleton />}
            {CashRegister && <CashRegisterDetails cashRegister={CashRegister} currentUser={session?.user} />}
        </div>
    )
}
