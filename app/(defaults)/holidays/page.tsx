import { SearchInput, ViewTitle } from "@/components/common";
import { IconPlusCircle} from "@/components/icon";
import { Button } from "@/components/ui";
import { Metadata } from "next";
import Link from "next/link";
import { objectToQueryString } from "@/utils";
import HolidayList from "./components/holiday-list";


export const metadata: Metadata = {
  title: 'Cursos',
};
interface HolidayListProps {
  searchParams?: {
      search?: string;
      page?: string;
  };
}
export default function Holiday({ searchParams }: HolidayListProps) {
  const query = objectToQueryString(searchParams || {});
  return (
    <div>
      <ViewTitle className='mb-6' title="Dias feriados" rightComponent={
        <>
          <SearchInput placeholder="Buscar" />
          <Link href="/holidays/new">
            <Button icon={<IconPlusCircle />}>Crear dia feriado</Button>
          </Link>

         
        </>
      } />
       <HolidayList query={query} />
    </div>
  )
}
