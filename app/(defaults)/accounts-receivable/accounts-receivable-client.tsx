'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { HiOutlineFilter, HiX } from 'react-icons/hi';
import { Button } from '@/components/ui';
import { ViewTitle } from '@/components/common';
import { objectToQueryString } from '@/utils';
import AccountsReceivableList from './components/list';

export default function AccountsReceivableClient({ searchParams }: { searchParams?: { search?: string; page?: string } }) {
  const params = useSearchParams();
  const router = useRouter();
  const showFilters = params.get('showFilters') === 'true';

  const query = objectToQueryString(searchParams || {});

  const handleFilterChange = () => {
    const newParams = new URLSearchParams(params.toString());
    if (showFilters) {
      newParams.delete('showFilters');
    } else {
      newParams.set('showFilters', 'true');
    }
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div>
      <ViewTitle
        className="mb-6"
        title="Cuentas por cobrar"
        rightComponent={
          <div className="flex gap-2">
            <Button
              icon={showFilters ? <HiX /> : <HiOutlineFilter />}
              color={showFilters ? 'danger' : 'success'}
              onClick={handleFilterChange}
            >
              {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            </Button>
          </div>
        }
      />
      <div>{showFilters && <span>Mostrar filtros</span>}</div>
      <AccountsReceivableList query={query} />
    </div>
  );
}
