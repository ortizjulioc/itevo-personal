'use client';

import { getFormattedDateTime } from "@/utils/date";
import OptionalInfo from "@/components/common/optional-info";
import { QuotationStatus } from "@/generated/prisma/client";

export default function QuotationStatusField({ status }: { status: QuotationStatus }) {
    const statusMap: Record<QuotationStatus, { label: string; color: string }> = {
        [QuotationStatus.PENDING]: { label: 'PENDIENTE', color: 'bg-yellow-100 text-yellow-800' },
        [QuotationStatus.ACCEPTED]: { label: 'ACEPTADA', color: 'bg-green-100 text-green-800' },
        [QuotationStatus.REJECTED]: { label: 'RECHAZADA', color: 'bg-red-100 text-red-800' },
        [QuotationStatus.CANCELED]: { label: 'CANCELADA', color: 'bg-gray-100 text-gray-800' },
    };

    const currentStatus = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };

    return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${currentStatus.color}`}>
            {currentStatus.label}
        </span>
    );
}
