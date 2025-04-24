import { InvoiceStatus } from '@prisma/client'
import React from 'react'
import { TbPointFilled } from 'react-icons/tb'

const InvoiceColor = {
    DRAFT: 'yellow-600',
    PAID: 'green-600',
    CANCELED: 'red-600',
}

const InvoiceLabel = {
    DRAFT: 'En proceso',
    PAID: 'Pagado',
    CANCELED: 'Cancelado',
}

export default function InvoiceStatusField({ status }: { status: InvoiceStatus }) {
    return (
        <span
            className={` inline-flex items-center gap-1 font-bold min-w-max italic text-${InvoiceColor[status]}`}
        >
             <TbPointFilled className="relative top-[1px] text-sm" />
            {InvoiceLabel[status]}
        </span>
    )
}
