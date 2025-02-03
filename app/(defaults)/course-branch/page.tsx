import { SearchInput, ViewTitle } from "@/components/common";
import { IconUserPlus } from "@/components/icon";
import { Button } from "@/components/ui";
import { Metadata } from "next";
import Link from "next/link";
import { objectToQueryString } from "@/utils";
import CourseBranchList from "./components/course-branch-list";


export const metadata: Metadata = {
  title: 'Cursos',
};
interface CoursetListProps {
  searchParams?: {
      search?: string;
      page?: string;
  };
}
export default function Coursets({ searchParams }: CoursetListProps) {
  const query = objectToQueryString(searchParams || {});
  return (
    <div>
      <ViewTitle className='mb-6' title="Gestion Academica" rightComponent={
        <>
          <SearchInput placeholder="Buscar gestion" />
          <Link href="/course-branch/new">
            <Button icon={<IconUserPlus />}>Crear gestion academica</Button>
          </Link>

         
        </>
      } />
       <CourseBranchList query={query} />
    </div>
  )
}
