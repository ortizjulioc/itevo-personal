'use client';
import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { Branch } from '@/generated/prisma/client';
import { GroupBase, ActionMeta, StylesConfig, CSSObjectWithLabel } from 'react-select';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { getCustomStyles } from '@/components/ui/select';

export type SelectBranchType = {
  value: string;
  label: string;
};

export interface BranchesResponse {
  branches: Branch[];
  totalBranches: number;
};

interface SelectBranchProps {
  value?: string;
  onChange?: (selected: SelectBranchType | null, actionMeta: ActionMeta<SelectBranchType>) => void;
  placeholder?: string;
}

const customStyles: StylesConfig<SelectBranchType, false> = {
    menuPortal: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
      ...base,
      zIndex: 9999,
    }),
    menu: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
      ...base,
      zIndex: 9999,
    }),
};

export default function SelectBranch({ value, onChange, placeholder = '-Sucursales-', ...rest }: SelectBranchProps) {
  const [options, setOptions] = useState<SelectBranchType[]>([]);
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);

  const fetchBranchData = async (inputValue: string): Promise<SelectBranchType[]> => {
    try {
      const response = await apiRequest.get<BranchesResponse>(`/branches?search=${inputValue}`);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data?.branches.map(branch => ({ value: branch.id, label: branch.name })) || [];
    } catch (error) {
      console.error('Error fetching Branches data:', error);
      return [];
    }
  };

  const loadOptions = async (inputValue: string): Promise<SelectBranchType[]> => {
    return fetchBranchData(inputValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedOptions = await fetchBranchData('');
      setOptions(fetchedOptions);

      if (value && !fetchedOptions.some(option => option.value === value)) {
        try {
          const response = await apiRequest.get<Branch>(`/branches/${value}`);
          if (response.success && response.data) {
            const newOption = { value: response.data.id, label: response.data.name };
            setOptions(prevOptions => [...prevOptions, newOption]);
          }
        } catch (error) {
          console.error('Error fetching single Branch:', error);
        }
      }
    };

    fetchData();
  }, [value]);

  return (
    <div>
      <AsyncSelect<SelectBranchType, false, GroupBase<SelectBranchType>>
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