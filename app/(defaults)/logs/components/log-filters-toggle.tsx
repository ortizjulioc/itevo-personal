'use client';
import { Button } from "@/components/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { HiOutlineFilter, HiX } from "react-icons/hi";

interface Props {
    showFilters: boolean;
}

export default function LogFiltersToggle({ showFilters }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleToggle = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (showFilters) {
            params.delete('showFilters');
        } else {
            params.set('showFilters', 'true');
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <Button
            icon={showFilters ? <HiX /> : <HiOutlineFilter />}
            color={showFilters ? 'danger' : 'success'}
            onClick={handleToggle}
        >
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        </Button>
    );
}
