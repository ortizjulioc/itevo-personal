'use client';
import React from 'react';
import { confirmDialog, formatCurrency, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination, Select } from "@/components/ui";
import { IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import TableSkeleton from "@/components/common/Skeleton";
import useFetchCourseBranch from "../../lib/use-fetch-course-branch";
import { deleteCourseBranch, updateCourseBranch } from "../../lib/request";
import { TbDetails } from "react-icons/tb";
import { getFormattedDate } from "@/utils/date";
import ModalityTag from "../modality";
import StatusCourseBranch from "@/components/common/info-labels/status/status-course-branch";
import { CourseBranchStatus } from '@/generated/prisma/client';
import SelectCourseBranchStatus from "./select-status";
import OptionalInfo from "@/components/common/optional-info";
import { useSession } from "next-auth/react";
import { restoreCourseBranch } from "../../lib/request";
import { LuRotateCcw } from "react-icons/lu";
import { SUPER_ADMIN } from "@/constants/role.constant";



interface Props {
    className?: string;
    query?: string;
}

type StatusOption = {
    value: CourseBranchStatus;
    label: string | React.ReactElement;
};

export default function CourseBranchList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { data: session } = useSession();
    const isSuperAdmin = session?.user?.roles?.some((role: any) => role.normalizedName === SUPER_ADMIN);
    const { loading, error, courseBranches, totalCourseBranches, setCourseBranches, refetch } = useFetchCourseBranch(query);

    if (error) {
        openNotification('error', error);
    }



    const onDelete = async (id: string) => {

        confirmDialog({
            title: 'Eliminar oferta academica',
            text: '¿Seguro que quieres eliminar esta oferta  academica?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
            const resp = await deleteCourseBranch(id);
            if (resp.success) {
                setCourseBranches(courseBranches?.filter((courseBranch) => courseBranch.id !== id));
                openNotification('success', 'oferta  academica eliminada correctamente');
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }

    const onRestore = async (id: string) => {
        confirmDialog({
            title: 'Restaurar oferta académica',
            text: '¿Quieres restaurar esta oferta académica?',
            confirmButtonText: 'Sí, restaurar',
            icon: 'info'
        }, async () => {
            const resp = await restoreCourseBranch(id);
            if (resp.success) {
                openNotification('success', 'Oferta académica restaurada correctamente');
                refetch();
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }
    const onStatusChange = async (id: string, status: CourseBranchStatus) => {
        try {
            const courseBranch = courseBranches?.find(cb => cb.id === id);
            if (!courseBranch) {
                openNotification('error', 'No se encontró la oferta académica');
                return;
            }

            const resp = await updateCourseBranch(id, {
                ...courseBranch,
                status, // actualizamos solo el campo necesario
            });

            if (resp.success) {
                setCourseBranches(courseBranches.map((cb) =>
                    cb.id === id ? { ...cb, status } : cb
                ));
                openNotification('success', 'Estado actualizado correctamente');
            }
        } catch (error) {
            openNotification('error', 'Error al actualizar el estado');
        }
    };


    if (loading) return <TableSkeleton rows={8} columns={['FECHAS', 'CURSO', 'PROFESOR', 'SESIONES', 'CAPACIDAD', 'COSTO', 'ESTADO']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th></th>
                            <th>FECHAS</th>
                            <th>CURSO</th>
                            <th>PROFESOR</th>
                            <th>SESIONES</th>
                            <th>CAPACIDAD</th>
                            <th>COSTO</th>
                            <th>ESTADO</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {courseBranches?.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron ofertas academicas registradas</td>
                            </tr>
                        )}
                        {courseBranches?.map((courseBranch) => {
                            const isDeleted = (courseBranch as any).deleted;
                            return (
                                <tr key={courseBranch.id} className={isDeleted ? "opacity-50 grayscale-[0.5]" : ""}>
                                    <td><ModalityTag modality={courseBranch.modality} short /></td>
                                    <td>
                                        {courseBranch.startDate ? getFormattedDate(new Date(courseBranch.startDate)) : ''} {courseBranch.endDate ? ` ~ ${getFormattedDate(new Date(courseBranch.endDate))}` : ''}
                                        {!courseBranch.startDate && !courseBranch.endDate && <OptionalInfo />}
                                    </td>
                                    <td>
                                        <span className='font-semibold'>{courseBranch.course.name}</span>
                                        {isDeleted && <span className="badge bg-danger text-xs ml-2">Eliminado</span>}
                                    </td>
                                    <td>{courseBranch.teacher.firstName} {courseBranch.teacher.lastName}</td>
                                    <td>{courseBranch.sessionCount}</td>
                                    <td>{courseBranch.capacity}</td>
                                    <td><span className='font-bold'>{formatCurrency(courseBranch.amount)}</span></td>
                                    <td>
                                        <SelectCourseBranchStatus
                                            value={courseBranch.status}
                                            onChange={(selected) => {
                                                onStatusChange(courseBranch.id, selected?.value as CourseBranchStatus);
                                            }}
                                        />
                                    </td>

                                    <td>
                                        <div className="flex items-center gap-3 justify-end">
                                            {isSuperAdmin && isDeleted ? (
                                                <Tooltip title="Restaurar">
                                                    <button onClick={() => onRestore(courseBranch.id)}>
                                                        <LuRotateCcw className="size-5 hover:text-success hover:cursor-pointer" />
                                                    </button>
                                                </Tooltip>
                                            ) : (
                                                <>
                                                    <Tooltip title="Eliminar">
                                                        <button onClick={() => onDelete(courseBranch.id)}>
                                                            <IconTrashLines className="size-5 hover:text-danger hover:cursor-pointer" />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Editar">
                                                        <Link href={`/course-branch/${courseBranch.id}`}>
                                                            <IconEdit className="size-5 hover:text-primary hover:cursor-pointer" />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Detalles">
                                                        <Link href={`/course-branch/view/${courseBranch.id}`}>
                                                            <Button size="sm" icon={<TbDetails className="size-4 rotate-90" />} />
                                                        </Link>
                                                    </Tooltip>
                                                </>
                                            )}
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
                    total={totalCourseBranches}
                    top={parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
