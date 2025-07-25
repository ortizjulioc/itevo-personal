import React, { useEffect } from 'react'
import NewinvoiceCard from './new-invoice-card'
import InvoiceCard from './invoice-card'
import useFetchInvoices from '../../../lib/invoice/use-fetch-cash-invoices'
import { usePathname } from 'next/navigation'
import { GenericSkeleton } from '@/components/common/Skeleton'

export default function InvoiceList({ cashRegisterId, userId }: { cashRegisterId?: string, userId?: string }) {
    const { invoices, loading, fetchInvoicesData } = useFetchInvoices('status=DRAFT')
    const pathname = usePathname();
    const [newCardloading, setnewCardloading] = React.useState(false);
    useEffect(() => {

        fetchInvoicesData('status=DRAFT');
        return () => {
            setnewCardloading(false);
        }
    }, [pathname]);



    return (
        <div className="mb-5 flex items-center justify-center">
            <div className="w-full max-w-[22rem] ">
                <NewinvoiceCard cashRegisterId={cashRegisterId} userId={userId} loading={newCardloading} setLoading={setnewCardloading} />
                {loading ? <GenericSkeleton lines={8} withHeader={false} /> : invoices.map((invoice) => <InvoiceCard key={invoice.id} invoice={invoice} cashRegisterId={cashRegisterId} />)}
            </div>
        </div>
    );
}
