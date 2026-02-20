'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Input, Select } from '@/components/ui';
import { NCF_TYPES } from '@/constants/ncfType.constant';
import DatePicker, { extractDate } from '@/components/ui/date-picker';
import { InvoiceStatus } from '@prisma/client';
import SelectStudent from '@/components/common/selects/select-student';
import { useSession } from 'next-auth/react';
import { SUPER_ADMIN, GENERAL_ADMIN, BILLING_ADMIN } from '@/constants/role.constant';


interface SelectOption {
    value: string;
    label: string;
}


export default function SearchInvoice() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();

    const userRoles = session?.user?.roles || [];
    const hasFullAccess = userRoles.some((role: any) =>
        [SUPER_ADMIN, GENERAL_ADMIN, BILLING_ADMIN].includes(role.normalizedName)
    );

    const NCF_TYPES_OPTIONS = Object.values(NCF_TYPES).map((type) => ({
        value: type.code,
        label: type.label,
    }));

    const STATUS_OPTIONS = [
        { value: InvoiceStatus.DRAFT, label: 'En proceso' },
        { value: InvoiceStatus.PAID, label: 'Pagada' },
        { value: InvoiceStatus.CANCELED, label: 'Cancelada' },
        { value: InvoiceStatus.COMPLETED, label: 'Completada' },
    ];


    const [filters, setFilters] = useState({
        type: searchParams.get('type') || '',
        status: searchParams.get('status') || '',
        fromDate: searchParams.get('fromDate') || '',
        toDate: searchParams.get('toDate') || '',
        search: searchParams.get('search') || '',
        studentId: searchParams.get('studentId') || '',
    });


    const handleFilterChange = (key: keyof typeof filters, selected: SelectOption | null) => {
        setFilters(prev => ({ ...prev, [key]: selected?.value || '' }));
    };


    useEffect(() => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });

        router.push(`${pathname}?${params.toString()}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    return (
        <div className="grid md:grid-cols-3 gap-3 mb-5">

            {hasFullAccess && (
                <>
                    <DatePicker

                        value={filters.fromDate ? new Date(filters.fromDate) : undefined}
                        onChange={(date) => setFilters(prev => ({ ...prev, fromDate: extractDate(date) }))}
                        placeholder="Fecha Desde"
                        isClearable

                    />
                    <DatePicker

                        value={filters.toDate ? new Date(filters.toDate) : undefined}
                        onChange={(date) => setFilters(prev => ({ ...prev, toDate: extractDate(date) }))}
                        placeholder="Fecha Hasta"
                        isClearable
                    />

                    <Select
                        options={NCF_TYPES_OPTIONS}
                        value={NCF_TYPES_OPTIONS.find((ncfType) => ncfType.value === filters.type)}
                        onChange={(option) => handleFilterChange('type', option as SelectOption | null)}
                        isSearchable={false}
                        placeholder="-Tipo Factura-"
                        isClearable={true}
                    />
                    <Select
                        options={STATUS_OPTIONS}
                        value={STATUS_OPTIONS.find((status) => status.value === filters.status)}
                        onChange={(option) => handleFilterChange('status', option as SelectOption | null)}
                        isSearchable={false}
                        placeholder="-Estado-"
                        isClearable={true}
                    />
                </>
            )}


            <Input
                type="text"
                placeholder="Buscar por N. DE FACTURA o NCF"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}

            />

            <SelectStudent
                value={filters.studentId}
                onChange={(selected) => setFilters(prev => ({ ...prev, studentId: selected ? selected.value : '' }))}
            />

        </div>
    );
}
