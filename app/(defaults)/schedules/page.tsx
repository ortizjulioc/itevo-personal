import { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
// import IconUserPlus from "@/components/icon/icon-user-plus";
// import Button from "@/components/ui/button";
// import Link from "next/link";
// import { SearchInput } from "@/components/common";
import { objectToQueryString } from "@/utils";
import ScheduleList from "./components/schedules-list";
import SchedulesCalendar from "./components/schedules-calendar";

export const metadata: Metadata = {
    title: 'Horario de clases',
};

interface UsersProps {
    searchParams?: {
        search?: string;
        page?: string;
    };
}

export default function Users({ searchParams }: UsersProps) {
    const query = objectToQueryString(searchParams || {});
    return (
        <div>
            <div>
               <ViewTitle className='mb-6' title="Horario de clases"/>
            </div>

            {/* <SchedulesCalendar /> */}
            <ScheduleList />
        </div>
    );
}
