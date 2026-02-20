import type { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import Button from "@/components/ui/button";
import Link from "next/link";
import { SearchInput } from "@/components/common";
import { objectToQueryString } from "@/utils";
import { IconPlusCircle } from "@/components/icon";
import NcfRangeList from "./components/ncfrange-list";


export const metadata: Metadata = {
    title: 'Rangos NCF',
};

interface NcfRangeProps {
    searchParams: Promise<{
        search?: string;
        page?: string;
    }>;
}

export default async function NcfRange({ searchParams }: NcfRangeProps) {
    const params = await searchParams;
    const query = objectToQueryString(params || {});
    return (
        <div>
            <ViewTitle className='mb-6' title="Rangos NCF" rightComponent={
                <>
                    <SearchInput placeholder="Buscar Rangos NCF" />
                    <Link href="/ncfranges/new">
                        <Button icon={<IconPlusCircle />}>Crear rango NCF</Button>
                    </Link>
                </>
            } />

            <NcfRangeList query={query} />
        </div>
    );
}
