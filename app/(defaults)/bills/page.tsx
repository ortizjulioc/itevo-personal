import type { Metadata } from "next";
import BillsClient from "./bills-client";

export const metadata: Metadata = {
    title: 'Facturas',
};

interface InvoiceProps {
    searchParams: Promise<{
        search?: string;
        page?: string;
    }>;
}

export default async function Invoice({ searchParams }: InvoiceProps) {
    const params = await searchParams;
    return <BillsClient searchParams={params} />;
}
