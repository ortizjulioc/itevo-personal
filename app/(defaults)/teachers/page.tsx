import { SearchInput, ViewTitle } from "@/components/common";
import { IconUserPlus } from "@/components/icon";
import { Button } from "@/components/ui";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Profesores',
};

export default function Teachers() {
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
    </div>
  )
}
