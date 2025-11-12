'use client';

import ViewTitle from "@/components/common/ViewTitle";
import { objectToQueryString } from "@/utils";
import InvoiceList from "./components/invoice-list";
import SearchInvoice from "./components/invoice-search";
import { useActiveBranch } from "@/utils/hooks/use-active-branch";

export default function BillsClient({ searchParams }: { searchParams?: { search?: string; page?: string } }) {
    const { activeBranchId } = useActiveBranch();
    
    // Incluir branchId automáticamente en los parámetros de búsqueda
    const paramsWithBranch = {
        ...searchParams,
        ...(activeBranchId && { branchId: activeBranchId }),
    };
    
    const query = objectToQueryString(paramsWithBranch || {});
    
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

