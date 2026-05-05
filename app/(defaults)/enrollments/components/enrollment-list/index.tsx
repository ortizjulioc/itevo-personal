'use client';
import { confirmDialog, openNotification, queryStringToObject } from '@/utils';
import { Pagination } from '@/components/ui';
import { IconEdit, IconPrinter, IconTrashLines, IconNotes } from '@/components/icon';
import Tooltip from '@/components/ui/tooltip';
import Link from 'next/link';
import Skeleton from '@/components/common/Skeleton';
import { deleteEnrollment, updateEnrollment } from '../../lib/request';
import { getFormattedDate } from '@/utils/date';
import SelectEnrollmentStatus from './select-status';
import { EnrollmentStatus } from '@/generated/prisma/client';
import { formatScheduleList } from '@/utils/schedule';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { restoreEnrollment } from '../../lib/request';
import { LuRotateCcw } from "react-icons/lu";
import { SUPER_ADMIN } from '@/constants/role.constant';

import PrintEnrollmentModal from '@/components/common/print/print-enrollment-modal';
import { EnrollmentWithRelations } from '@/@types/enrollment';
import EnrollmentNotesDrawer from '@/components/common/drawers/enrollment-notes-drawer';
import { IoIosMore } from 'react-icons/io';
import { Button } from '@/components/ui';

interface Props {
    className?: string;
    query?: string;
    enrollments: EnrollmentWithRelations[];
    totalEnrollments: number;
    loading: boolean;
    error: string | null;
    setEnrollments: React.Dispatch<React.SetStateAction<EnrollmentWithRelations[]>>;
    refetchEnrollments: (query: string) => Promise<void>;
}

