'use client';
import React, { useEffect } from 'react';
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

    useEffect(() => {
        if (!loading && invoice && invoice.status !== 'DRAFT') {
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
    }, [loading, invoice, cashRegisterId, router]);

    return (
        <div>
            {loading && <FormSkeleton />}
            {!loading && invoice && invoice.status === 'DRAFT' && (
                <InvoiceProvider
                    value={{
                        invoice,
                        setInvoice
                    }}
                >
                    <AddItemsInvoices
                        InvoiceId={billid}
                        fetchInvoiceData={fetchInvoiceData}
                        cashRegisterId={cashRegisterId}
                    />
                </InvoiceProvider>
            )}
        </div>
    );
}
