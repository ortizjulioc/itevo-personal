import React from 'react';
import Select, { StylesConfig } from 'react-select';
import { PaymentStatus } from '@/generated/prisma/client';
import { GroupBase } from 'react-select';
import StatusPayment from '@/components/common/info-labels/status/status-payment';

export type SelectPayableStatusType = {
  value: string;
  label: string | React.ReactElement;
};

interface SelectPayableStatusProps {
  value?: PaymentStatus;
  onChange?: (selected: SelectPayableStatusType | null) => void;
  minimal?: boolean;
  className?: string;
  isClearable?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export default function SelectPayableStatus({ value, minimal = false, ...rest }: SelectPayableStatusProps) {
  const options = Object.values(PaymentStatus).map((status) => ({
    value: status as PaymentStatus,
    label: <StatusPayment status={status} />,
  }));

  const minimalStyles: StylesConfig<SelectPayableStatusType, false> = {
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
      <Select<SelectPayableStatusType, false, GroupBase<SelectPayableStatusType>>
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
