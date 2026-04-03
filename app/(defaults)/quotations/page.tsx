import type { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import { objectToQueryString } from "@/utils";
import QuotationList from "./components/quotations-list";
import QuotationSearch from "./components/quotation-search";
import NewQuotationButton from "./components/new-quotation-button";
import { Button } from "@/components/ui";
import { HiOutlinePlus } from "react-icons/hi";

export const metadata: Metadata = {
    title: 'Cotizaciones',
};

interface Props {
    searchParams: Promise<{
        search?: string;
        page?: string;
    }>;
}

export default async function QuotationsPage({ searchParams }: Props) {
    const params = await searchParams;
    const query = objectToQueryString(params || {});

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <ViewTitle title="Cotizaciones" />
                <NewQuotationButton />
            </div>
            
            <QuotationSearch />
            
            <QuotationList query={query} />
        </div>
    );
}
