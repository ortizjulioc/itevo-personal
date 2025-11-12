'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { HiOutlineFilter, HiX } from 'react-icons/hi';

import { ViewTitle } from "@/components/common";
import { Button } from "@/components/ui";
import { IconPlusCircle } from "@/components/icon";
import { objectToQueryString } from "@/utils";
import { useActiveBranch } from '@/utils/hooks/use-active-branch';

import CourseBranchList from "./components/course-branch-list";
import SearchCourseBranch from "./components/search-course-branch";

interface CoursetListProps {
  searchParams?: {
    search?: string;
    page?: string;
  };
}

export default function CourseBranchClient({ searchParams }: CoursetListProps) {
  const params = useSearchParams();
  const router = useRouter();
  const showFilters = params.get('showFilters') === 'true';
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
        title="Oferta Académica"
        rightComponent={
          <div className="flex gap-2">
            <Button
              icon={showFilters ? <HiX /> : <HiOutlineFilter />}
              color={showFilters ? 'danger' : 'success'}
              onClick={handleFilterChange}
            >
              {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            </Button>

            <Link href="/course-branch/new">
              <Button icon={<IconPlusCircle />}>Crear Oferta</Button>
            </Link>
          </div>
        }
      />

      <div>{showFilters && <SearchCourseBranch />}</div>

      <CourseBranchList query={query} />
    </div>
  );
}
