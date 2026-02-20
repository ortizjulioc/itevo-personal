import { SearchInput, ViewTitle } from "@/components/common";
import { IconPlusCircle } from "@/components/icon";
import { Button } from "@/components/ui";
import { Metadata } from "next";
import Link from "next/link";
import { objectToQueryString } from "@/utils";
import CoursetList from "./components/course-list";

export const metadata: Metadata = {
  title: 'Cursos',
};
interface CoursetListProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}
export default async function Coursets({ searchParams }: CoursetListProps) {
  const params = await searchParams;
  const query = objectToQueryString(params || {});
  return (
    <div>
      <ViewTitle className='mb-6' title="Cursos" rightComponent={
        <>
          <SearchInput placeholder="Buscar Cursos" />
          <Link href="/courses/new">
            <Button icon={<IconPlusCircle />}>Crear curso</Button>
          </Link>


        </>
      } />
      <CoursetList query={query} />
    </div>
  )
}
