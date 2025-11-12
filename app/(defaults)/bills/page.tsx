import type { Metadata } from "next";
import BillsClient from "./bills-client";

export const metadata: Metadata = {
    title: 'Facturas',
};

interface InvoiceProps {
    searchParams?: {
        search?: string;
        page?: string;
    };
}

export default function Invoice({ searchParams }: InvoiceProps) {
    return <BillsClient searchParams={searchParams} />;
}
