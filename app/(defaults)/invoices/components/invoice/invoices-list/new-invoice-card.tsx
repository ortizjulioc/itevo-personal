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
            className="mb-4 flex flex-col items-center justify-between max-w-[22rem] w-full bg-white shadow-md rounded-lg border border-gray-200 dark:border-[#1b2e4b] dark:bg-[#191e3a] p-4 transition hover:scale-[1.01] hover:shadow-lg duration-150"
            variant='outline'
            onClick={handleCreateInvoice}
            loading={loading}
        >

            <CiCirclePlus className='size-10' />

            <span className=''>Nueva Factura</span>
        </Button>
    )
}
