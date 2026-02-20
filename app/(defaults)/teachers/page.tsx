import { SearchInput, ViewTitle } from "@/components/common";
import { IconPlusCircle } from "@/components/icon";
import { Button } from "@/components/ui";
import { Metadata } from "next";
import Link from "next/link";
import TeacherList from "./components/teacher-list";
import { objectToQueryString } from "@/utils";

export const metadata: Metadata = {
  title: 'Profesores',
};
interface TeacherListProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}
export default async function Teachers({ searchParams }: TeacherListProps) {
  const params = await searchParams;
  const query = objectToQueryString(params || {});
  return (
    <div>
      <ViewTitle className='mb-6' title="Profesores" rightComponent={
        <>
          <SearchInput placeholder="Buscar profesores" />
          <Link href="/teachers/new">
            <Button icon={<IconPlusCircle />}>Crear profesor</Button>
          </Link>


        </>
      } />
      <TeacherList query={query} />
    </div>
  )
}
