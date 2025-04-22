'use client';
import React from 'react';
import { useFetchInvoicesById } from '../../../lib/invoice/use-fetch-cash-invoices';
import { FormSkeleton } from '@/components/common';
import AddItemsInvoices from '../../../components/invoice/add-items-invoices';

export default function Bill({ params }: { params: { id: string, billid: string } }) {
    const { billid,id } = params;
    const { loading, invoice, fetchInvoiceData, setInvoice } = useFetchInvoicesById(billid);

    return (
        <div>
            {loading && <FormSkeleton />}
            {!loading && invoice && (
                <AddItemsInvoices
                    InvoiceId={billid}
                    Invoice={invoice}
                    setInvoice={setInvoice} // ✅ Nuevo
                    fetchInvoiceData={fetchInvoiceData}
                    cashRegisterId={id} // Asegúrate de que este valor esté disponible en el objeto invoice
                />
            )}
        </div>
    );
}
