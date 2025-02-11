import BranchLabel from '@/components/common/info-labels/branch-label';
import CourseLabel from '@/components/common/info-labels/course-label';
import TeacherLabel from '@/components/common/info-labels/teacher-label';
import { IconEdit, IconTrashLines, IconUserPlus } from '@/components/icon';
import { Button } from '@/components/ui';
import Tooltip from '@/components/ui/tooltip';
import { CourseBranch } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

const modalities = {
    PRESENTIAL: 'Presencial',
    VIRTUAL: 'Virtual',
    HYBRID: 'Hibrido',
  };

export default function CourseBranchDetails({ courseBranch }: { courseBranch: CourseBranch }) {

    const onDelete = (id: string) => {
        console.log('delete', id);
    };
    return (
        <div className="grid grid-cols-1 gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            {/* Nombre del estudiante */}
            <h2 className="text-xl font-semibold text-center flex justify-center sm:text-left col-span-1 sm:col-span-2">
               <CourseLabel courseId={courseBranch.courseId} />
            </h2>

            {[
                { label: "Sucursal", value: <BranchLabel branchId={courseBranch.branchId} /> },
                {label:"Profesor", value:<TeacherLabel teacherId={courseBranch.teacherId}/>},
                { label:"Monto", value:courseBranch.amount},
                {label:"Modalidad", value:modalities[courseBranch.modality]},
                {label:"Fecha de inicio", value:new Date(courseBranch.startDate).toLocaleDateString()},
                {label:"Fecha de finalizacion", value:new Date(courseBranch.endDate).toLocaleDateString()},
                { label:"Comision", value:`${courseBranch.commissionRate} %`},
                { label:"Capacidad", value:`${courseBranch.capacity} Personas`},

            ].map(({ label, value }) => (
                <div key={label} className="flex flex-col md:col-span-2">
                    <span className="font-bold">{label}</span>
                    <span className="text-gray-700 dark:text-gray-200 font-semibold break-words">{value || "No especificado"}</span>
                </div>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-3 col-span-2 gap-2">
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
                    <Link href={`/course-branch/${courseBranch.id}`}   className="w-full">
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
                    <Link href={`/enrollments/new?courseBranchId=${courseBranch.id}`}   className="w-full">
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
            </div>
        </div>


    );
}
