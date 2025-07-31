'use client'
import { formatCurrency } from '@/utils';
import React from 'react';
import { getFormattedDate } from '@/utils/date';
import { CourseBranchWithRelations } from '@/@types/course-branch';
import StatusCourseBranch from '@/components/common/info-labels/status/status-course-branch';
import { CourseBranchStatus } from '@prisma/client';
import { formatSchedule } from '@/utils/schedule';

const modalities = {
    PRESENTIAL: 'Presencial',
    VIRTUAL: 'Virtual',
    HYBRID: 'Hibrido',
};

export default function CourseBranchDetails({ courseBranch }: { courseBranch: CourseBranchWithRelations }) {
    return (
        <div className="grid grid-cols-1 gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            {/* Nombre del estudiante */}
            <h2 className="text-xl font-semibold text-center flex justify-center sm:text-left col-span-1 sm:col-span-2">
                <span>{courseBranch.course.name}</span>
            </h2>

            {[
                { label: "Sucursal", value: courseBranch.branch.name },
                { label: "Profesor", value: `${courseBranch.teacher.firstName} ${courseBranch.teacher.lastName}` },
                { label: "Modalidad", value: modalities[courseBranch.modality as keyof typeof modalities] || "No especificado" },
                { label: "Estado", value: <StatusCourseBranch status={courseBranch.status as CourseBranchStatus} /> },
                { label: "Monto", value: formatCurrency(courseBranch.amount) },
                {
                    label: "Comision", value: courseBranch.commissionRate != null
                        ? `${formatCurrency(courseBranch.commissionAmount)} (${courseBranch.commissionRate * 100} %)`
                        : "N/A"
                },
                { label: "Capacidad", value: `${courseBranch.capacity} Personas` },
                { label: "Sesiones", value: courseBranch.sessionCount || "No especificado" },
                { label: "Horario", value: formatSchedule(courseBranch.schedules) },
                { label: "Fecha de inicio", value: courseBranch.startDate ? getFormattedDate(new Date(courseBranch.startDate)) : "No especificado" },
                { label: "Fecha de finalizacion", value: courseBranch.endDate ? getFormattedDate(new Date(courseBranch.endDate)) : "No especificado" },

            ].map(({ label, value }) => (
                <div key={label} className="flex flex-col md:col-span-2">
                    <span className="font-bold">{label}</span>
                    <span className="text-gray-700 dark:text-gray-200 font-semibold break-words">{value || "No especificado"}</span>
                </div>
            ))}

            {/* <div className="grid grid-cols-1 sm:grid-cols-3 col-span-2 gap-2">
                <Tooltip title="Eliminar">
                    <Button
                        onClick={() => onDelete(courseBranch.id)}
                        variant="outline"
                        size="sm"
                        icon={<IconTrashLines className="size-4" />}
                        color="danger"
                        className="w-full"
                    >
                        Eliminar
                    </Button>
                </Tooltip>
                <Tooltip title="Editar">
                    <Link href={`/course-branch/${courseBranch.id}`} className="w-full">
                        <Button
                            variant="outline"
                            size="sm"
                            icon={<IconEdit className="size-4" />}
                            className="w-full"
                        >
                            Editar
                        </Button>
                    </Link>
                </Tooltip>
                <Tooltip title="Inscribir">
                    <Link href={`/enrollments/new?courseBranchId=${courseBranch.id}`} className="w-full">
                        <Button
                            variant="outline"
                            size="sm"
                            icon={<IconUserPlus className="size-4" />}
                            className="w-full "
                            color='success'
                        >
                            Inscribir
                        </Button>
                    </Link>
                </Tooltip>
            </div> */}
        </div>


    );
}
