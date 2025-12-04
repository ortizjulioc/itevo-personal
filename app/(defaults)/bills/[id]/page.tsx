'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { useFetchInvoiceById } from "../lib/use-fetch-invoices";
import InvoiceDetails from "../components/invoice-details";
import { useSession } from "next-auth/react";



export default function EditProduct({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, invoice } = useFetchInvoiceById(id);
    const { data: session } = useSession();

    return (
        <div>
            <ViewTitle className='mb-6' title="Detalles de Factura" showBackPage />

            {loading && <FormSkeleton />}
            {invoice && <InvoiceDetails invoice={invoice} currentUser={session?.user} />}
        </div>
    )
}
