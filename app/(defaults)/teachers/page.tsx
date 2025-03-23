import { SearchInput, ViewTitle } from "@/components/common";
import { IconUserPlus } from "@/components/icon";
import { Button } from "@/components/ui";
import { Metadata } from "next";
import Link from "next/link";
import TeacherList from "./components/teacher-list";
import { objectToQueryString } from "@/utils";

export const metadata: Metadata = {
  title: 'Profesores',
};
interface TeacherListProps {
  searchParams?: {
      search?: string;
      page?: string;
  };
}
export default function Teachers({ searchParams }: TeacherListProps) {
  const query = objectToQueryString(searchParams || {});
  return (
    <div>
      <ViewTitle className='mb-6' title="Profesores" rightComponent={
        <>
          <SearchInput placeholder="Buscar profesores" />
          <Link href="/teachers/new">
            <Button icon={<IconUserPlus />}>Crear profesor</Button>
          </Link>

         
        </>
      } />
       <TeacherList query={query} />
    </div>
  )
}
