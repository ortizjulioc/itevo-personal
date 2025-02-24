'use client';
import SelectBranch from '@/components/common/selects/select-branch';
import SelectTeacher from '@/components/common/selects/select-teacher';
import SelectCourse from '@/components/common/selects/select-course';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { MODALITIES } from '@/constants/modality.constant';
import { Select } from '@/components/ui';


interface SelectOption {
    value: string;
    label: string;
}

const modalities: SelectOption[] = [
    { value: MODALITIES.PRESENTIAL, label: 'Presencial' },
    { value: MODALITIES.VIRTUAL, label: 'Virtual' },
    { value: MODALITIES.HYBRID, label: 'Hibrido' },
];


export default function SearchCourseBranch() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

  
    const [filters, setFilters] = useState({
        teacherId: searchParams.get('teacherId') || '',
        courseId: searchParams.get('courseId') || '',
        modality: searchParams.get('modality') || '',
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

            <SelectTeacher
                value={filters.teacherId}
                onChange={(selected) => handleFilterChange('teacherId', selected)}
            />
            <SelectCourse
                value={filters.courseId}
                onChange={(selected) => handleFilterChange('courseId', selected)}
            />
            <Select

                options={modalities}
                value={modalities.find((modality) => modality.value === filters.modality)}
                onChange={(selected :any) => handleFilterChange('modality', selected)}
                placeholder="-Modalidades-"
                isClearable
            />
        </div>
    );
}
