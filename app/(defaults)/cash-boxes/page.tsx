import { SearchInput, ViewTitle } from "@/components/common";
import { IconPlusCircle} from "@/components/icon";
import { Button } from "@/components/ui";
import { Metadata } from "next";
import Link from "next/link";
import { objectToQueryString } from "@/utils";
import CashBoxList from "./components/cash-box-list";


export const metadata: Metadata = {
  title: 'Cajas fisicas',
};
interface CashBoxestListProps {
  searchParams?: {
      search?: string;
      page?: string;
  };
}
export default function CashBoxes({ searchParams }: CashBoxestListProps) {
  const query = objectToQueryString(searchParams || {});
  return (
    <div>
      <ViewTitle className='mb-6' title="Cajas fisiscas" rightComponent={
        <>
          <SearchInput placeholder="Buscar Cajas fisicas" />
          <Link href="/cash-boxes/new">
            <Button icon={<IconPlusCircle />}>Crear caja fisica</Button>
          </Link>


        </>
      } />
       <CashBoxList query={query} />
    </div>
  )
}
