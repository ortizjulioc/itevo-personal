'use client';
import { confirmDialog, getInitials, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import Skeleton from "@/components/common/Skeleton";
import { deleteAttendance, updateAttendance } from "../../lib/request";
import { getFormattedDate } from "@/utils/date";
import { AttendanceStatus } from "@prisma/client";
import CourseBranchLabel from "@/components/common/info-labels/course-branch-label";
import Avatar from "@/components/common/Avatar";
import OptionalInfo from "@/components/common/optional-info";
import useFetchAttendances from "../../lib/use-fetch-attendance";
import StatusAttendance from "../status-attendance";
import StudentLabel from "@/components/common/info-labels/student-label";
import { formAnnotation } from "pdfkit";
import { format } from "path";

interface Props {
    className?: string;
    query?: string;
}

export default function AttendanceList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, attendances, totalAttendances, setAttendances } = useFetchAttendances(query);
    if (error) {
        openNotification('error', error);
    }

    

    console.log(attendances);
    if (loading) return <Skeleton rows={6} columns={['ESTUDIANTE', 'OFERTA ACADEMICA', 'FECHA DE INSCRIPCION']} />;
    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>ESTUDIANTE</th>
                            <th>OFERTA ACADEMICA</th>
                            <th>FECHA DE INSCRIPCION</th>
                            <th>ESTADO</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {attendances?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron Inscripciones registradas</td>
                            </tr>
                        )}
                        {attendances?.map((attendance) => {
                            return (
                                <tr key={attendance.id}>
                                    <td>
                                        <StudentLabel StudentId={attendance.studentId} />
                                    </td>
                                    <td>
                                        <CourseBranchLabel CourseBranchId={attendance.courseBranchId} />
                                    </td>
                                    <td>
                                        <StatusAttendance status={attendance.status} />

                                    </td>
                                    <td>
                                        {getFormattedDate(new Date(attendance.createdAt))}

                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>

            </div>
            <div className="">
                <Pagination
                    currentPage={parseInt(params?.page || '1')}
                    total={totalAttendances}
                    top={parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
