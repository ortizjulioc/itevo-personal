
import { Suspense } from "react";
import UserList from "./components/user-list";
import { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import IconUserPlus from "@/components/icon/icon-user-plus";
import Button from "@/components/ui/button";
import Link from "next/link";
import { SearchInput } from "@/components/common";
import { objectToQueryString } from "@/utils";
import { Pagination } from "@/components/ui";

export const metadata: Metadata = {
    title: 'Usuarios',
};

interface UsersProps {
    searchParams?: {
        search?: string;
        page?: string;
    };
}

export default async function Users({ searchParams }: UsersProps) {
    const query = objectToQueryString(searchParams || {});
    console.log(query);
    return (
        <div>
            <ViewTitle className='mb-6' title="Usuarios" rightComponent={
                <>
                    <SearchInput placeholder="Buscar usuarios" />
                    <Link href="/users/new">
                        <Button icon={<IconUserPlus />}>Crear usuario</Button>
                    </Link>
                </>
            } />

            <Suspense fallback={<div>Loading...</div>}>
                <UserList query={query} />
            </Suspense>

        </div>
    );
}
