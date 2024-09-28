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
    searchParams?: {
        search?: string;
        page?: string;
    };
}

export default function BranchLists({ searchParams }: BranchListsProps) {
    const query = objectToQueryString(searchParams || {});
    return (
        <div>
            <ViewTitle className='mb-6' title="Sucursales" rightComponent={
                <>
                    <SearchInput placeholder="Buscar Sucursales" />
                    <Link href="/Branchs/new">
                        <Button icon={<IconPlusCircle/>}>Crear rol</Button>
                    </Link>
                </>
            } />

            <BranchList query={query} />
        </div>
    );
}
