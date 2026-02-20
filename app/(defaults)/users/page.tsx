import { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import IconUserPlus from "@/components/icon/icon-user-plus";
import Button from "@/components/ui/button";
import Link from "next/link";
import { SearchInput } from "@/components/common";
import { objectToQueryString } from "@/utils";
import UserList from "./components/user-list";

export const metadata: Metadata = {
    title: 'Usuarios',
};

interface UsersProps {
    searchParams: Promise<{
        search?: string;
        page?: string;
    }>;
}

export default async function Users({ searchParams }: UsersProps) {
    const params = await searchParams;
    const query = objectToQueryString(params || {});
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
        </div>
    );
}