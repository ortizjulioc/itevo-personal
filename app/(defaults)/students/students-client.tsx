'use client';

import { SearchInput, ViewTitle } from "@/components/common";
import { IconPlusCircle} from "@/components/icon";
import { Button } from "@/components/ui";
import Link from "next/link";
import { objectToQueryString } from "@/utils";
import StudentList from "./components/student-list";
import { useActiveBranch } from "@/utils/hooks/use-active-branch";

export default function StudentsClient({ searchParams }: { searchParams?: { search?: string; page?: string } }) {
  const { activeBranchId } = useActiveBranch();
  
  // Incluir branchId automáticamente en los parámetros de búsqueda
  const paramsWithBranch = {
    ...searchParams,
    ...(activeBranchId && { branchId: activeBranchId }),
  };
  
  const query = objectToQueryString(paramsWithBranch);
  
  return (
    <div>
      <ViewTitle className='mb-6' title="Estudiantes" rightComponent={
        <>
          <SearchInput placeholder="Buscar Estudiantes" />
          <Link href="/students/new">
            <Button icon={<IconPlusCircle />}>Crear estudiante</Button>
          </Link>
        </>
      } />
      <StudentList query={query} />
    </div>
  );
}

