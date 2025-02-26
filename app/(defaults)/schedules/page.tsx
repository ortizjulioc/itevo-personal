import { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import ScheduleList from "./components/schedules-list";
import SchedulesForm from "./components/schedules-form";

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
    return (
        <div>
            <div>
                <ViewTitle className='' title="Horario de clases" />
            </div>
            <SchedulesForm className="mb-6" />

            <ScheduleList className="z-30" />
        </div>
    );
}
