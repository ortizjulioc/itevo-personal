import { Suspense } from "react";
import { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import IconUserPlus from "@/components/icon/icon-user-plus";
import Button from "@/components/ui/button";
import Link from "next/link";
import { SearchInput } from "@/components/common";
import { objectToQueryString } from "@/utils";
import UserList from "./components/user-list";
import UserSkeleton from "./components/user-list/skeleton";

export const metadata: Metadata = {
    title: 'Usuarios',
};

interface UsersProps {
    searchParams?: {
        search?: string;
        page?: string;
    };
}

export default function Users({ searchParams }: UsersProps) {
    const query = objectToQueryString(searchParams || {});
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

                <UserList query={query} />
            {/* <Suspense fallback={<UserSkeleton />}>
            </Suspense> */}
        </div>
    );
}
