import { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import Button from "@/components/ui/button";
import Link from "next/link";
import { SearchInput } from "@/components/common";
import { objectToQueryString } from "@/utils";
import BranchList from "./components/branch-list";
import { IconPlusCircle } from "@/components/icon";

export const metadata: Metadata = {
    title: "Sucursales",
};

interface BranchListsProps {
    searchParams: Promise<{
        search?: string;
        page?: string;
    }>;
}

export default async function BranchLists({ searchParams }: BranchListsProps) {
    const params = await searchParams;
    const query = objectToQueryString(params || {});
    return (
        <div>
            <ViewTitle className='mb-6' title="Sucursales" rightComponent={
                <>
                    <SearchInput placeholder="Buscar Sucursales" />
                    <Link href="/branches/new">
                        <Button icon={<IconPlusCircle />}>Crear sucursal</Button>
                    </Link>
                </>
            } />

            <BranchList query={query} />
        </div>
    );
}
