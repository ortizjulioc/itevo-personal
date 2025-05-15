'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Input, Select } from '@/components/ui';
import { NCF_TYPES } from '@/constants/ncfType.constant';
import InvoiceStatusField from '../invoice-list/invoice-status';
import DatePicker from '@/components/ui/date-picker';
import { InvoiceStatus } from '@prisma/client';


interface SelectOption {
    value: string;
    label: string;
}


export default function SearchInvoice() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const NCF_TYPES_OPTIONS = Object.values(NCF_TYPES).map((type) => ({
        value: type.code,
        label: type.label,
    }));

    const STATUS_OPTIONS = [
        { value: InvoiceStatus.DRAFT, label: 'En proceso' },
        { value: InvoiceStatus.PAID, label: 'Pagada' },
        { value: InvoiceStatus.CANCELED, label: 'Cancelada' },
    ];


    const [filters, setFilters] = useState({
        type: searchParams.get('type') || '',
        status: searchParams.get('status') || '',
        fromDate: searchParams.get('fromDate') || '',
        toDate: searchParams.get('toDate') || '',
        search: searchParams.get('search') || '',

    });


    const handleFilterChange = (key: keyof typeof filters, selected: SelectOption | null) => {
        setFilters(prev => ({ ...prev, [key]: selected?.value || '' }));
    };


    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });

        router.push(`${pathname}?${params.toString()}`);
    }, [filters, pathname, router, searchParams]);

    return (
        <div className="grid md:grid-cols-3 gap-3 mb-5">

            <DatePicker

                value={filters.fromDate ? new Date(filters.fromDate) : undefined}
                onChange={(date: Date | Date[]) => {

                    if (date instanceof Date) {

                        setFilters(prev => ({ ...prev, fromDate: date.toISOString() }));
                    } else if (Array.isArray(date) && date.length > 0) {
                        setFilters(prev => ({ ...prev, fromDate: date[0].toISOString() }));
                    } else {
                        setFilters(prev => ({ ...prev, fromDate: '' }));
                    }
                }}
                placeholder="Fecha Desde"
                isClearable

            />
            <DatePicker

                value={filters.toDate ? new Date(filters.toDate) : undefined}
                onChange={(date: Date | Date[]) => {

                    if (date instanceof Date) {

                        setFilters(prev => ({ ...prev, toDate: date.toISOString() }));
                    } else if (Array.isArray(date) && date.length > 0) {
                        setFilters(prev => ({ ...prev, toDate: date[0].toISOString() }));
                    } else {
                        setFilters(prev => ({ ...prev, toDate: '' }));
                    }
                }}
                placeholder="Fecha Hasta"
                isClearable
            />

            <Select
                options={NCF_TYPES_OPTIONS}
                value={NCF_TYPES_OPTIONS.find((ncfType) => ncfType.value === filters.type)}
                onChange={(option: { value: string, label: string } | null) => handleFilterChange('type', option)}
                isSearchable={false}
                placeholder="-Tipo Factura-"
                isClearable={true}
            />
            <Select
                options={STATUS_OPTIONS}
                value={STATUS_OPTIONS.find((status) => status.value === filters.status)}
                onChange={(option: { value: string, label: string } | null) => handleFilterChange('status', option)}
                isSearchable={false}
                placeholder="-Estado-"
                isClearable={true}
            />

            <Input
                type="text"
                placeholder="Buscar por N. DE FACTURA o NCF"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
    
            />


        </div>
    );
}
