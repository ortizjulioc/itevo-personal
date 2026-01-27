import React from 'react'
import { TbPointFilled } from 'react-icons/tb'

export enum StatusActive {
    ACTIVE = 'true',
    INACTIVE = 'false',
}

const StatusActiveColor = {
    true: 'green-600',
    false: 'red-600',
}

const StatusActiveLabel = {
    true: 'Activo',
    false: 'Inactivo',
}

export default function StatusPayment({ status }: { status: boolean }) {

    const statusKey = status ? 'true' : 'false'

    return (
        <span
            className={` inline-flex items-center gap-1 font-bold min-w-max text-${StatusActiveColor[statusKey]}`}
        >
            <TbPointFilled className="relative top-[1px] text-sm" />
            {StatusActiveLabel[statusKey]}
        </span>
    )
}
