import React, { useEffect } from 'react'
import NewinvoiceCard from './new-invoice-card'
import InvoiceCard from './invoice-card'
import useFetchInvoices from '../../../lib/invoice/use-fetch-cash-invoices'
import { usePathname } from 'next/navigation'
import { GenericSkeleton } from '@/components/common/Skeleton'
import { useActiveBranch } from '@/utils/hooks/use-active-branch'

export default function InvoiceList({ cashRegisterId, userId }: { cashRegisterId?: string, userId?: string }) {
    const { activeBranchId } = useActiveBranch();
    const { invoices, loading, fetchInvoicesData } = useFetchInvoices('status=DRAFT')
    const pathname = usePathname();
    const [newCardloading, setnewCardloading] = React.useState(false);

    useEffect(() => {
        // Construir query con branchId si está disponible
        const queryParams = new URLSearchParams('status=DRAFT');
        if (activeBranchId) {
            queryParams.set('branchId', activeBranchId);
        }
        fetchInvoicesData(queryParams.toString());
        console.log('Fetching invoices for branch:', activeBranchId);
        return () => {
            setnewCardloading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeBranchId, pathname]);



    return (
        <div className="mb-5 flex items-center justify-center">
            <div className="w-full">
                <NewinvoiceCard cashRegisterId={cashRegisterId} userId={userId} loading={newCardloading} setLoading={setnewCardloading} />
                {loading ? <GenericSkeleton lines={8} withHeader={false} /> : invoices.map((invoice) => <InvoiceCard key={invoice.id} invoice={invoice} cashRegisterId={cashRegisterId} />)}
            </div>
        </div>
    );
}
