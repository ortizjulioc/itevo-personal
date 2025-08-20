'use client';
import { openNotification, queryStringToObject } from "@/utils";
import { Pagination } from "@/components/ui";
import Skeleton from "@/components/common/Skeleton";
import { getFormattedDate } from "@/utils/date";
import CourseBranchLabel from "@/components/common/info-labels/course-branch-label";
import useFetchAttendances from "../../lib/use-fetch-attendance";
import StatusAttendance from "../status-attendance";
import StudentLabel from "@/components/common/info-labels/student-label";

import AttendanceModal from "../attendance-modal";

interface Props {
    className?: string;
    query?: string;
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
}

export default function AttendanceList({ className, query = '', openModal, setOpenModal }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, attendances, totalAttendances, fetchAttendanceData } = useFetchAttendances(query);
    console.log('attendances', attendances);
    if (error) {
        openNotification('error', error);
    }
    if (loading) return <Skeleton rows={6} columns={['ESTUDIANTE', 'OFERTA ACADEMICA', "ESTADO", 'FECHA DE ASISTENCIA']} />;
    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0 ">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>ESTUDIANTE</th>
                            <th>OFERTA ACADEMICA</th>
                            <th>ESTADO</th>
                            <th>FECHA DE ASISTENCIA</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {attendances?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron asistencias registradas</td>
                            </tr>
                        )}
                        {attendances?.map((attendance) => {
                            return (
                                <tr key={attendance.id}>
                                    <td>
                                        <StudentLabel student={attendance.student} clickable />
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
            <AttendanceModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                fetchAttendanceData={fetchAttendanceData}
            />
        </div>
    );
};
