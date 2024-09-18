
import { Suspense } from "react";
import UserList from "./components/user-list";
import { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import IconUserPlus from "@/components/icon/icon-user-plus";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import IconSearch from "@/components/icon/icon-search";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Usuarios',
};

export default async function Users() {

    return (
        <div>
            <ViewTitle className='mb-6' title="Usuarios" rightComponent={
                <>
                    <Input placeholder="Buscar contactos" icon={IconSearch} />
                    <Link href="/users/new">
                        <Button icon={<IconUserPlus />}>Crear usuario</Button>
                    </Link>
                </>
            } />

            <Suspense fallback={<div>Loading...</div>}>
                <UserList />
            </Suspense>

        </div>
    );
}
