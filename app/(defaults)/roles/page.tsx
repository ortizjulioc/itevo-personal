import { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import Button from "@/components/ui/button";
import Link from "next/link";
import { SearchInput } from "@/components/common";
import { objectToQueryString } from "@/utils";
import RoleList from "./components/role-list";
import { IconPlusCircle } from "@/components/icon";

export const metadata: Metadata = {
    title: 'Roles',
};

interface RoleListsProps {
    searchParams?: {
        search?: string;
        page?: string;
    };
}

export default function RoleLists({ searchParams }: RoleListsProps) {
    const query = objectToQueryString(searchParams || {});
    return (
        <div>
            <ViewTitle className='mb-6' title="Roles" rightComponent={
                <>
                    <SearchInput placeholder="Buscar roles" />
                    <Link href="/RoleLists/new">
                        <Button icon={<IconPlusCircle/>}>Crear rol</Button>
                    </Link>
                </>
            } />

            <RoleList query={query} />
        </div>
    );
}
