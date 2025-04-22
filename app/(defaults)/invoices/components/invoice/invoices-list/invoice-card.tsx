import { Invoice } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import { MdOutlineReceiptLong } from 'react-icons/md'

export default function InvoiceCard({
    invoice,
    cashRegisterId,
}: {
    invoice: Invoice
    cashRegisterId: string | undefined
}) {
    return (
        <Link
            href={`/invoices/${cashRegisterId}/bill/${invoice.id}`}
            className="mb-4 flex flex-col items-start justify-between max-w-[22rem] w-full bg-white shadow-md rounded-lg border border-gray-200 dark:border-[#1b2e4b] dark:bg-[#191e3a] p-4 transition hover:scale-[1.01] hover:shadow-lg duration-150"
        >
            <div className="w-full flex justify-between items-center mb-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {invoice.invoiceNumber}
                </p>
                <MdOutlineReceiptLong className="text-gray-500 dark:text-gray-300" size={18} />
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">
                {invoice.type.replace(/_/g, ' ').toLowerCase()}
            </p>

            <p className={`text-xs font-medium ${invoice.status === 'DRAFT' ? 'text-yellow-500' : 'text-green-600'}`}>
                {invoice.status}
            </p>
        </Link>
    )
}
