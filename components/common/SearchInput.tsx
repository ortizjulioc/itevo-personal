'use client';
import { useURLSearchParams } from "@/utils/hooks";
import { useDebouncedCallback } from 'use-debounce';
import IconSearch from "../icon/icon-search";
import { Input } from "../ui";

interface SearchInputProps {
    placeholder?: string;
    searchKey?: string;
}

export default function SearchInput({ placeholder, searchKey = 'search' }: SearchInputProps) {
    const params = useURLSearchParams();

    const handleChange = useDebouncedCallback((value: string) => {
        params.set(searchKey, value);
    }, 300);

    return (
        <Input
            type="search"
            placeholder={placeholder}
            icon={IconSearch}
            defaultValue={params.get(searchKey) || ''}
            onChange={({ target }) => handleChange(target.value)}
        />
    );
}
