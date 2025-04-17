import { Button } from '@/components/ui';

import { openNotification } from '@/utils';
import React from 'react'
import { CiCirclePlus } from "react-icons/ci";
import { createInvoice } from '../../../lib/invoice/invoice-request';
import { useRouter } from 'next/navigation';

export default function NewinvoiceCard({ cashRegisterId, userId }: { cashRegisterId?: string, userId?: string }) {


    const route = useRouter();
    const [loading, setLoading] = React.useState(false);
    const handleCreateInvoice = async () => {
        setLoading(true);
        if (!cashRegisterId || !userId) {
            console.error('Faltan datos requeridos');
            return;
        }

        const data = {
            cashRegisterId,
            createdBy: userId,
        };

        const resp = await createInvoice(data);
        const invoice = resp.data as any

        if (resp.success) {
            openNotification('success', 'Sucursal creada correctamente');
            route.push(`/invoices/${cashRegisterId}/bill/${invoice.id}`);
        } else {
            openNotification('error', resp.message);
        }

        setLoading(false);


    };



    return (
        <Button
            className="justify-items-center flex-row max-w-[20rem] w-full
         bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] 
         dark:bg-[#191e3a] dark:shadow-none p-5 "
            variant='outline'
            onClick={handleCreateInvoice}
            loading={loading}
        >

            <CiCirclePlus className='size-10' />

            <span className=''>Nueva Factura</span>
        </Button>
    )
}
