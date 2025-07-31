import { AccountReceivableWithRelations } from '@/@types/accounts-receivables';
import React, { useEffect } from 'react'
import apiRequest from '@/utils/lib/api-request/request';

type AccountsReceivableResponse = {
  accountsReceivable: AccountReceivableWithRelations[];
  totalAccountsReceivable: number;
};

export default function useFetchAccountsReceivables(query: string) {
  const [accountsReceivable, setAccountsReceivable] = React.useState<AccountReceivableWithRelations[]>([]);
  const [totalAccountsReceivable, setTotalAccountsReceivable] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchAccountsReceivables = async (query: string) => {
    try {
      const response = await apiRequest.get<AccountsReceivableResponse>(`/accounts-receivable?${query}`);
      if (!response.success) {
        throw new Error(response.message);
      }
      setAccountsReceivable(response.data?.accountsReceivable || []);
      setTotalAccountsReceivable(response.data?.totalAccountsReceivable || 0);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ha ocurrido un error al obtener las cuentas por cobrar');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountsReceivables(query);
  }, [query]);

  return {
    accountsReceivable,
    totalAccountsReceivable,
    loading,
    error,
    fetchAccountsReceivables
  };
}
