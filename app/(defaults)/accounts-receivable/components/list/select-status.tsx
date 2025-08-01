import Select, { StylesConfig } from 'react-select';
import { PaymentStatus } from '@prisma/client';
import { GroupBase } from 'react-select';
import StatusPayment from '@/components/common/info-labels/status/status-payment';

export type SelectEnrollmentStatusType = {
    value: string;
    label: string | JSX.Element;
};

interface SelectEnrollmentStatusProps {
    value?: PaymentStatus;
    onChange?: (selected: SelectEnrollmentStatusType | null) => void;
    minimal?: boolean;
    className?: string;
    isClearable?: boolean;
    isLoading?: boolean;
    isDisabled?: boolean;
}

export default function SelectReceivableStatus({ value, minimal = false, ...rest }: SelectEnrollmentStatusProps) {
    const options = Object.values(PaymentStatus).map((status) => ({
        value: status as PaymentStatus,
        label: <StatusPayment status={status} />,
    }));

    const minimalStyles: StylesConfig<SelectEnrollmentStatusType, false> = {
        control: (base) => ({
            ...base,
            border: 'none',
            boxShadow: 'none',
            backgroundColor: 'transparent',
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
        }),
    };

    return (
        <div style={{ position: 'relative', zIndex: 1 }}>
            <Select<SelectEnrollmentStatusType, false, GroupBase<SelectEnrollmentStatusType>>
                options={options}
                placeholder="Estados"
                noOptionsMessage={() => 'No hay opciones'}
                value={options.find((option) => option.value === value) || null}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                styles={minimal ? minimalStyles : undefined}
                isSearchable={false}
                {...rest}
            />
        </div>

    );
}
