'use client'
import { IconEdit, IconTrashLines, IconUserPlus } from '@/components/icon';
import { Button } from '@/components/ui';
import Tooltip from '@/components/ui/tooltip';
import { confirmDialog, formatIdentification, formatPhoneNumber, getInitials, openNotification } from '@/utils';
import { IdentificationType, Student } from '@prisma/client';
import Link from 'next/link';
import React from 'react';
import { deleteStudent } from '../../lib/request';
import { useRouter } from 'next/navigation';
import OptionalInfo from '@/components/common/optional-info';
import Avatar from '@/components/common/Avatar';

const mapIdentificationType: Record<string, string> = {
    CEDULA: 'Cédula',
    PASAPORTE: 'Pasaporte',
    OTRO: 'Otro',
};

export default function StudentDetails({ student }: { student: Student }) {
    const router = useRouter()
    const onDelete = async (id: string) => {
        confirmDialog({
            title: 'Eliminar Estudiante',
            text: '¿Seguro que quieres eliminar este Estudiante?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
            const resp = await deleteStudent(id);
            if (resp.success) {
                openNotification('success', 'estudiante eliminado correctamente');
                router.push('/students')
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }

    console.log(student);

    return (
        <div className="panel grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1">
            <div className='flex flex-col items-center text-center gap-2 sm:col-span-2 md:col-span-1'>
                <Avatar initials={getInitials(student.firstName, student.lastName)} />
                <h2 className="text-xl font-semibold">
                    {student.firstName} {student.lastName}
                </h2>
            </div>

            <div className="flex flex-col">
                <span className="font-bold">Código</span>
                <span className="text-gray-700 dark:text-gray-200 font-semibold break-words">{student.code}</span>
            </div>

            <div className="flex flex-col">
                <span className="font-bold">Tipo de identificación</span>
                <OptionalInfo content={student.identificationType ? mapIdentificationType[student.identificationType] : undefined} />
            </div>

            <div className="flex flex-col">
                <span className="font-bold">Identificación</span>
                <OptionalInfo content={formatIdentification(student.identification || '', student.identificationType as IdentificationType)} />
            </div>

            <div className="flex flex-col">
                <span className="font-bold">Teléfono(s)</span>
                {student.phone ? student.phone.split(',').map((phone, index) => (
                  <span key={index} className="block min-w-max">
                    {formatPhoneNumber(phone.trim())}
                  </span>
                )) : (
                  <OptionalInfo />
                )}
            </div>

            <div className="flex flex-col">
                <span className="font-bold">Correo</span>
                <OptionalInfo content={student.email || ''} />
            </div>

            <div className="flex flex-col">
                <span className="font-bold">Dirección</span>
                <OptionalInfo content={student.address || ''} />
            </div>

            <div className="flex flex-col">
                <span className="font-bold">Ha tomado cursos</span>
                <span className="text-gray-700 dark:text-gray-200 font-semibold break-words">{student.hasTakenCourses ? "Sí" : "No"}</span>
            </div>
        </div>


    );
}
