'use client';
import { getInitials, openNotification, queryStringToObject } from "@/utils";

import Skeleton from "@/components/common/Skeleton";
import StudentLabel from "@/components/common/info-labels/student-label";
import { ENROLLMENT_STATUS } from "@/constants/enrollment.status.constant";
import useFetchEnrollments from "@/app/(defaults)/enrollments/lib/use-fetch-enrollments";
import { Pagination } from "@/components/ui";
import StatusEnrollment from "@/components/common/info-labels/status/status-enrollment";
import { EnrollmentStatus } from "@prisma/client";
import { getFormattedDateTime } from "@/utils/date";
import Avatar from "@/components/common/Avatar";
import OptionalInfo from "@/components/common/optional-info";
import Link from "next/link";





interface Props {
    className?: string;
    query?: string;
}

export default function CourseBranchEnrollments({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, enrollments, totalEnrollments } = useFetchEnrollments(query);
    if (error) {
        openNotification('error', error);
    }

    const enrollmentStatus = [
        { value: ENROLLMENT_STATUS.WAITING, label: 'En espera' },
        { value: ENROLLMENT_STATUS.ENROLLED, label: 'Inscrito' },
        { value: ENROLLMENT_STATUS.COMPLETED, label: 'Completado' },
        { value: ENROLLMENT_STATUS.ABANDONED, label: 'Abandonado' },
    ];
    console.log('enrollments', enrollments);

    if (loading) return <Skeleton rows={3} columns={['ESTUDIANTE', 'FECHA DE INSCRIPCION', 'ESTADO']} />;

    return (
        <div className='col-span-2'>
            <h1 className="text-2xl font-semibold dark:text-white-light mb-3">Inscripciones</h1>
            <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>ESTUDIANTE</th>
                            <th>FECHA DE INSCRIPCION</th>
                            <th>ESTADO</th>

                        </tr>
                    </thead>
                    <tbody>
                        {enrollments?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron Inscripciones registradas</td>
                            </tr>
                        )}
                        {enrollments?.map((enrollment) => {
                            return (
                                <tr key={enrollment.id}>
                                    <td>
                                        <Link href={`/students/view/${enrollment.student.id}`} className="ml-2 flex items-center gap-2 min-w-64 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-2 py-1 transition-colors">
                                            <Avatar initials={getInitials(enrollment.student.firstName, enrollment.student.lastName)} size="sm" color="primary" />
                                            <div className="flex flex-col">
                                                <span>{`${enrollment.student.firstName} ${enrollment.student.lastName}`}</span>
                                                <span className="font-semibold"><OptionalInfo content={enrollment.student.code} message="Sin identificación" /></span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td>
                                        {getFormattedDateTime(new Date(enrollment.enrollmentDate), { hour12: true })}
                                    </td>
                                    <td>
                                        <StatusEnrollment status={enrollment.status as any} />
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
                    total={totalEnrollments}
                    top={parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
