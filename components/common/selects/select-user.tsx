'use client';
import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { User } from '@/generated/prisma/client';
import { CSSObjectWithLabel, GroupBase, StylesConfig } from 'react-select';
import { getCustomStyles } from '@/components/ui/select';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';

export interface UserSelect {
  value: string;
  label: string;
}

export interface UserResponse {
  users: User[];
  totalUsers: number;
}

interface SelectUserProps {
  value?: string;
  loading?: boolean;
  onChange?: (selected: UserSelect | null) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

const customStyles: StylesConfig<UserSelect, false> = {
  menuPortal: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    zIndex: 9999,
  }),
  menu: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    zIndex: 9999,
  }),
};

export default function SelectUser({ value, placeholder = '-Usuarios-', ...rest }: SelectUserProps) {
  const [options, setOptions] = useState<UserSelect[]>([]);
  const [loading, setLoading] = useState(false);
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);

  const fetchUserData = async (inputValue: string): Promise<UserSelect[]> => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        search: inputValue,
      });
      
      const response = await apiRequest.get<UserResponse>(`/users?${queryParams.toString()}`);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data?.users.map(user => ({ 
        value: user.id, 
        label: `${user.username} - ${user.name} ${user.lastName}` 
      })) || [];
    } catch (error) {
      console.error('Error fetching Users data:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async (inputValue: string): Promise<UserSelect[]> => {
    return fetchUserData(inputValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedOptions = await fetchUserData('');
      setOptions(fetchedOptions);

      if (value && !fetchedOptions.some(option => option.value === value)) {
        try {
          const response = await apiRequest.get<User>(`/users/${value}`);
          if (response.success && response.data) {
            const newOption = { 
              value: response.data.id, 
              label: `${response.data.username} - ${response.data.name} ${response.data.lastName}` 
            };
            setOptions(prevOptions => [...prevOptions, newOption]);
          }
        } catch (error) {
          console.error('Error fetching single User:', error);
        }
      }
      setLoading(false);
    };

    fetchData();

  }, [value]);

  return (
    <div>
      <AsyncSelect<UserSelect, false, GroupBase<UserSelect>>
        loadOptions={loadOptions}
        defaultOptions={options}
        isLoading={rest.loading || loading}
        placeholder={placeholder}
        noOptionsMessage={() => 'No hay opciones'}
        value={options.find((option) => option.value === value) || null}
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
