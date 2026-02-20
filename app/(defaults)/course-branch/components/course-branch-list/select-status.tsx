import React from 'react';
import Select from 'react-select';
import { CourseBranchStatus } from '@prisma/client';
import { GroupBase } from 'react-select';
import StatusCourseBranch from '@/components/common/info-labels/status/status-course-branch';

export type SelectCourseBranchStatusType = {
    value: string;
    label: string | React.ReactElement;
};

interface SelectCourseBranchStatusProps {
    value?: string;
    onChange?: (selected: SelectCourseBranchStatusType | null) => void;
}

export default function SelectCourseBranchStatus({ value, ...rest }: SelectCourseBranchStatusProps) {
    const options = Object.values(CourseBranchStatus).map((status) => ({
        value: status,
        label: <StatusCourseBranch status={status as CourseBranchStatus} />,
    }));

    return (
        <div style={{ position: 'relative', zIndex: 1 }}>
            <Select<SelectCourseBranchStatusType, false, GroupBase<SelectCourseBranchStatusType>>
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
                {...rest}
            />
        </div>

    );
}