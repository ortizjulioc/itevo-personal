import React from 'react'
import { CourseBranchFormType } from '../form.config';
import { FormikErrors, FormikTouched } from 'formik';
import useFetchcourses, { useFetchPreRequisites } from '@/app/(defaults)/courses/lib/use-fetch-courses';
import { SearchInput } from '@/components/common';
import { useURLSearchParams } from '@/utils/hooks';
import Tooltip from '@/components/ui/tooltip';
import { TbX } from 'react-icons/tb';
import { useCourseBranch } from './course-branch-provider';
import { Course } from '@prisma/client';

interface ScheduleAssignmentProps {
  values: CourseBranchFormType;
  errors: FormikErrors<CourseBranchFormType>;
  touched: FormikTouched<CourseBranchFormType>;
  className?: string;
}


export default function PrerequisitesFields({ className, values, touched, errors }: ScheduleAssignmentProps) {
  console.log('values', values);
  const { handleAddPrerequisite, handleRemovePrerequisite, preRequisites } = useCourseBranch();
  const params = useURLSearchParams();
  console.log('params', params.get('prerequisite'));

  const { courses } = useFetchcourses(params.get('prerequisite') ? `search=${params.get('prerequisite')}` : '');




  return (
    <div className={`${className} max-w-2xl`}>
      <label className="block text-sm font-medium text-gray-700">Prerrequisitos</label>

      {/* Lista de prerrequisitos seleccionados */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {preRequisites.length === 0 && (
            <p className="text-gray-500 text-sm italic">Este curso no tiene prerrequisitos</p>
          )}
          {preRequisites.map(({ prerequisite }: { prerequisite: Course }) => (
            <span key={prerequisite.id} className="badge bg-primary text-white flex items-center">
              {prerequisite.code} {prerequisite.name}
              <button
                type="button"
                className="ml-2 text-white hover:cursor-pointer"
                onClick={() => handleRemovePrerequisite(prerequisite.id)}
              >
                <Tooltip title='Eliminar prerrequisito'>
                  <span><TbX className='' /></span>
                </Tooltip>
              </button>
            </span>
          ))}
        </div>
      </div>


      <div className='flex justify-between items-center '>
        <label className="block text-lg font-bold min-w-max">Agregar prerrequisitos</label>
        {/* Campo de búsqueda */}
        <SearchInput searchKey='prerequisite' placeholder='Buscar curso...' />
      </div>

      {/* Lista de cursos filtrados */}
      <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
        {courses.length > 0 ? (
          <ul>
            {courses.filter(
              course =>
                course.id !== values.courseId && // Excluir el curso actual
                !preRequisites.some(({ prerequisite }: { prerequisite: Course }) => prerequisite.id === course.id) // Excluir los prerrequisitos seleccionados
            )
              .map((course) => (
                <li key={course.id} className="flex justify-between items-center py-1">
                  <span className="text-sm">{course.code} {course.name}</span>
                  <button
                    type="button"
                    className="bg-primary text-white px-2 py-1 rounded-md text-xs"
                    onClick={() => handleAddPrerequisite(course)}
                  >
                    Agregar
                  </button>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No hay resultados</p>
        )}
        {
          courses.filter(
            course =>
              course.id !== values.courseId && 
              !preRequisites.some(({ prerequisite }: { prerequisite: Course }) => prerequisite.id === course.id) // Excluir los prerrequisitos seleccionados
          ).length === 0 && (
            <p className="text-gray-500 text-sm italic">No hay cursos disponibles</p>
          )
        }
      </div>
    </div >
  )
}
