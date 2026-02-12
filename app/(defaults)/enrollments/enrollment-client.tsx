// app/enrollments/enrollment-client.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineFilter, HiX } from 'react-icons/hi';
import { Button } from '@/components/ui';
import { IconPlusCircle } from '@/components/icon';
import { ViewTitle } from '@/components/common';
import EnrollmentList from './components/enrollment-list';
import SearchEnrollments from './components/search-enrollment';
import { objectToQueryString } from '@/utils';
import { useActiveBranch } from '@/utils/hooks/use-active-branch';
import EnrollmentSummaryCards from './components/enrollment-summary';
import useFetchEnrollments from './lib/use-fetch-enrollments';

export default function Enrollment({ searchParams }: { searchParams?: { search?: string; page?: string } }) {
  const params = useSearchParams();
  const router = useRouter();
  const showFilters = params.get('showFilters') === 'true';
  const { activeBranchId } = useActiveBranch();

  // Incluir branchId automáticamente en los parámetros de búsqueda
  const paramsWithBranch = {
    ...searchParams,
    ...(activeBranchId && { branchId: activeBranchId }),
  };

  // Excluir showFilters de los parámetros que se pasan a la lista para evitar recargas innecesarias
  const { showFilters: _, ...paramsForQuery } = paramsWithBranch;
  const query = objectToQueryString(paramsForQuery || {});

  const { enrollments, totalEnrollments, summary, loading, error, setEnrollments } = useFetchEnrollments(query);

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
        title="Inscripciones"
        rightComponent={
          <div className="flex gap-2">
            <Button
              icon={showFilters ? <HiX /> : <HiOutlineFilter />}
              color={showFilters ? 'danger' : 'success'}
              onClick={handleFilterChange}
            >
              {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            </Button>
            <Link href="/enrollments/new">
              <Button icon={<IconPlusCircle />}>Crear inscripción</Button>
            </Link>
          </div>
        }
      />

      <EnrollmentSummaryCards summary={summary} loading={loading} />

      <div>{showFilters && <SearchEnrollments />}</div>
      <EnrollmentList
        query={query}
        enrollments={enrollments}
        totalEnrollments={totalEnrollments}
        loading={loading}
        error={error}
        setEnrollments={setEnrollments}
      />
    </div>
  );
}
