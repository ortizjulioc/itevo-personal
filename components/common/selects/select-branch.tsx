
import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState} from 'react';
import AsyncSelect from 'react-select/async';
import { Branch } from '@prisma/client';
import { Select } from '@/components/ui';

interface BranchSelect {
  value: string;
  label: string;
}

export interface BranchesResponse {
  branches: Branch[];
  totalBranches: number;
}

interface SelectBranchProps {
  value?: string;
  onChange?: (selected: BranchSelect | null) => void;
}

export default function SelectBranch({ value, ...rest }: SelectBranchProps) {
  const [options, setOptions] = useState<BranchSelect[]>([]);

  const fetchBranchData = async (inputValue: string): Promise<BranchSelect[]> => {
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

  const loadOptions = async (inputValue: string, callback: (options: BranchSelect[]) => void) => {
    const options = await fetchBranchData(inputValue);
    callback(options);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedOptions = await fetchBranchData('');
      setOptions(fetchedOptions);

      if (value && !fetchedOptions.some(option => option.value === value)) {
        try {
          const response = await apiRequest.get<Branch>(`/branchs/${value}`);
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
      <Select
        loadOptions={loadOptions}
        cacheOptions
        defaultOptions={options}
        placeholder="-Sucursales-"
        noOptionsMessage={() => 'No hay opciones'}
        value={options.find((option) => option.value === value) || null}
        isClearable
        asComponent={AsyncSelect}
        {...rest}
      />
    </div>
  );
}
