import React from 'react'
import { CourseBranchFormType } from '../form.config';
import { FormikErrors, FormikTouched } from 'formik';
import { useParams } from 'next/navigation';
import { useFetchScheduleByCourseId } from '@/app/(defaults)/schedules/lib/use-fetch-schedules';
import { convertTimeFrom24To12Format, getClassSessions, getFormattedDate, getHoursDifferenceText } from '@/utils/date';
import PromotionLabel from '@/components/common/info-labels/promotion-label';
import CourseLabel from '@/components/common/info-labels/course-label';
import BranchLabel from '@/components/common/info-labels/branch-label';
import TeacherLabel from '@/components/common/info-labels/teacher-label';
import useFetchHolidays from '@/app/(defaults)/holidays/lib/use-fetch-holidays';
import { useURLSearchParams } from '@/utils/hooks';
import useFetchcourses from '@/app/(defaults)/courses/lib/use-fetch-courses';
import { useCourseBranch } from './course-branch-provider';
import { Course } from '@prisma/client';

interface ConfirmationFieldsProps {
  values: CourseBranchFormType;
  errors: FormikErrors<CourseBranchFormType>;
  touched: FormikTouched<CourseBranchFormType>;
  onChangeTab: (number: number) => void;
  className?: string;
}

const data = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  promotionId: "promo-001",
  branchId: "branch-001",
  teacherId: "teacher-001",
  courseId: "course-001",
  amount: 200.0,
  modality: "Presencial", // Opciones: "Presencial", "Virtual", "Híbrido"
  startDate: new Date("2023-09-01T09:00:00.000Z"),
  endDate: new Date("2023-12-31T17:00:00.000Z"),
  commissionRate: 15.0,
  capacity: 40,
  sessionCount: 20,
  status: "ACTIVE", // Ejemplo: "ACTIVE", "INACTIVE", "DRAFT"
  schedules: [
    { day: "Lunes", startTime: "09:00", endTime: "11:00" },
    { day: "Miércoles", startTime: "09:00", endTime: "11:00" }
  ],
  // Los arreglos siguientes se pueden dejar vacíos para efectos de prueba:
  enrollment: [],
  accountReceivable: [],
  accountPayable: []
};

const weekdayNames = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

export default function ConfirmationFields({ values, className, onChangeTab }: ConfirmationFieldsProps) {

  const { id } = useParams();
  const courseBranchId = Array.isArray(id) ? id[0] : id;
  const { schedules: courseSchedules } = useFetchScheduleByCourseId(courseBranchId);
  const { holidays } = useFetchHolidays('top=365')
  const params = useURLSearchParams();
  const { courses } = useFetchcourses(params.get('prerequisite') ? `search=${params.get('prerequisite')}` : '');
  const { handleAddPrerequisite, handleRemovePrerequisite, preRequisites } = useCourseBranch();


  return (
    <div className={className}>
      <div className="max-w-3xl p-6">
        {/* <h2 className="text-2xl font-bold mb-4">Revisión y Confirmación</h2> */}

        {/* Sección: Datos Generales */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b pb-2 mb-2">Datos Generales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-600">Promoción:</p>
              <p className="text-gray-800"><PromotionLabel promotionId={values.promotionId} /></p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Curso:</p>
              <p className="text-gray-800"><CourseLabel courseId={values.courseId} /></p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Sucursal:</p>
              <p className="text-gray-800"><BranchLabel branchId={values.branchId} /></p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Profesor:</p>
              <p className="text-gray-800"><TeacherLabel teacherId={values.teacherId} /></p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Estado:</p>
              <p className="text-gray-800">{values.status}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Capacidad:</p>
              <p className="text-gray-800">{values.capacity}</p>
            </div>
          </div>
          <button type='button' onClick={() => onChangeTab(0)} className="mt-2 text-blue-600 hover:underline">
            Editar Datos Generales
          </button>
        </div>

        {/* Sección: Modalidad y Horarios */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b pb-2 mb-2">Modalidad y Horarios</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-600">Modalidad:</p>
              <p className="text-gray-800">{values.modality}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Sesiones:</p>
              <p className="text-gray-800">
                {
                  getClassSessions(
                    values.startDate || new Date(),
                    values.endDate || new Date(),
                    courseSchedules,
                    holidays
                  ).count
                }
              </p>
              <p className="text-xs text-gray-500 italic mt-1">
                Las sesiones se calculan automáticamente según las fechas del curso, los horarios y los días feriados.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Fecha de Inicio:</p>
              <p className="text-gray-800">{values?.startDate ? getFormattedDate(values.startDate) : ''}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Fecha de Fin:</p>
              <p className="text-gray-800">{values?.endDate ? getFormattedDate(values.endDate) : ''}</p>
            </div>
          </div>
          {courseSchedules && courseSchedules.length > 0 && (
            <div className="mt-4">
              <p className="font-medium text-gray-600">Horarios:</p>
              <ul className="list-disc ml-6 text-gray-800">
                {courseSchedules.map((schedule, index) => (
                  <li key={index}>
                    {weekdayNames[schedule.weekday]}: {convertTimeFrom24To12Format(schedule.startTime)} - {convertTimeFrom24To12Format(schedule.endTime)} ({getHoursDifferenceText(schedule.startTime, schedule.endTime)})
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button type='button' onClick={() => onChangeTab(1)} className="mt-2 text-blue-600 hover:underline">
            Editar Modalidad y Horarios
          </button>
        </div>

        {/* Sección: Configuración de Prerequisitos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b pb-2 mb-2">Prerrequisitos</h3>
          <div className="grid grid-cols-2 gap-4">
            {courses.length > 0 && (
              <ul>
                {courses.filter(
                  course =>
                    course.id !== values.courseId && // Excluir el curso actual
                    !preRequisites.some(({ prerequisite }: { prerequisite: Course }) => prerequisite.id === course.id) // Excluir los prerrequisitos seleccionados
                )
                  .map((course) => (
                    <li key={course.id} className="flex justify-between items-center py-1">
                      <span className="text-sm">{course.code} {course.name}</span>
                      
                    </li>
                  ))}
              </ul>
            )}
            {
              courses.filter(
                course =>
                  course.id !== values.courseId &&
                  !preRequisites.some(({ prerequisite }: { prerequisite: Course }) => prerequisite.id === course.id) // Excluir los prerrequisitos seleccionados
              ).length === 0 && (
                <p className="text-gray-500 text-sm italic">No hay Prerrequisitos</p>
              )
            }
          </div>
          <button type='button' onClick={() => onChangeTab(2)} className="mt-2 text-blue-600 hover:underline">
            Editar Prerrequistos
          </button>
        </div>
        {/* Sección: Configuración Financiera */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b pb-2 mb-2">Configuración Financiera</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-600">Monto:</p>
              <p className="text-gray-800">RD${values?.amount}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Comisión:</p>
              <p className="text-gray-800">{values.commissionRate * 100}%</p>
            </div>
          </div>
          <button type='button' onClick={() => onChangeTab(3)} className="mt-2 text-blue-600 hover:underline">
            Editar Configuración Financiera
          </button>
        </div>
      </div>
    </div>
  )
}
