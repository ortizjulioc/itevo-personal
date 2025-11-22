import React, { useMemo, useEffect } from 'react'
import NewinvoiceCard from './new-invoice-card'
import InvoiceCard from './invoice-card'
import useFetchInvoices from '../../../lib/invoice/use-fetch-cash-invoices'
import { GenericSkeleton } from '@/components/common/Skeleton'
import { useActiveBranch } from '@/utils/hooks/use-active-branch'
import { usePathname } from 'next/navigation'

export default function InvoiceList({ cashRegisterId, userId }: { cashRegisterId?: string, userId?: string }) {
    const { activeBranchId } = useActiveBranch();
    const [newCardloading, setnewCardloading] = React.useState(false);
    const pathname = usePathname();

    // Construir query completo con branchId desde el inicio
    const query = useMemo(() => {
        const queryParams = new URLSearchParams(`status=DRAFT&cashRegisterId=${cashRegisterId || ''}`);
        if (activeBranchId) {
            queryParams.set('branchId', activeBranchId);
        }
        return queryParams.toString();
    }, [activeBranchId]);

    const { invoices, loading, fetchInvoicesData } = useFetchInvoices(query);

    // Recargar la lista cada vez que cambie la URL
    useEffect(() => {
        if (query) {
            fetchInvoicesData(query);
        }
    }, [pathname, query, fetchInvoicesData]);

    // Resetear el estado de loading del botón cuando cambie la URL
    useEffect(() => {
        setnewCardloading(false);
    }, [pathname]);



    return (
        <div className="mb-5 flex items-center justify-center">
            <div className="w-full">
                <NewinvoiceCard cashRegisterId={cashRegisterId} userId={userId} loading={newCardloading} setLoading={setnewCardloading} />
                {loading ? <GenericSkeleton lines={8} withHeader={false} /> : invoices.map((invoice) => <InvoiceCard key={invoice.id} invoice={invoice} cashRegisterId={cashRegisterId} />)}
            </div>
        </div>
    );
}
