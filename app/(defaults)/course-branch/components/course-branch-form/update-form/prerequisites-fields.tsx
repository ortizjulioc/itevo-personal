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


export default function PrerequisitesFields({ className }: ScheduleAssignmentProps) {
  const { preRequisites } = useCourseBranch();


  return (
    <div className={`${className} max-w-2xl`}>
      <span className="block text-lg font-bold ">Prerrequisitos:</span>

      {/* Lista de prerrequisitos seleccionados */}
      <div className="mb-4">
        <div className="">
          {preRequisites.length === 0 && (
            <p className="text-gray-500 text-sm italic">Este curso no tiene prerrequisitos</p>
          )}

          <div className=''>
            {preRequisites.map(({ prerequisite }: { prerequisite: Course }) => (
              <span key={prerequisite.id} className="block px-2 py-1 border-b border-gray-200">
                {prerequisite.code} - {prerequisite.name}
              </span>
            ))}
          </div>
        </div>
      </div>


      {/* <div className='flex justify-between items-center '>
        <label className="block text-lg font-bold min-w-max">Agregar prerrequisitos</label>
        <SearchInput searchKey='prerequisite' placeholder='Buscar curso...' />
      </div>

      <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
        {courses.length > 0 && (
          <ul>
            {courses.filter(
              course =>
                course.id !== values.courseId &&
                !preRequisites.some(({ prerequisite }: { prerequisite: Course }) => prerequisite.id === course.id)
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
      </div> */}
    </div >
  )
}
