'use client';
import React, { useEffect } from 'react'

import { ViewTitle } from '@/components/common';
import TableSkeleton, { GenericSkeleton } from '@/components/common/Skeleton';
import { useFetchCashRegistersById } from '../../../invoices/lib/cash-register/use-fetch-cash-register';
import CashRegisterDetails from '../../../invoices/components/cash-register/cash-register-details';

export default function Layout({ children, params }: { children: React.ReactNode, params: { id: string, billid: string | null } }) {
    const { id, } = params;
    const { loading, CashRegister } = useFetchCashRegistersById(id);



    return (
        <div className="px-2 md:px-6">
            <>
                <ViewTitle title="Cierre de Caja" className="mb-6" showBackPage={true} />

                {loading && <GenericSkeleton className="mb-6" lines={2} withHeader={false} />}

                {CashRegister && (
                    <CashRegisterDetails
                        CashRegister={{
                            ...CashRegister,
                            openingDate: CashRegister.openingDate.toISOString(),
                            createdAt: CashRegister.createdAt.toISOString(),
                            updatedAt: CashRegister.updatedAt.toISOString(),
                        }}
                    />
                )}

                <div className="mt-6">
                    <div className="overflow-x-auto ">{children}</div>
                </div>
            </>
        </div>
    );
}
