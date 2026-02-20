import React from 'react';
import Select from 'react-select';
import { EnrollmentStatus } from '@prisma/client';
import { GroupBase } from 'react-select';
import { ENROLLMENT_STATUS } from '@/constants/enrollment.status.constant';
import StatusEnrollment from '@/components/common/info-labels/status/status-enrollment';

export type SelectEnrollmentStatusType = {
    value: string;
    label: string | React.ReactElement;
};

interface SelectEnrollmentStatusProps {
    value?: string;
    onChange?: (selected: SelectEnrollmentStatusType | null) => void;
}

export default function SelectEnrollmentStatus({ value, ...rest }: SelectEnrollmentStatusProps) {

    const options = Object.values(EnrollmentStatus).map((status) => ({
        value: status,
        label: <StatusEnrollment status={status as any} />,
    }));

    return (
        <div style={{ position: 'relative', zIndex: 1 }}>
            <Select<SelectEnrollmentStatusType, false, GroupBase<SelectEnrollmentStatusType>>
                className="w-[160px]"
                options={options}
                placeholder="Estados"
                noOptionsMessage={() => 'No hay opciones'}
                value={options.find((option) => option.value === value) || null}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                styles={{
                    control: (base, state) => ({
                        ...base,
                        border: 'none',
                        boxShadow: 'none',
                        backgroundColor: 'transparent', // opcional
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                isSearchable={false}
                {...rest}
            />
        </div>

    );
}
