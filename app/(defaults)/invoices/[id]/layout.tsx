
'use client';
import React from 'react'
import { useFetchCashRegistersById } from '../lib/cash-register/use-fetch-cash-register';
import CashRegisterDetails from '../components/cash-register/cash-register-details';
import { ViewTitle } from '@/components/common';
import InvoiceList from '../components/invoice/invoices-list';

export default function layout({ children, params }: { children: React.ReactNode, params: { id: string } }) {
    const { id } = params;
    const { loading, CashRegister } = useFetchCashRegistersById(id);
    console.log(CashRegister, 'CashRegister')

    return (
        <div>

            <>
                <ViewTitle title="Facturacion" className='mb-6' />


                {CashRegister && (<CashRegisterDetails CashRegister={CashRegister} />
 )}

                <div className='mt-6'>
                    <h2 className='text-2xl font-bold mb-3'>Facturas</h2>
                    <div className='grid grid-cols-12 gap-4'>

                        <div className='col-span-2 '>
                            <InvoiceList  
                            cashRegisterId ={id}
                            userId={CashRegister?.user.id}
                            />

                        </div>

                        <div className='col-span-10' >
                            {children}
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
}
