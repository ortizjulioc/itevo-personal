'use client';
import { confirmDialog, openNotification, queryStringToObject } from "@/utils";
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
import { formatScheduleList } from "@/utils/schedule";
import { useState } from "react";
import { IoIosMore } from "react-icons/io";
import PrintEnrollment from "@/components/common/print/enrollment";

interface Props {
    className?: string;
    query?: string;
}

export default function EnrollmentList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
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
    if (loading) return <Skeleton rows={6} columns={['FECHA', 'ESTUDIANTE', 'CURSO', 'PROFESOR', 'HORARIO', 'ESTADO']} />;
    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0 ">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>FECHA</th>
                            <th>ESTUDIANTE</th>
                            <th>CURSO</th>
                            <th>PROFESOR</th>
                            <th>HORARIO</th>
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
                                    <td>{getFormattedDate(new Date(enrollment.enrollmentDate))}</td>
                                    <td>
                                        <span className="">{`${enrollment.student.code} - ${enrollment.student.firstName} ${enrollment.student.lastName}`}</span>
                                    </td>
                                    <td>{enrollment.courseBranch.course.name}</td>
                                    <td>{enrollment.courseBranch.teacher.firstName} {enrollment.courseBranch.teacher.lastName}</td>
                                    <td>{formatScheduleList(enrollment.courseBranch.schedules)}</td>
                                    <td>
                                        <SelectEnrollmentStatus
                                            value={enrollment.status}
                                            onChange={(selected) => {
                                                onStatusChange(enrollment.id, selected?.value as EnrollmentStatus);
                                            }}

                                        />
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3 justify-end">
                                            <div className="relative inline-block text-left">
                                                <button
                                                    className="p-2 rounded-full hover:bg-gray-100 cursor-pointer left-auto right-full "
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenDropdownId(prev => (prev === enrollment.id ? null : enrollment.id));
                                                    }}
                                                >
                                                    <IoIosMore className="text-xl rotate-90" />
                                                </button>

                                                {openDropdownId === enrollment.id && (
                                                    <div
                                                        className="fixed right-4 mt-2 w-auto  z-50 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="p-2">

                                                            <PrintEnrollment enrollmentId={enrollment.id} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <Tooltip title="Eliminar">
                                                <button onClick={() => onDelete(enrollment.id)}>
                                                    <IconTrashLines className="size-5 hover:text-danger hover:cursor-pointer" />
                                                </button>
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/enrollments/${enrollment.id}`}>
                                                    <IconEdit className="size-5 hover:text-primary hover:cursor-pointer" />
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
