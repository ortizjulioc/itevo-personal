import {  ViewTitle } from "@/components/common";
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

            <ScheduleList query={query} />
        </div>
    );
}