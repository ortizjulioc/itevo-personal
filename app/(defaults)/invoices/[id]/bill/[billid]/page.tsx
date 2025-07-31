'use client';
import React from 'react';
import { useFetchInvoicesById } from '../../../lib/invoice/use-fetch-cash-invoices';
import { FormSkeleton } from '@/components/common';
import AddItemsInvoices from '../../../components/invoice/add-items-invoices';
import InvoiceProvider from './invoice-provider';

export default function Bill({ params }: { params: { id: string, billid: string } }) {
    const { billid, id } = params;
    const { loading, invoice, fetchInvoiceData, setInvoice } = useFetchInvoicesById(billid);

    return (
        <div>
            {loading && <FormSkeleton />}
            {!loading && invoice && (

                <InvoiceProvider
                    value={{
                        invoice,
                        setInvoice
                    }
                    }>
                    <AddItemsInvoices
                        InvoiceId={billid}
                        fetchInvoiceData={fetchInvoiceData}
                        cashRegisterId={id}
                    />
                </InvoiceProvider>
            )}
        </div>
    );
}
