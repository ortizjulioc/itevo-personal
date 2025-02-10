import { SearchInput, ViewTitle } from "@/components/common";
import { IconUserPlus } from "@/components/icon";
import { Button } from "@/components/ui";
import { Metadata } from "next";
import Link from "next/link";
import { objectToQueryString } from "@/utils";
import EnrollmentList from "./components/enrollment-list";



export const metadata: Metadata = {
  title: 'Cursos',
};
interface EnrollmentListProps {
  searchParams?: {
      search?: string;
      page?: string;
  };
}
export default function Enrollment({ searchParams }: EnrollmentListProps) {
  const query = objectToQueryString(searchParams || {});
  return (
    <div>
      <ViewTitle className='mb-6' title="Inscripciones" rightComponent={
        <>
          <SearchInput placeholder="Buscar Cursos" />
          <Link href="/enrollments/new">
            <Button icon={<IconUserPlus />}>Crear inscripcion</Button>
          </Link>

         
        </>
      } />
       <EnrollmentList query={query} />
    </div>
  )
}
