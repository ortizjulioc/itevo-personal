import { IconEdit, IconTrashLines, IconUserPlus } from '@/components/icon';
import { Button } from '@/components/ui';
import Tooltip from '@/components/ui/tooltip';
import { Student } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

export default function StudentDetails({ student }: { student: Student }) {

    const onDelete = (id: string) => {
        console.log('delete', id);
    };
    return (
        <div className="grid grid-cols-1 gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            {/* Nombre del estudiante */}
            <h2 className="text-xl font-semibold text-center flex justify-center sm:text-left col-span-1 sm:col-span-2">
                {student.firstName} {student.lastName}
            </h2>

            {[
                { label: "Codigo", value: student.code },
                { label: "Identificación", value: student.identification },
                { label: "Teléfono", value: student.phone },
                { label: "Correo", value: student.email },
                { label: "Dirección", value: student.address },
                { label: "Ha tomado cursos ", value: student.hasTakenCourses ? "Sí" : "No" },
            ].map(({ label, value }) => (
                <div key={label} className="flex flex-col md:col-span-2">
                    <span className="font-bold">{label}</span>
                    <span className="text-gray-700 dark:text-gray-200 font-semibold break-words">{value || "No especificado"}</span>
                </div>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-3 col-span-2 gap-2">
                <Tooltip title="Eliminar">
                    <Button
                        onClick={() => onDelete(student.id)}
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
                    <Link href={`/students/${student.id}`}   className="w-full">
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
                    <Link href={`/students/${student.id}`}   className="w-full">
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
