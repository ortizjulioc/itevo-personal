'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useFetchInvoicesById } from '../../../lib/invoice/use-fetch-cash-invoices';
import { FormSkeleton } from '@/components/common';
import AddItemsInvoices from '../../../components/invoice/add-items-invoices';
import InvoiceProvider from './invoice-provider';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function Bill({ params }: { params: { id: string, billid: string } }) {
    const { billid, id: cashRegisterId } = params;
    const { loading, invoice, fetchInvoiceData, setInvoice } = useFetchInvoicesById(billid);
    const router = useRouter();
    const [alertShown, setAlertShown] = useState(false);



    // Memoizar el value de InvoiceProvider para evitar cambios de referencia
    const providerValue = useMemo(() => ({ invoice, setInvoice }), [invoice, setInvoice]);

    useEffect(() => {
        if (!loading && invoice?.status && !alertShown) {
            if (invoice.status.trim().toUpperCase() !== 'DRAFT') {
                setAlertShown(true);
                Swal.fire({
                    title: 'Factura no editable',
                    text: 'Esta factura ya ha sido emitida y no se puede modificar.',
                    icon: 'warning',
                    confirmButtonText: 'Volver',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                }).then(() => {
               
                    router.push(`/invoices/${cashRegisterId}`);
                });
            }
        }
    }, [loading, invoice, alertShown, cashRegisterId, router]);

    if (loading) {
     
        return <FormSkeleton />;
    }

    if (!invoice) {
      
        return <div className="text-gray-500 italic">No se encontró la factura.</div>;
    }

   

    if (invoice.status === 'DRAFT') {
       
        return (
            <InvoiceProvider value={providerValue}>
                <AddItemsInvoices
                    InvoiceId={billid}
                    fetchInvoiceData={fetchInvoiceData}
                    cashRegisterId={cashRegisterId}
                />
            </InvoiceProvider>
        );
    }

    
    return null;
}