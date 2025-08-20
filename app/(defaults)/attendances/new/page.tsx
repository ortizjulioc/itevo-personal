'use client'
import { ViewTitle } from '@/components/common'
import SelectCourseBranch from '@/components/common/selects/select-course-branch'
import DatePicker, { extractDate } from '@/components/ui/date-picker'
import React from 'react'
import useFetchEnrollments from '../../enrollments/lib/use-fetch-enrollments'
import { CourseBranch } from '../../course-branch/lib/use-fetch-course-branch'
import { AttendanceStatus, Student } from '@prisma/client'
import { Select } from '@/components/ui'
import StatusAttendance from '../components/status-attendance'
import StudentLabel from '@/components/common/info-labels/student-label'
import CourseBranchDetails from '../../course-branch/components/course-branch-details/course-branch-details'
import { isCourseOnDate } from '@/utils/date'

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
  const [selectedBranch, setSelectedBranch] = React.useState<CourseBranch | null>(null)
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const { enrollments, refetchEnrollments } = useFetchEnrollments('', { preventFirstFetch: true })
  const [students, setStudents] = React.useState<Student[]>([])
  console.log('enrollments', enrollments)
  console.log('selectedBranch', selectedBranch)
  const onChangeBranch = (branch: CourseBranch | null) => {
    setSelectedBranch(branch)
  }

  const onChangeDate = (date: string) => {
    date && setSelectedDate(new Date(date))
  }

  React.useEffect(() => {
    if (selectedBranch) {
      console.log('Fetching enrollments for branch:', selectedBranch.id)
      refetchEnrollments(`courseBranchId=${selectedBranch.id}`)
    }
  }, [selectedBranch, refetchEnrollments])

  // TODO: usar esta funcion para mostrar mensaje de si el curso se imparte en la fecha seleccionada
  console.log('Is course on date:', isCourseOnDate(selectedBranch?.schedules || [], selectedDate))
  
  React.useEffect(() => {
    if (enrollments) {
      const enrolledStudents = enrollments.flatMap(enrollment => enrollment.student);
      setStudents(enrolledStudents);
    }
  }, [enrollments])


  return (
    <div>
      <ViewTitle
        className="mb-6"
        title="Registrar asistencias"
        rightComponent={<>
          <div className='flex gap-4 justify-end'>
            <div className='md:w-96'>
              <SelectCourseBranch value={selectedBranch?.id} onChange={(opt) => onChangeBranch(opt?.courseBranch as CourseBranch | null)} />
            </div>
            <div className=''>
              <DatePicker
                value={selectedDate}
                placeholder='Seleccionar fecha'
                onChange={(date) => onChangeDate(extractDate(date))}
              />
            </div>
          </div>
        </>}
        showBackPage
      />

      <div className="">
        {selectedBranch ? (
          <>
            <div className='flex gap-4'>
              <div className='min-w-64'>
                <CourseBranchDetails courseBranch={selectedBranch} />
              </div>
              <div className='w-full'>
                {students.length === 0 ? (
                  <div className='text-center py-4'>
                    <p className='text-sm text-gray-500 italic'>No hay estudiantes inscritos.</p>
                  </div>
                ) : (
                  <div className="panel">
                    {students.map((student) => (
                      <div key={student.id} className='flex gap-6 justify-between w-full border-b pb-2 mb-2 last:mb-0 last:border-b-0 last:pb-0'>
                        <StudentLabel student={student} />
                        <Select
                          className='w-64'
                          options={statusOptions}
                          onChange={(newValue, _actionMeta) => {
                            const option = newValue as AttendanceStatusOption | null;
                            console.log('Selected status option:', option);
                          }}
                          isSearchable={false}
                          placeholder="Selecciona un estado"
                          menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* <table className="table-hover">
                <thead>
                  <tr>
                    <th>COD.</th>
                    <th>ESTUDIANTE</th>
                    <th>ASISTENCIA</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    return (
                      <tr key={student.id}>
                        <td>{student.code}</td>
                        <td>
                          <div className="whitespace-nowrap">{student.firstName} {student.lastName}</div>
                        </td>
                        <td>
                          <div>
                            <Select
                              className='w-40'
                              options={statusOptions}
                              onChange={(newValue, _actionMeta) => {
                                const option = newValue as AttendanceStatusOption | null;
                                console.log('Selected status option:', option);
                              }}
                              isSearchable={false}
                              placeholder="Selecciona un estado"
                              menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table> */}
            </div>
          </>
        ) : (
          <div className='mb-4 text-center'>
            <p className='text-sm text-gray-500 italic'>Por favor seleccione una oferta académica.</p>
          </div>
        )}
      </div>
    </div>
  )
}
