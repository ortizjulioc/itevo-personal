import type { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import Button from "@/components/ui/button";
import Link from "next/link";
import { SearchInput } from "@/components/common";
import { objectToQueryString } from "@/utils";
import ScholarshipList from "./components/scholarship-list";
import { IconPlusCircle } from "@/components/icon";

export const metadata: Metadata = {
    title: 'Catálogo de Becas',
};

interface Props {
    searchParams: Promise<{
        search?: string;
        page?: string;
        top?: string;
    }>;
}

export default async function ScholarshipPage({ searchParams }: Props) {
    const params = await searchParams;
    const query = objectToQueryString(params || {});
    return (
        <div>
            <ViewTitle className='mb-6' title="Catálogo de Becas" rightComponent={
                <>
                    <SearchInput placeholder="Buscar becas" />
                    <Link href="/scholarships/new">
                        <Button icon={<IconPlusCircle />}>Crear beca</Button>
                    </Link>
                </>
            } />

            <ScholarshipList query={query} />
        </div>
    );
}
