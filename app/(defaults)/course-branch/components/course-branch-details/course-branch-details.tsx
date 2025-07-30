'use client'
import BranchLabel from '@/components/common/info-labels/branch-label';
import TeacherLabel from '@/components/common/info-labels/teacher-label';
import { confirmDialog, formatCurrency, openNotification } from '@/utils';
import React from 'react';
import { deleteCourseBranch } from '../../lib/request';
import { useRouter } from 'next/navigation';
import { getFormattedDate } from '@/utils/date';
import { CourseBranchWithRelations } from '@/@types/course-branch';

const modalities = {
    PRESENTIAL: 'Presencial',
    VIRTUAL: 'Virtual',
    HYBRID: 'Hibrido',
};

export default function CourseBranchDetails({ courseBranch }: { courseBranch: CourseBranchWithRelations }) {
    const router = useRouter();
    console.log('courseBranch', courseBranch);
    const onDelete = async (id: string) => {

        confirmDialog({
            title: 'Eliminar oferta academica',
            text: '¿Seguro que quieres eliminar esta oferta  academica?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
            const resp = await deleteCourseBranch(id);
            if (resp.success) {
                openNotification('success', 'oferta  academica eliminada correctamente')
                router.push('/course-branch')
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }

    return (
        <div className="grid grid-cols-1 gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            {/* Nombre del estudiante */}
            <h2 className="text-xl font-semibold text-center flex justify-center sm:text-left col-span-1 sm:col-span-2">
                <span>{courseBranch.course.name}</span>
            </h2>

            {[
                { label: "Sucursal", value: <BranchLabel branchId={courseBranch.branchId} /> },
                { label: "Profesor", value: <TeacherLabel teacherId={courseBranch.teacherId} /> },
                { label: "Monto", value: formatCurrency(courseBranch.amount) },
                { label: "Modalidad", value: modalities[courseBranch.modality as keyof typeof modalities] || "No especificado" },
                { label: "Fecha de inicio", value: courseBranch.startDate ? getFormattedDate(new Date(courseBranch.startDate)) : "No especificado" },
                { label: "Fecha de finalizacion", value: courseBranch.endDate ? getFormattedDate(new Date(courseBranch.endDate)) : "No especificado" },
                {
                    label: "Comision", value: courseBranch.commissionRate != null
                        ? `${courseBranch.commissionRate * 100} %`
                        : "N/A"
                },
                { label: "Capacidad", value: `${courseBranch.capacity} Personas` },
                { label: "Sesiones", value: courseBranch.sessionCount || "No especificado" },

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
