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
    searchParams: Promise<{
        search?: string;
        page?: string;
    }>;
}

export default async function RoleLists({ searchParams }: RoleListsProps) {
    const params = await searchParams;
    const query = objectToQueryString(params || {});
    return (
        <div>
            <ViewTitle className='mb-6' title="Roles" rightComponent={
                <>
                    <SearchInput placeholder="Buscar roles" />
                    <Link href="/roles/new">
                        <Button icon={<IconPlusCircle />}>Crear rol</Button>
                    </Link>
                </>
            } />

            <RoleList query={query} />
        </div>
    );
}
