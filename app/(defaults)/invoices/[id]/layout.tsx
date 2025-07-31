'use client';
import React, { useEffect } from 'react'
import { useFetchCashRegistersById } from '../lib/cash-register/use-fetch-cash-register';
import CashRegisterDetails from '../components/cash-register/cash-register-details';
import { ViewTitle } from '@/components/common';
import InvoiceList from '../components/invoice/invoices-list';
import TableSkeleton, { GenericSkeleton } from '@/components/common/Skeleton';

export default function layout({ children, params }: { children: React.ReactNode, params: { id: string, billid: string | null } }) {
    const { id, billid } = params;
    const { loading, CashRegister } = useFetchCashRegistersById(id);
    


    return (
        <div className="px-2 md:px-6">
            <>
                <ViewTitle title="Facturación" className="mb-6" />

                {loading && <GenericSkeleton className="mb-6" lines={2} withHeader={false} />}

                {CashRegister && <CashRegisterDetails CashRegister={CashRegister} />}

                <div className="mt-6">
                    <h2 className="mb-3 text-2xl font-bold">Facturas</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                        <div className="md:col-span-2">
                            <InvoiceList cashRegisterId={id} userId={CashRegister?.user.id} />
                        </div>

                        <div className="md:col-span-10">{children}</div>
                    </div>
                </div>
            </>
        </div>
    );
}
