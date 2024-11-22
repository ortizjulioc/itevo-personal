import { SearchInput, ViewTitle } from "@/components/common";
import { IconUserPlus } from "@/components/icon";
import { Button } from "@/components/ui";
import { Metadata } from "next";
import Link from "next/link";

import { objectToQueryString } from "@/utils";
import StudentList from "./components/student-list";

export const metadata: Metadata = {
  title: 'Estudiantes',
};
interface StudentListProps {
  searchParams?: {
      search?: string;
      page?: string;
  };
}
export default function Students({ searchParams }: StudentListProps) {
  const query = objectToQueryString(searchParams || {});
  return (
    <div>
      <ViewTitle className='mb-6' title="Estudiantes" rightComponent={
        <>
          <SearchInput placeholder="Buscar Estudiantes" />
          <Link href="/students/new">
            <Button icon={<IconUserPlus />}>Crear estudiante</Button>
          </Link>

         
        </>
      } />
       <StudentList query={query} />
    </div>
  )
}
