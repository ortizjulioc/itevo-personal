'use client';

import { Input, Button } from "@/components/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { useDebounce } from 'use-debounce';

export default function QuotationSearch() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value) {
                params.set(name, value)
            } else {
                params.delete(name)
            }
            return params.toString()
        },
        [searchParams]
    )

    useEffect(() => {
        const currentSearch = searchParams.get('search') || '';
        if (debouncedSearchTerm !== currentSearch) {
            router.push(pathname + '?' + createQueryString('search', debouncedSearchTerm));
        }
    }, [debouncedSearchTerm, router, pathname, createQueryString, searchParams]);

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 max-w-md">
                <Input
                    type="text"
                    placeholder="Buscar por número de cotización..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={HiOutlineSearch as any}
                />
            </div>
        </div>
    );
}
