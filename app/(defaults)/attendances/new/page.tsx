'use client';
import { ViewTitle } from '@/components/common';
import SelectCourseBranch from '@/components/common/selects/select-course-branch';
import DatePicker, { extractDate } from '@/components/ui/date-picker';
import React from 'react';
import useFetchEnrollments from '../../enrollments/lib/use-fetch-enrollments';
import { AttendanceStatus, Student } from '@prisma/client';
import { Select } from '@/components/ui';
import StatusAttendance from '../components/status-attendance';
import StudentLabel from '@/components/common/info-labels/student-label';
import CourseBranchDetails from '../../course-branch/components/course-branch-details/course-branch-details';
import { isCourseOnDate } from '@/utils/date';
import useFetchAttendances, { AttendanceWithStudent } from '../lib/use-fetch-attendance';
import { openNotification } from '@/utils/open-notification';
import { CourseBranch } from '../../course-branch/lib/use-fetch-course-branch';
import { createAttendance, updateAttendance } from '../lib/request';

interface AttendanceStatusOption {
  value: string;
  label: JSX.Element;
}

const statusOptions: AttendanceStatusOption[] = [
  { value: AttendanceStatus.PRESENT, label: <StatusAttendance status={AttendanceStatus.PRESENT} /> },
  { value: AttendanceStatus.ABSENT, label: <StatusAttendance status={AttendanceStatus.ABSENT} /> },
  { value: AttendanceStatus.EXCUSED, label: <StatusAttendance status={AttendanceStatus.EXCUSED} /> },
];

