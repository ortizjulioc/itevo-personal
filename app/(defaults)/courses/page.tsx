import { SearchInput, ViewTitle } from "@/components/common";
import { IconUserPlus } from "@/components/icon";
import { Button } from "@/components/ui";
import { Metadata } from "next";
import Link from "next/link";
import { objectToQueryString } from "@/utils";
import CoursetList from "./components/course-list";

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
      <ViewTitle className='mb-6' title="Cursos" rightComponent={
        <>
          <SearchInput placeholder="Buscar Cursos" />
          <Link href="/courses/new">
            <Button icon={<IconUserPlus />}>Crear curso</Button>
          </Link>

         
        </>
      } />
       <CoursetList query={query} />
    </div>
  )
}
