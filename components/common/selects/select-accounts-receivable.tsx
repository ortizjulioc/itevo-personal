import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { GroupBase, ActionMeta, components } from 'react-select';
import { TbCheck } from 'react-icons/tb';
import { AccountReceivable } from '@prisma/client';
import { formatCurrency } from '@/utils';
import StudentLabel from '../info-labels/student-label';
import { Select } from '@/components/ui';

export interface AccountsReceivableSelect {
  value: string;
  amount: number;
  label: JSX.Element | string;
  account?: AccountReceivable;
  concept?: string;
}

export interface AccountsReceivablesResponse {
  accountsReceivable: AccountReceivable[];
  totalAccountsReceivables: number;
}

export interface SelectAccountsReceivableProps {
  value?: string;
  onChange?: (
    selected: AccountsReceivableSelect | null,
    actionMeta: ActionMeta<AccountsReceivableSelect>
  ) => void;
}

export default function SelectAccountsReceivable({ value, ...rest }: SelectAccountsReceivableProps) {
  const [options, setOptions] = useState<AccountsReceivableSelect[]>([]);

  const fetchAccountsReceivableData = async (inputValue: string): Promise<AccountsReceivableSelect[]> => {
    try {
      const response = await apiRequest.get<AccountsReceivablesResponse>(`/accounts-receivable?search=${inputValue}`);
      if (!response.success) throw new Error(response.message);

    
      const courseName = (response.data as any)?.
        courseBranch
        ?.course?.name || 'N/A';

      return response.data?.accountsReceivable.map((account) => ({
        value: account.id,
        label: <StudentLabel studentId={account.studentId} />,
        amount: account.amount,
        account,
        concept: `Cuota curso: ${(account as any)?.courseBranch?.course?.name}`,
      })) || [];

    } catch (error) {
      console.error('Error fetching AccountsReceivables:', error);
      return [];
    }
  };

  const loadOptions = async (inputValue: string): Promise<AccountsReceivableSelect[]> => {
    return await fetchAccountsReceivableData(inputValue);
  };

  const CustomOption = (props: any) => {
    const { data, isSelected, innerRef, innerProps } = props;
    const { account } = data;


    return (
      <div
        ref={innerRef}
        {...innerProps}
        className={`flex justify-between items-center px-4 py-2 rounded-md cursor-pointer transition ${isSelected ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-600'
          }`}
      >
        <div className="flex flex-col">

          <span className="text-sm text-gray-600 dark:text-gray-400">
            {account?.student?.firstName}  {account?.student?.lastName}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {account?.courseBranch?.course?.name}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-base font-bold dark:text-white">
            {formatCurrency(account?.amount || 0)}
          </span>
          {isSelected && <TbCheck className="text-emerald-500 text-xl" />}
        </div>
      </div>
    );
  };

  const CustomSingleValue = (props: any) => {
    const { data } = props;
    const { account } = data
    console.log('CustomSingleValue data:', account);
    return (
      <components.SingleValue {...props}>
        <div className="flex justify-between items-center w-full">
          {account?.student?.firstName}  {account?.student?.lastName}
          <span className="text-sm font-semibold">{formatCurrency(data.amount)}</span>
        </div>
      </components.SingleValue>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const initialOptions = await fetchAccountsReceivableData('');
      setOptions(initialOptions);

      if (value && !initialOptions.find((o) => o.value === value)) {
        try {
          const res = await apiRequest.get<AccountReceivable>(`/accounts-receivable/${value}`);
          if (res.success && res.data) {
            const courseName =
              (res.data as any)?.courseBranch?.course?.name || 'N/A';
            const option = {
              value: res.data.id,
              label: <StudentLabel studentId={res.data.studentId} />,
              amount: res.data.amount,
              concept: `Cuota curso: ${courseName}`,
              account: res.data,
            };
            setOptions((prev) => [...prev, option]);
          }
        } catch (error) {
          console.error('Error loading single account receivable:', error);
        }
      }
    };

    fetchData();
  }, [value]);

  return (
    <div>
      <AsyncSelect<AccountsReceivableSelect, false, GroupBase<AccountsReceivableSelect>>
        loadOptions={loadOptions}
        cacheOptions
        defaultOptions={options}
        placeholder="-Estudiantes con cuentas por cobrar-"
        noOptionsMessage={() => 'No hay opciones'}
        value={options.find((o) => o.value === value) || null}
        isClearable
        //asComponent={AsyncSelect}
        components={{
          Option: CustomOption,
          SingleValue: CustomSingleValue,
        }}
        {...rest}
      />
    </div>
  );
}
