import type { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import Button from "@/components/ui/button";
import Link from "next/link";
import { SearchInput } from "@/components/common";
import { objectToQueryString } from "@/utils";
import { IconPlusCircle } from "@/components/icon";
import InvoiceList from "./components/invoice-list";


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
    const query = objectToQueryString(searchParams || {});
    return (
        <div>
            <ViewTitle className='mb-6' title="Facturas" rightComponent={
                <>
                    <SearchInput placeholder="Buscar Facturas" />
                </>
            } />

            <InvoiceList query={query} />
        </div>
    );
}
