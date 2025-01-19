import { SearchInput, ViewTitle } from "@/components/common";
import { IconPlusCircle } from "@/components/icon";
import { Button } from "@/components/ui";
import { objectToQueryString } from "@/utils";
import Link from "next/link";
import ScheduleList from "./schedules-list";

interface ScheduleListsProps {
    searchParams?: {
        search?: string;
        page?: string;
    };
}

export default function ScheduleLists({ searchParams }: ScheduleListsProps) {
    const query = objectToQueryString(searchParams || {});
    return (
        <div>
            <ViewTitle className='mb-6' title="Horarios" rightComponent={
                <>
                    <Link href="/Schedulees/new">
                        <Button icon={<IconPlusCircle/>}>Crear Horario</Button>
                    </Link>
                </>
            } />

            <ScheduleList query={query} />
        </div>
    );
}