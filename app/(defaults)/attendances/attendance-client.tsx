'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineFilter, HiX } from 'react-icons/hi';
import { Button } from '@/components/ui';
import { IconPlusCircle } from '@/components/icon';
import { ViewTitle } from '@/components/common';

import { objectToQueryString } from '@/utils';
import AttendanceList from './components/attendance-list';
import { useState } from 'react';
import SearchAttendances from './components/attendance-search';
import AttendanceModal from './components/attendance-modal';
import { useActiveBranch } from '@/utils/hooks/use-active-branch';

export default function AttendanceClient({ searchParams }: { searchParams?: { search?: string; page?: string } }) {
  const params = useSearchParams();
  const router = useRouter();
  const showFilters = params.get('showFilters') === 'true';
  const [openModal, setOpenModal] = useState(false);
  const { activeBranchId } = useActiveBranch();

  // Incluir branchId automáticamente en los parámetros de búsqueda
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
        title="Asistencias"
        rightComponent={
          <div className="flex gap-2">
            <Button
              icon={showFilters ? <HiX /> : <HiOutlineFilter />}
              color={showFilters ? 'danger' : 'success'}
              onClick={handleFilterChange}
            >
              {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            </Button>
            <Link href={'/attendances/new'}>
              <Button
                icon={<IconPlusCircle />}
              >
                Registrar Asistencia
              </Button>
            </Link>
          </div>
        }
      />
      <div>{showFilters && <SearchAttendances />}</div>
      <AttendanceList
        query={query}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />

    </div>
  );
}
