'use client';
import { confirmDialog, getInitials, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import Skeleton from "@/components/common/Skeleton";
import useFetchEnrollments from "../../lib/use-fetch-enrollments";
import { deleteEnrollment, updateEnrollment } from "../../lib/request";
import { getFormattedDate } from "@/utils/date";
import SelectEnrollmentStatus from "./select-status";
import { EnrollmentStatus } from "@prisma/client";
import CourseBranchLabel from "@/components/common/info-labels/course-branch-label";
import Avatar from "@/components/common/Avatar";
import OptionalInfo from "@/components/common/optional-info";

interface Props {
    className?: string;
    query?: string;
}

export default function EnrollmentList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, enrollments, totalEnrollments, setEnrollments } = useFetchEnrollments(query);
    if (error) {
        openNotification('error', error);
    }

    const onDelete = async (id: string) => {
        ;
        confirmDialog({
            title: 'Eliminar inscripcion',
            text: '¿Seguro que quieres eliminar esta inscripcion?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
            const resp = await deleteEnrollment(id);
            if (resp.success) {
                setEnrollments(enrollments?.filter((enrollment) => enrollment.id !== id));
                openNotification('success', 'inscripcion eliminado correctamente');
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }

    const onStatusChange = async (id: string, status: EnrollmentStatus) => {
        try {
            const enrollment = enrollments?.find(cb => cb.id === id);
            if (!enrollment) {
                openNotification('error', 'No se encontró la oferta académica');
                return;
            }

            const resp = await updateEnrollment(id, {
                ...enrollment,
                status, // actualizamos solo el campo necesario
            });

            if (resp.success) {
                setEnrollments(enrollments.map((cb) =>
                    cb.id === id ? { ...cb, status } : cb
                ));
                openNotification('success', 'Estado actualizado correctamente');
            }
        } catch (error) {
            openNotification('error', 'Error al actualizar el estado');
        }
    };


    console.log(enrollments);
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
                        {enrollments?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron Inscripciones registradas</td>
                            </tr>
                        )}
                        {enrollments?.map((enrollment) => {
                            return (
                                <tr key={enrollment.id}>
                                    <td>
                                        <div className="ml-2 flex items-center gap-2 min-w-64 hover:cursor-pointer">
                                            <Avatar initials={getInitials(enrollment.student.firstName, enrollment.student.lastName)} size="sm" color="primary" />
                                            <div className="flex flex-col">
                                                <span>{`${enrollment.student.firstName} ${enrollment.student.lastName}`}</span>
                                                <span className="font-semibold"><OptionalInfo content={enrollment.student.identification || ''} message="Sin identificación" /></span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <CourseBranchLabel CourseBranchId={enrollment.courseBranchId} />
                                    </td>
                                    <td>
                                        {getFormattedDate(new Date(enrollment.enrollmentDate))}
                                    </td>
                                    <td>
                                        <SelectEnrollmentStatus
                                            value={enrollment.status}
                                            onChange={(selected) => {
                                                onStatusChange(enrollment.id, selected?.value as EnrollmentStatus);
                                            }}

                                        />
                                    </td>
                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            <Tooltip title="Eliminar">
                                                <Button onClick={() => onDelete(enrollment.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/enrollments/${enrollment.id}`}>
                                                    <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} />
                                                </Link>
                                            </Tooltip>
                                        </div>
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
