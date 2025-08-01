import { PaymentStatus } from '@prisma/client'
import React from 'react'
import { TbPointFilled } from 'react-icons/tb'

const PaymentStatusColor = {
    PENDING: 'orange-600',
    PAID: 'green-600',
    CANCELED: 'red-600',
}

const PaymentStatusLabel = {
    PENDING: 'En espera',
    PAID: 'Pagado',
    CANCELED: 'Cancelado',
}

export default function StatusPayment({ status }: { status: PaymentStatus }) {
    return (
        <span
            className={` inline-flex items-center gap-1 font-bold min-w-max text-${PaymentStatusColor[status]}`}
        >
             <TbPointFilled className="relative top-[1px] text-sm" />
            {PaymentStatusLabel[status]}
        </span>
    )
}
