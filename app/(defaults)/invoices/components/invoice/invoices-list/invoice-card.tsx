import Tooltip from '@/components/ui/tooltip'
import { Invoice } from '@prisma/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { MdOutlineReceiptLong } from 'react-icons/md'

export default function InvoiceCard({
    invoice,
    cashRegisterId,
}: {
    invoice: Invoice
    cashRegisterId: string | undefined
}) {
    const pathname = usePathname()
    const BillId = pathname.split('/').pop()
    const isSelected = BillId === invoice.id

    return (
        <Link
            href={`/invoices/${cashRegisterId}/bill/${invoice.id}`}
            className={`mb-4 flex flex-col items-start justify-between max-w-[22rem] w-full shadow-md rounded-lg border p-4 transition duration-150
    ${isSelected
                    ? 'border border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500'
                    : 'border border-gray-200 bg-white dark:border-[#1b2e4b] dark:bg-[#191e3a]'
                }
    hover:scale-[1.01] hover:shadow-lg`}
        >
            <div className="w-full flex justify-between items-center mb-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {invoice.invoiceNumber}
                </p>
                <MdOutlineReceiptLong className="text-gray-500 dark:text-gray-300" size={18} />
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-300 mb-1 capitalize">
                {invoice.type.replace(/_/g, ' ').toLowerCase()}
            </p>

            {invoice.comment && (
                <Tooltip title={invoice.comment} >
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 italic w-full whitespace-nowrap overflow-hidden text-ellipsis">
                        {invoice.comment}
                    </p>
                </Tooltip>
            )}
            <p className={`text-xs font-medium text-yellow-500`}>
                Pendiente
            </p>
        </Link>

    )
}
