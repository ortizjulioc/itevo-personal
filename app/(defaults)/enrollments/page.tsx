import { SearchInput, ViewTitle } from "@/components/common";
import { IconPlusCircle} from "@/components/icon";
import { Button } from "@/components/ui";
import { Metadata } from "next";
import Link from "next/link";
import { objectToQueryString } from "@/utils";
import EnrollmentList from "./components/enrollment-list";
import SearchEnrollments from "./components/search-enrollment";



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
        
          <Link href="/enrollments/new">
            <Button icon={<IconPlusCircle/>}>Crear inscripcion</Button>
          </Link>


        </>
      } />
      <div>
        <SearchEnrollments />
      </div>
      <EnrollmentList query={query} />
    </div>
  )
}
