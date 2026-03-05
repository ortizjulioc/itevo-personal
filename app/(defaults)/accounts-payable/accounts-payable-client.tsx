'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { HiOutlineFilter, HiX } from 'react-icons/hi';
import { Button } from '@/components/ui';
import { ViewTitle } from '@/components/common';
import { objectToQueryString } from '@/utils';
import { useActiveBranch } from '@/utils/hooks/use-active-branch';
import AccountPayableFilter from './components/filter';
import AccountsPayableList from './components/list';

export default function AccountsPayableClient({ searchParams }: { searchParams?: { search?: string; page?: string } }) {
  const params = useSearchParams();
  const router = useRouter();
  const showFilters = params.get('showFilters') === 'true';
  const { activeBranchId } = useActiveBranch();

  // Include branchId automatically in search parameters
  const paramsWithBranch = {
    ...searchParams,
    ...(activeBranchId && { branchId: activeBranchId }),
  };

  const query = objectToQueryString(paramsWithBranch || {});

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
        title="Cuentas por pagar"
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
      <div>{showFilters && <AccountPayableFilter />}</div>
      <AccountsPayableList query={query} />
    </div>
  );
}
