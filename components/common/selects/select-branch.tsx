'use client';

import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { Branch } from '@prisma/client';
import { Select } from '@/components/ui';
import { GroupBase, ActionMeta } from 'react-select';

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
}

export default function SelectBranch({ value, onChange, ...rest }: SelectBranchProps) {
  const [options, setOptions] = useState<SelectBranchType[]>([]);

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
        placeholder="-Sucursales-"
        noOptionsMessage={() => 'No hay opciones'}
        value={options.find((option) => option.value === value) || null}
        onChange={onChange}
        isClearable
        //asComponent={AsyncSelect}
        {...rest}
      />
    </div>
  );
}