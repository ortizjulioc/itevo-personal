import { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import ScheduleList from "./components/schedules-list";
import SchedulesForm from "./components/schedules-form";
import Schedule from ".";

export const metadata: Metadata = {
    title: 'Horario de clases',
};

const Users = () => <Schedule />; 

export default Users;