export default function NewAttendance() {
  const [selectedBranch, setSelectedBranch] = React.useState<CourseBranch | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const { enrollments, refetchEnrollments } = useFetchEnrollments('', { preventFirstFetch: true });
  const [students, setStudents] = React.useState<Student[]>([]);
  const { attendances, fetchAttendanceData, loading, error } = useFetchAttendances(
    `date=${extractDate(selectedDate)}&courseBranchId=${selectedBranch?.id}`
  );
  // Add state to track loading for each student
  const [loadingStudents, setLoadingStudents] = React.useState<{ [key: string]: boolean }>({});

  // Normaliza cualquier Date o string ISO a "YYYY-MM-DD"
  const toIsoDate = (isoOrDate: string | Date): string => {
    const d = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate);
    return d.toISOString().slice(0, 10); // "2025-08-20"
  };

  const onChangeBranch = (branch: CourseBranch | null) => {
    setSelectedBranch(branch);
  };

  const onChangeDate = (date: string) => {
    date && setSelectedDate(new Date(date));
  };

  const onChangeStatus = async (status: string, student: Student) => {
    if (!selectedBranch) {
      openNotification('error', 'Seleccione una oferta académica');
      return;
    }

    const data = {
      status: status as AttendanceStatus,
      studentId: student.id,
      date: extractDate(selectedDate),
      courseBranchId: selectedBranch.id,
    };

    // Set loading state for this student
    setLoadingStudents((prev) => ({ ...prev, [student.id]: true }));

    try {
      // Buscar si ya existe un attendance para este estudiante, fecha y courseBranch
      const existingAttendance = attendances?.find(
        (att: AttendanceWithStudent) =>
          att.studentId === student.id &&
          toIsoDate(att.date) === toIsoDate(extractDate(selectedDate)) &&
          att.courseBranchId === selectedBranch.id
      );

      if (existingAttendance) {
        const response = await updateAttendance(existingAttendance.id, {
          status: status as AttendanceStatus,
          courseBranchId: selectedBranch.id,
          studentId: student.id,
          date: extractDate(selectedDate),
        });

        if (response.success) {
          openNotification('success', 'Asistencia actualizada correctamente');
          fetchAttendanceData(`date=${extractDate(selectedDate)}&courseBranchId=${selectedBranch.id}`);
        } else {
          openNotification('error', response.message || 'Error al actualizar la asistencia');
        }
      } else {
        const response = await createAttendance(data);
        if (response.success) {
          openNotification('success', 'Asistencia registrada correctamente');
          fetchAttendanceData(`date=${extractDate(selectedDate)}&courseBranchId=${selectedBranch.id}`);
        } else {
          openNotification('error', response.message || 'Error al registrar la asistencia');
        }
      }
    } catch (error) {
      openNotification('error', 'Error al procesar la asistencia');
    } finally {
      // Remove loading state for this student
      setLoadingStudents((prev) => ({ ...prev, [student.id]: false }));
    }
  };

  React.useEffect(() => {
    if (selectedBranch) {
      console.log('Fetching enrollments for branch:', selectedBranch.id);
      refetchEnrollments(`courseBranchId=${selectedBranch.id}`);
    }
  }, [selectedBranch, refetchEnrollments]);

  React.useEffect(() => {
    if (enrollments) {
      const enrolledStudents = enrollments.flatMap((enrollment) => enrollment.student);
      setStudents(enrolledStudents);
    }
  }, [enrollments]);

  React.useEffect(() => {
    if (selectedBranch && !isCourseOnDate(selectedBranch.schedules || [], selectedDate)) {
      openNotification('warning', 'El curso no se imparte en la fecha seleccionada');
    }
  }, [selectedBranch, selectedDate]);

  return (
    <div>
      <ViewTitle
        className="mb-6"
        title="Registrar asistencias"
        rightComponent={
          <div className="flex gap-4 justify-end">
            <div className="md:w-96">
              <SelectCourseBranch
                value={selectedBranch?.id}
                onChange={(opt) => onChangeBranch(opt?.courseBranch as CourseBranch | null)}
              />
            </div>
            <div>
              <DatePicker
                value={selectedDate}
                placeholder="Seleccionar fecha"
                onChange={(date) => onChangeDate(extractDate(date))}
              />
            </div>
          </div>
        }
        showBackPage
      />


      <div>
        {selectedBranch ? (
          <div className="flex gap-4">
            <div className="min-w-64">
              <CourseBranchDetails courseBranch={selectedBranch} />
            </div>
            <div className="w-full">
              {loading ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 italic">Cargando asistencias...</p>
                </div>
              ) : error ? (
                <div className="text-center py-4">
                  <p className="text-sm text-red-500 italic">Error: {error}</p>
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 italic">No hay estudiantes inscritos.</p>
                </div>
              ) : (
                <div className="panel">

                  {selectedBranch && !isCourseOnDate(selectedBranch.schedules || [], selectedDate) && (
                    <div className="flex items-center p-3.5 rounded text-warning bg-warning-light dark:bg-warning-dark-light mb-2">
                      <span className="ltr:pr-2 rtl:pl-2">
                        <strong className="ltr:mr-1 rtl:ml-1">¡Atención!</strong>El curso no se imparte en la fecha seleccionada.
                      </span>
                    </div>
                  )}

                  {students.map((student) => {
                    const existingAttendance = attendances?.find(
                      (att: AttendanceWithStudent) =>
                        att.studentId === student.id &&
                        toIsoDate(att.date) === toIsoDate(extractDate(selectedDate)) &&
                        att.courseBranchId === selectedBranch.id
                    );
                    const selectedOption = existingAttendance
                      ? statusOptions.find((opt) => opt.value === existingAttendance.status)
                      : null;

                    return (
                      <div
                        key={student.id}
                        className="flex gap-6 justify-between w-full border-b pb-2 mb-2 last:mb-0 last:border-b-0 last:pb-0"
                      >
                        <StudentLabel student={student} />
                        <Select
                          className="w-64"
                          options={statusOptions}
                          value={selectedOption}
                          onChange={(newValue) => {
                            const option = newValue as AttendanceStatusOption | null;
                            if (option) {
                              onChangeStatus(option.value, student);
                            }
                          }}
                          isSearchable={false}
                          placeholder="Selecciona un estado"
                          menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                          aria-label={`Estado de asistencia para ${student.firstName} ${student.lastName}`}
                          isLoading={loadingStudents[student.id] || false} // Add loading prop
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-500 italic">Por favor seleccione una oferta académica.</p>
          </div>
        )}
      </div>
    </div>
  );
}