import type { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import Button from "@/components/ui/button";
import Link from "next/link";
import { SearchInput } from "@/components/common";
import { objectToQueryString } from "@/utils";
import { IconPlusCircle } from "@/components/icon";
import IconDownload from "@/components/icon/icon-download";
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
    const search = searchParams?.search || '';

    const handleDownload = () => {
        window.open(`/api/products/download?search=${search}`, '_blank');
    };

    return (
        <div>
            <ViewTitle className='mb-6' title="Productos" rightComponent={
                <>
                    <SearchInput placeholder="Buscar Productos" />
                    <a href={`/api/products/download?search=${search}`} target="_blank" rel="noreferrer">
                        <Button color="success" icon={<IconDownload />}>Descargar Excel</Button>
                    </a>
                    <Link href="/products/new">
                        <Button icon={<IconPlusCircle />}>Crear Producto</Button>
                    </Link>
                </>
            } />

            <ProductList query={query} />
        </div>
    );
}
