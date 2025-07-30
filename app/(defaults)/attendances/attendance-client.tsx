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

export default function AttendanceClient({ searchParams }: { searchParams?: { search?: string; page?: string } }) {
  const params = useSearchParams();
  const router = useRouter();
  const showFilters = params.get('showFilters') === 'true';
  const [openModal, setOpenModal] = useState(false);

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
        title="Asistencias"
        rightComponent={
          <div className="flex gap-2">
            <Button
              size="sm"
              icon={showFilters ? <HiX /> : <HiOutlineFilter />}
              color={showFilters ? 'danger' : 'success'}
              onClick={handleFilterChange}
            >
              {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            </Button>
            <Button icon={<IconPlusCircle />} onClick={() => setOpenModal(true)}>
              Registrar Asistencia
            </Button>
          </div>
        }
      />
      <div>{showFilters && <SearchAttendances />}</div>
      <AttendanceList query={query} />
      <AttendanceModal openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}