export default function EnrollmentList({ className, query = '', enrollments, totalEnrollments, loading, error, setEnrollments, refetchEnrollments }: Props) {
    const params = queryStringToObject(query);
    const { data: session } = useSession();
    const isSuperAdmin = session?.user?.roles?.some((role: any) => role.normalizedName === SUPER_ADMIN);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [printModal, setPrintModal] = useState<{ open: boolean; enrollmentId: string; courseBranchId: string }>({
        open: false,
        enrollmentId: '',
        courseBranchId: '',
    });
    const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithRelations | null>(null);

    if (error) {
        openNotification('error', error);
    }

    const onDelete = async (id: string) => {
        confirmDialog(
            {
                title: 'Eliminar inscripcion',
                text: '¿Seguro que quieres eliminar esta inscripcion?',
                confirmButtonText: 'Sí, eliminar',
                icon: 'error',
            },
            async () => {
                const resp = await deleteEnrollment(id);
                if (resp.success) {
                    setEnrollments(enrollments?.filter((enrollment) => enrollment.id !== id));
                    openNotification('success', 'inscripcion eliminado correctamente');
                    return;
                } else {
                    openNotification('error', resp.message);
                }
            }
        );
    };

    const onRestore = async (id: string) => {
        confirmDialog({
            title: 'Restaurar inscripción',
            text: '¿Quieres restaurar esta inscripción?',
            confirmButtonText: 'Sí, restaurar',
            icon: 'info'
        }, async () => {
            const resp = await restoreEnrollment(id);
            if (resp.success) {
                openNotification('success', 'Inscripción restaurada correctamente');
                refetchEnrollments(query);
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }

    const onStatusChange = async (id: string, status: EnrollmentStatus) => {
        try {
            const enrollment = enrollments?.find((cb) => cb.id === id);
            if (!enrollment) {
                openNotification('error', 'No se encontró la oferta académica');
                return;
            }

            const resp = await updateEnrollment(id, {
                ...enrollment,
                status, // actualizamos solo el campo necesario
            });

            if (resp.success) {
                setEnrollments(enrollments.map((cb) => (cb.id === id ? { ...cb, status } : cb)));
                openNotification('success', 'Estado actualizado correctamente');
            }
        } catch (error) {
            openNotification('error', 'Error al actualizar el estado');
        }
    };

    const openNotesDrawer = (enrollment: EnrollmentWithRelations) => {
        setSelectedEnrollment(enrollment);
        setNotesDrawerOpen(true);
    };

    const handleNotesSaved = (savedNotes: string) => {
        if (enrollments && selectedEnrollment) {
            setEnrollments(enrollments.map((e) => (e.id === selectedEnrollment.id ? { ...e, notes: savedNotes } : e)));
        }
    };

    if (loading) return <Skeleton rows={6} columns={['FECHA', 'ESTUDIANTE', 'CURSO', 'PROFESOR', 'HORARIO', 'ESTADO', 'ACCIONES']} />;
    return (
        <div className={className}>
            <div className="table-responsive panel mb-5 border-0 p-0 ">
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
                                <td colSpan={7} className="text-center italic text-gray-500 dark:text-gray-600">
                                    No se encontraron Inscripciones registradas
                                </td>
                            </tr>
                        )}
                        {enrollments?.map((enrollment) => {
                            const isDeleted = (enrollment as any).deleted;
                            return (
                                <tr key={enrollment.id} className={isDeleted ? "opacity-50 grayscale-[0.5]" : ""}>
                                    <td>{getFormattedDate(new Date(enrollment.enrollmentDate))}</td>
                                    <td>
                                        <span className="">{`${enrollment.student.code} - ${enrollment.student.firstName} ${enrollment.student.lastName}`}</span>
                                    </td>
                                    <td>
                                        {enrollment.courseBranch.course.name}
                                        {isDeleted && <span className="badge bg-danger text-xs ml-2">Eliminado</span>}
                                    </td>
                                    <td>
                                        {enrollment.courseBranch.teacher.firstName} {enrollment.courseBranch.teacher.lastName}
                                    </td>
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
                                        <div className="flex items-center justify-end gap-3">
                                            {isSuperAdmin && isDeleted ? (
                                                <Tooltip title="Restaurar">
                                                    <Button
                                                        onClick={() => onRestore(enrollment.id)}
                                                        variant="outline"
                                                        size="sm"
                                                        color="success"
                                                        icon={<LuRotateCcw className="text-lg" />}
                                                    />
                                                </Tooltip>
                                            ) : (
                                                <>
                                                    <div className="relative inline-block text-left">
                                                        <button
                                                            className="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenDropdownId((prev) => (prev === enrollment.id ? null : enrollment.id));
                                                            }}
                                                        >
                                                            <div className="relative">
                                                                <IoIosMore className="rotate-90 text-xl" />
                                                                {enrollment.notes && (
                                                                    <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
                                                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                                                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary"></span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </button>

                                                        {openDropdownId === enrollment.id && (
                                                            <div
                                                                className="fixed right-4 z-50 mt-2 w-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-black"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <div className="py-1">
                                                                    <Button
                                                                        onClick={() => {
                                                                            openNotesDrawer(enrollment);
                                                                            setOpenDropdownId(null);
                                                                        }}
                                                                        className={`flex w-full items-start justify-start border-none bg-white text-sm shadow-none hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-800 ${
                                                                            enrollment.notes ? 'text-primary' : 'text-gray-500'
                                                                        }`}
                                                                        icon={<IconNotes className="h-5 w-5" />}
                                                                    >
                                                                        {enrollment.notes ? 'Ver/Editar notas' : 'Agregar notas'}
                                                                    </Button>

                                                                    <Button
                                                                        onClick={() => {
                                                                            onDelete(enrollment.id);
                                                                            setOpenDropdownId(null);
                                                                        }}
                                                                        className="flex w-full items-start justify-start border-none bg-white text-sm text-red-600 shadow-none hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-800"
                                                                        icon={<IconTrashLines className="size-5" />}
                                                                    >
                                                                        Eliminar
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <Tooltip title="Imprimir">
                                                        <button onClick={() => setPrintModal({ open: true, enrollmentId: enrollment.id, courseBranchId: enrollment.courseBranchId })}>
                                                            <IconPrinter className="size-5 hover:cursor-pointer hover:text-primary" />
                                                        </button>
                                                    </Tooltip>

                                                    <Tooltip title="Editar">
                                                        <Link href={`/enrollments/${enrollment.id}`}>
                                                            <IconEdit className="size-5 hover:cursor-pointer hover:text-primary" />
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
                <Pagination currentPage={parseInt(params?.page || '1')} total={totalEnrollments} top={parseInt(params?.top || '10')} />
            </div>

            {printModal.open && (
                <PrintEnrollmentModal
                    modal={printModal.open}
                    setModal={(val) => setPrintModal((prev) => ({ ...prev, open: val }))}
                    enrollmentId={printModal.enrollmentId}
                    courseBranchId={printModal.courseBranchId}
                />
            )}

            <EnrollmentNotesDrawer
                isOpen={notesDrawerOpen}
                onClose={() => setNotesDrawerOpen(false)}
                enrollment={selectedEnrollment}
                onSuccess={handleNotesSaved}
            />
        </div>
    );
}
