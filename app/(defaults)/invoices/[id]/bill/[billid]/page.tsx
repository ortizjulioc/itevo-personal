'use client';
import React from 'react'
import { useFetchInvoicesById } from '../../../lib/invoice/use-fetch-cash-invoices';
import { FormSkeleton } from '@/components/common';
import AddItemsInvoices from '../../../components/invoice/add-items-invoices';

export default function Bill({ params }: { params: { id: string, billid: string } }) {
    const { billid } = params;
    const { loading, invoice } = useFetchInvoicesById(billid);

    return (
        <div>
            {loading && <FormSkeleton />}
            {!loading &&
            <AddItemsInvoices
                InvoiceId={billid}
                Invoice={invoice}
            />}
        </div>
    )
}
