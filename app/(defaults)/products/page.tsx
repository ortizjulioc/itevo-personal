import type { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import Button from "@/components/ui/button";
import Link from "next/link";
import { SearchInput } from "@/components/common";
import { objectToQueryString } from "@/utils";
import { IconPlusCircle } from "@/components/icon";
import ProductList from "./components/product-list";

export const metadata: Metadata = {
    title: 'Productos',
};

interface ProductProps {
    searchParams?: {
        search?: string;
        page?: string;
    };
}

export default function Product({ searchParams }: ProductProps) {
    const query = objectToQueryString(searchParams || {});
    return (
        <div>
            <ViewTitle className='mb-6' title="Productos" rightComponent={
                <>
                    <SearchInput placeholder="Buscar Productos" />
                    <Link href="/products/new">
                        <Button icon={<IconPlusCircle />}>Crear Producto</Button>
                    </Link>
                </>
            } />

            <ProductList query={query} />
        </div>
    );
}
