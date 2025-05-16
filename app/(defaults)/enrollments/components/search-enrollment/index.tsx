'use client';
import SelectTeacher from '@/components/common/selects/select-teacher';
import SelectCourse from '@/components/common/selects/select-course';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { MODALITIES } from '@/constants/modality.constant';
import { Select } from '@/components/ui';
import SelectStudent from '@/components/common/selects/select-student';
import DatePicker from '@/components/ui/date-picker';
import { set } from 'lodash';
import StatusEnrollment ,{ EnrollmentStatus } from '@/components/common/info-labels/status/status-enrollment';


interface SelectOption {
    value: string;
    label: React.ReactNode;
}

const modalities: SelectOption[] = [
    { value: MODALITIES.PRESENTIAL, label: 'Presencial' },
    { value: MODALITIES.VIRTUAL, label: 'Virtual' },
    { value: MODALITIES.HYBRID, label: 'Hibrido' },
];

const statusOptions: SelectOption[] = [
    { value: 'WAITING', label: <StatusEnrollment status={EnrollmentStatus.WAITING} /> },
    { value: 'ENROLLED', label: <StatusEnrollment status={EnrollmentStatus.ENROLLED} />  },
    { value: 'COMPLETED', label: <StatusEnrollment status={EnrollmentStatus.COMPLETED} />  },
    { value: 'ABANDONED', label: <StatusEnrollment status={EnrollmentStatus.ABANDONED} />  },
]


export default function SearchEnrollments() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();


    const [filters, setFilters] = useState({
        studentId: searchParams.get('studentId') || '',
        courseId: searchParams.get('courseBranchId') || '',
        teacherId: searchParams.get('teacherId') || '',
        status: searchParams.get('status') || '',
        enrollmentDate: searchParams.get('enrollmentDate') || '',
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
            <SelectCourse
                value={filters.courseId}
                onChange={(selected) => handleFilterChange('courseId', selected)}
            />

            <SelectTeacher
                value={filters.teacherId}
                onChange={(selected) => handleFilterChange('teacherId', selected)}
            />

            <Select

                options={statusOptions}
                value={statusOptions.find((status) => status.value === filters.status)}
                onChange={(selected: any) => handleFilterChange('status', selected)}
                placeholder="-Estado-"
                isClearable
            />

            <DatePicker

                value={filters.enrollmentDate ? new Date(filters.enrollmentDate) : undefined}
                onChange={(date: Date | Date[]) => {
                    console.log('date', date)

                    if (date instanceof Date) {
                        
                        setFilters(prev => ({ ...prev, enrollmentDate: date.toISOString() }));
                    } else if (Array.isArray(date) && date.length > 0) {
                        setFilters(prev => ({ ...prev, enrollmentDate: date[0].toISOString() }));
                    } else {
                        setFilters(prev => ({ ...prev, enrollmentDate: '' }));
                    }
                 
                    
                }}
                placeholder="Fecha de inscripcion"
                isClearable
              
            />
        </div>
    );
}
