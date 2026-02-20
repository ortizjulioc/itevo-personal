import type { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import Button from "@/components/ui/button";
import Link from "next/link";
import { SearchInput } from "@/components/common";
import { objectToQueryString } from "@/utils";
import PromotionList from "./components/promotion-list";
import { IconPlusCircle } from "@/components/icon";

export const metadata: Metadata = {
    title: 'Promociones',
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
            <ViewTitle className='mb-6' title="Promociones" rightComponent={
                <>
                    <SearchInput placeholder="Buscar promociones" />
                    <Link href="/promotions/new">
                        <Button icon={<IconPlusCircle />}>Crear promoción</Button>
                    </Link>
                </>
            } />

            <PromotionList query={query} />
        </div>
    );
}
