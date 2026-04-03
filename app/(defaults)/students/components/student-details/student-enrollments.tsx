'use client';
import { useState } from 'react';
import { openNotification, queryStringToObject } from '@/utils';

import Skeleton from '@/components/common/Skeleton';
import CourseBranchLabel from '@/components/common/info-labels/course-branch-label';
import { ENROLLMENT_STATUS } from '@/constants/enrollment.status.constant';
import useFetchEnrollments from '@/app/(defaults)/enrollments/lib/use-fetch-enrollments';
import { Pagination } from '@/components/ui';
import { getFormattedDate } from '@/utils/date';
import StatusEnrollment, { EnrollmentStatus } from '@/components/common/info-labels/status/status-enrollment';
import SelectEnrollmentStatus from '@/app/(defaults)/enrollments/components/enrollment-list/select-status';
import { updateEnrollment } from '@/app/(defaults)/enrollments/lib/request';
import EnrollmentNotesDrawer from '@/components/common/drawers/enrollment-notes-drawer';
import { IconNotes } from '@/components/icon';

interface Props {
    className?: string;
    query?: string;
}

export default function StudentEnrollments({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, enrollments, totalEnrollments, setEnrollments } = useFetchEnrollments(query);
    const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState<any | null>(null);

    if (error) {
        openNotification('error', error);
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

    const openNotesDrawer = (enrollment: any) => {
        setSelectedEnrollment(enrollment);
        setNotesDrawerOpen(true);
    };

    const handleNotesSaved = (savedNotes: string) => {
        if (enrollments && selectedEnrollment) {
            setEnrollments(enrollments.map((e) => (e.id === selectedEnrollment.id ? { ...e, notes: savedNotes } : e)));
        }
    };

    if (loading) return <Skeleton rows={3} columns={['OFERTA ACADEMICA', 'FECHA DE INSCRIPCION', 'ESTADO', 'NOTAS']} />;

    return (
        <div className="col-span-2">
            <h1 className="mb-3 text-2xl font-semibold dark:text-white-light">Inscripciones</h1>
            <div className="table-responsive panel mb-5 overflow-hidden border-0 p-0">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>OFERTA ACADEMICA</th>
                            <th>FECHA DE INSCRIPCION</th>
                            <th>ESTADO</th>
                            <th>NOTAS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollments?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center italic text-gray-500 dark:text-gray-600">
                                    No se encontraron Inscripciones registradas
                                </td>
                            </tr>
                        )}
                        {enrollments?.map((enrollment) => {
                            return (
                                <tr key={enrollment.id}>
                                    <td>
                                        <CourseBranchLabel CourseBranchId={enrollment.courseBranchId} />
                                    </td>
                                    <td>{getFormattedDate(new Date(enrollment.enrollmentDate))}</td>
                                    <td>
                                        <SelectEnrollmentStatus
                                            value={enrollment.status}
                                            onChange={(selected) => {
                                                onStatusChange(enrollment.id, selected?.value as EnrollmentStatus);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className={`rounded-full p-2 transition-colors ${
                                                enrollment.notes ? 'text-primary hover:bg-primary/10' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                            onClick={() => openNotesDrawer(enrollment)}
                                            title={enrollment.notes ? 'Ver/Editar notas' : 'Agregar notas'}
                                        >
                                            <IconNotes className="h-5 w-5" />
                                        </button>
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

            <EnrollmentNotesDrawer
                isOpen={notesDrawerOpen}
                onClose={() => {
                    setNotesDrawerOpen(false);
                    setSelectedEnrollment(null);
                }}
                enrollment={selectedEnrollment}
                onSuccess={handleNotesSaved}
            />
        </div>
    );
}
