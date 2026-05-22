'use client';
import React from 'react';
import { confirmDialog, formatCurrency, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination, Select } from "@/components/ui";
import { IconClock, IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import PremiumTooltip from "@/components/ui/premium-tooltip";
import Link from "next/link";
import TableSkeleton from "@/components/common/Skeleton";
import useFetchCourseBranch from "../../lib/use-fetch-course-branch";
import { deleteCourseBranch, updateCourseBranch } from "../../lib/request";
import { TbDetails } from "react-icons/tb";
import { getFormattedDate, convertTimeFrom24To12Format } from "@/utils/date";
import ModalityTag from "../modality";
import StatusCourseBranch from "@/components/common/info-labels/status/status-course-branch";
import { CourseBranchStatus, EnrollmentStatus } from '@/generated/prisma/client';
import SelectCourseBranchStatus from "./select-status";
import OptionalInfo from "@/components/common/optional-info";
import { useSession } from "next-auth/react";
import { restoreCourseBranch } from "../../lib/request";
import { LuRotateCcw } from "react-icons/lu";
import { SUPER_ADMIN } from "@/constants/role.constant";
import { weekdaysMap } from "@/utils/schedule";



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


    if (loading) return <TableSkeleton rows={8} columns={['CURSO / DETALLES', 'PROFESOR', 'SESIONES', 'INSCRITOS', 'COSTO', 'ESTADO']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>CURSO / DETALLES</th>
                            <th>PROFESOR</th>
                            <th>SESIONES</th>
                            <th>INSCRITOS</th>
                            <th>COSTO</th>
                            <th>ESTADO</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {courseBranches?.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron ofertas academicas registradas</td>
                            </tr>
                        )}
                        {courseBranches?.map((courseBranch) => {
                            const isDeleted = (courseBranch as any).deleted;
                            return (
                                <tr key={courseBranch.id} className={isDeleted ? "opacity-50 grayscale-[0.5]" : ""}>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <ModalityTag modality={courseBranch.modality} short />
                                            <span className='font-semibold text-base'>{courseBranch.course.name}</span>
                                            {isDeleted && <span className="badge bg-danger text-xs ml-2">Eliminado</span>}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                                            <span className="font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                {courseBranch.startDate ? getFormattedDate(new Date(courseBranch.startDate)) : ''} {courseBranch.endDate ? ` ~ ${getFormattedDate(new Date(courseBranch.endDate))}` : ''}
                                                {!courseBranch.startDate && !courseBranch.endDate && <OptionalInfo />}
                                            </span>
                                            <span className="text-slate-300 dark:text-slate-600">|</span>
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {courseBranch.schedules && courseBranch.schedules.length > 0 ? (
                                                    <>
                                                        <IconClock className="size-3.5 text-primary shrink-0 mr-0.5" />
                                                        {courseBranch.schedules.map((sch, i) => (
                                                            <span key={i} className="inline-block px-2 py-0.5 text-[11px] font-bold rounded bg-primary/15 text-primary dark:bg-primary/25 border border-primary/30 dark:border-primary/40 whitespace-nowrap shadow-sm hover:scale-[1.02] transition-transform duration-200">
                                                                {weekdaysMap[sch.weekday]?.substring(0, 3)}: {convertTimeFrom24To12Format(sch.startTime)} - {convertTimeFrom24To12Format(sch.endTime)}
                                                            </span>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500 italic text-[11px]">Sin horario</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{courseBranch.teacher.firstName} {courseBranch.teacher.lastName}</td>
                                    <td>{courseBranch.sessionCount}</td>
                                    <td>
                                        {(() => {
                                            const enrollments = (courseBranch as any).enrollment || [];
                                            const total = enrollments.length;
                                            const counts = enrollments.reduce((acc: Record<string, number>, e: any) => {
                                                acc[e.status] = (acc[e.status] || 0) + 1;
                                                return acc;
                                            }, {} as Record<string, number>);

                                            const statusMapping = [
                                                { label: 'En espera', key: 'WAITING', color: 'text-orange-400' },
                                                { label: 'Confirmados', key: 'CONFIRMED', color: 'text-blue-400' },
                                                { label: 'Inscritos', key: 'ENROLLED', color: 'text-indigo-400' },
                                                { label: 'Completados', key: 'COMPLETED', color: 'text-green-400' },
                                                { label: 'Abandonados', key: 'ABANDONED', color: 'text-red-400' },
                                            ];

                                            const tooltipContent = (
                                                <div className="text-xs p-2 space-y-1 text-left min-w-[150px]">
                                                    <p className="font-bold border-b border-slate-700 pb-1 mb-1.5 text-white">Estado de Inscripciones</p>
                                                    {statusMapping.map(({ label, key, color }) => (
                                                        <div key={key} className="flex justify-between gap-4 text-slate-300">
                                                            <span>{label}:</span>
                                                            <span className={`font-semibold ${color}`}>{counts[key] || 0}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            );

                                            return (
                                                <PremiumTooltip content={tooltipContent} placement="top">
                                                    <div className="cursor-help flex flex-col items-center">
                                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                                            {total} <span className="text-slate-400 font-normal">/ {courseBranch.capacity}</span>
                                                        </span>
                                                        {courseBranch.capacity > 0 && (
                                                            <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                                                                <div 
                                                                    className={`h-full rounded-full ${
                                                                        total >= courseBranch.capacity 
                                                                            ? 'bg-red-500' 
                                                                            : total >= courseBranch.capacity * 0.8 
                                                                                ? 'bg-orange-500' 
                                                                                : 'bg-emerald-500'
                                                                    }`}
                                                                    style={{ width: `${Math.min(100, (total / courseBranch.capacity) * 100)}%` }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </PremiumTooltip>
                                            );
                                        })()}
                                    </td>
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
