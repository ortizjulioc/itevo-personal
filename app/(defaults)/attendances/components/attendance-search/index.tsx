'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Select } from '@/components/ui';
import SelectStudent from '@/components/common/selects/select-student';
import DatePicker from '@/components/ui/date-picker';

import { AttendanceStatus } from '@prisma/client';
import StatusAttendance from '../status-attendance';
import SelectCourseBranch from '@/components/common/selects/select-course-branch';

interface SelectOption {
    value: string;
    label: React.ReactNode;
}

  const statusOptions = [
        { value: AttendanceStatus.PRESENT, label: <StatusAttendance status={AttendanceStatus.PRESENT} /> },
        { value: AttendanceStatus.ABSENT, label: <StatusAttendance status={AttendanceStatus.ABSENT} /> },
        { value: AttendanceStatus.EXCUSED, label: <StatusAttendance status={AttendanceStatus.EXCUSED} /> },
    ]




export default function SearchAttendances() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();


    const [filters, setFilters] = useState({
        studentId: searchParams.get('studentId') || '',
        courseBranchId: searchParams.get('courseBranchId') || '',
        teacherId: searchParams.get('teacherId') || '',
        status: searchParams.get('status') || '',
        date: searchParams.get('date') || '',
    });


    const handleFilterChange = (key: keyof typeof filters, selected: SelectOption | null) => {
        if(selected?.value) {
        setFilters(prev => ({ ...prev, [key]: selected?.value || '' }));
        }
        else setFilters(prev => ({ ...prev, [key]: selected || ''  }));
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

            <SelectStudent
                value={filters.studentId}
                onChange={(selected) => handleFilterChange('studentId', selected)}
            />
            <SelectCourseBranch
                value={filters.courseBranchId}
                onChange={(selected) => handleFilterChange('courseBranchId', selected)}
            />

           

            <Select

                options={statusOptions}
                value={statusOptions.find((status) => status.value === filters.status)}
                onChange={(selected: any) => handleFilterChange('status', selected)}
                placeholder="-Estado-"
                isClearable
            />

            <DatePicker

                value={filters.date ? new Date(filters.date) : undefined}
                onChange={(date: Date | Date[]) => {
                  
                    if (date instanceof Date) {
                        
                        setFilters(prev => ({ ...prev, date: date.toISOString() }));
                    } else if (Array.isArray(date) && date.length > 0) {
                        setFilters(prev => ({ ...prev, date: date[0].toISOString() }));
                    } else {
                        setFilters(prev => ({ ...prev, date: '' }));
                    }
                 
                    
                }}
                placeholder="Fecha de asistencia"
                isClearable
              
            />
        </div>
    );
}
