'use client';
import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { GroupBase, ActionMeta, StylesConfig, CSSObjectWithLabel } from 'react-select';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { getCustomStyles } from '@/components/ui/select';

export type SelectCashBoxType = {
  value: string;
  label: string;
};

export interface CashBoxesResponse {
  cashBoxes: CashBox[];
  totalCashBoxes: number;
};

interface CashBox {
  id: string;
  name: string;
  location?: string;
  branchId: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

interface SelectCashBoxProps {
  value?: string;
  onChange?: (selected: SelectCashBoxType | null, actionMeta: ActionMeta<SelectCashBoxType>) => void;
  placeholder?: string;
}

const customStyles: StylesConfig<SelectCashBoxType, false> = {
    menuPortal: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
      ...base,
      zIndex: 9999,
    }),
    menu: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
      ...base,
      zIndex: 9999,
    }),
};

export default function SelectCashBox({ value, onChange, placeholder = '-Cajas-', ...rest }: SelectCashBoxProps) {
  const [options, setOptions] = useState<SelectCashBoxType[]>([]);
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);

  const fetchCashBoxData = async (inputValue: string): Promise<SelectCashBoxType[]> => {
    try {
      const response = await apiRequest.get<CashBoxesResponse>(`/cash-box?search=${inputValue}`);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data?.cashBoxes
        .filter(cashBox => !cashBox.deleted) // Exclude deleted cash boxes
        .map(cashBox => ({ value: cashBox.id, label: cashBox.name })) || [];
    } catch (error) {
      console.error('Error fetching CashBox data:', error);
      return [];
    }
  };

  const loadOptions = async (inputValue: string): Promise<SelectCashBoxType[]> => {
    return fetchCashBoxData(inputValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedOptions = await fetchCashBoxData('');
      setOptions(fetchedOptions);

      if (value && !fetchedOptions.some(option => option.value === value)) {
        try {
          const response = await apiRequest.get<CashBox>(`/cash-box/${value}`);
          if (response.success && response.data && !response.data.deleted) {
            const newOption = { value: response.data.id, label: response.data.name };
            setOptions(prevOptions => [...prevOptions, newOption]);
          }
        } catch (error) {
          console.error('Error fetching single CashBox:', error);
        }
      }
    };

    fetchData();
  }, [value]);

  return (
    <div>
      <AsyncSelect<SelectCashBoxType, false, GroupBase<SelectCashBoxType>>
        loadOptions={loadOptions}
        cacheOptions
        defaultOptions={options}
        placeholder={placeholder}
        noOptionsMessage={() => 'No hay opciones'}
        value={options.find((option) => option.value === value) || null}
        onChange={onChange}
        isClearable
        styles={{
            ...customStyles,
            ...getCustomStyles(Boolean(themeConfig.isDarkMode)),
        }}
        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
        {...rest}
      />
    </div>
  );
}
