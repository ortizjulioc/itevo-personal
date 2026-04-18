'use client';

import ViewTitle from "@/components/common/ViewTitle";
import { objectToQueryString } from "@/utils";
import InvoiceList from "./components/invoice-list";
import SearchInvoice from "./components/invoice-search";
import { useActiveBranch } from "@/utils/hooks/use-active-branch";
import { useMemo } from "react";

export default function BillsClient({ searchParams }: { searchParams?: { search?: string; page?: string } }) {
    const { activeBranchId } = useActiveBranch();

    const query = useMemo(() => {
        const paramsWithBranch = {
            ...searchParams,
            ...(activeBranchId && { branchId: activeBranchId }),
        };

        return objectToQueryString(paramsWithBranch || {});
    }, [searchParams, activeBranchId]);

    return (
        <div>
            <ViewTitle className='mb-6' title="Facturas" />
            <div>
                <SearchInvoice />
            </div>
            <InvoiceList query={query} />
        </div>
    );
}

