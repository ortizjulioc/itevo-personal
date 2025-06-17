import React, { useEffect } from 'react'
import NewinvoiceCard from './new-invoice-card'
import InvoiceCard from './invoice-card'
import useFetchInvoices from '../../../lib/invoice/use-fetch-cash-invoices'
import { usePathname } from 'next/navigation'

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
            <div className="max-w-[22rem] w-full ">

                <NewinvoiceCard
                    cashRegisterId={cashRegisterId}
                    userId={userId}
                    loading={newCardloading}
                    setLoading={setnewCardloading}
                />
                {loading ? (
                    <p className="text-center mt-4">Cargando facturas...</p>
                ) : (
                    invoices.map((invoice) => (
                        <InvoiceCard
                            key={invoice.id}
                            invoice={invoice}
                            cashRegisterId={cashRegisterId}
                        />
                    ))
                )}

            </div>
        </div>
    )
}
