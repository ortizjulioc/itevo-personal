import React from 'react'
import { SearchInput } from '@/components/common';
import { useURLSearchParams } from '@/utils/hooks';
import Tooltip from '@/components/ui/tooltip';
import { TbX } from 'react-icons/tb';
import { Course } from '@prisma/client';
import useFetchcourses from '../../../lib/use-fetch-courses';
import { values } from 'lodash';

interface ScheduleAssignmentProps {
  className?: string;
  prerequisites: Course[];
  onRemove?: (id: string) => void;
  onAdd?: (course: Course) => void;
}


export default function PrerequisitesFields({ prerequisites, className, onRemove, onAdd }: ScheduleAssignmentProps) {
  const params = useURLSearchParams();
  const { courses } = useFetchcourses(params.get('prerequisite') ? `search=${params.get('prerequisite')}` : '');
  const courseWithoutPrerequisites = courses.filter(course => !prerequisites.some((prerequisite: Course) => prerequisite.id === course.id));

  return (
    <div className={`${className}`}>
      <label className="block text-lg font-bold">Prerrequisitos</label>

      {/* Lista de prerrequisitos seleccionados */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {prerequisites.length === 0 && (
            <p className="text-gray-500 text-sm italic">Este curso no tiene prerrequisitos</p>
          )}
          {prerequisites.map((prerequisite: Course) => (
            <span key={prerequisite.id} className="badge bg-primary text-white flex items-center">
              {prerequisite.code} - {prerequisite.name}
              <button
                type="button"
                className="ml-2 text-white hover:cursor-pointer"
                onClick={() => onRemove?.(prerequisite.id)}
              >
                <Tooltip title='Eliminar prerrequisito'>
                  <span><TbX className='' /></span>
                </Tooltip>
              </button>
            </span>
          ))}
        </div>
      </div>


      <div className=''>
        <SearchInput searchKey='prerequisite' placeholder='Buscar curso...' />
      </div>

      {/* Lista de cursos filtrados */}
      <div className="mt-2 border rounded-md p-2">
        {courseWithoutPrerequisites.length > 0 && (
          <ul>
            {courseWithoutPrerequisites.map((course) => (
              <li key={course.id} className="flex justify-between items-center py-1">
                <span className="text-sm">{course.code} - {course.name}</span>
                <button
                  type="button"
                  className="bg-primary text-white px-2 py-1 rounded-md text-xs"
                  onClick={() => onAdd?.(course)}
                >
                  Agregar
                </button>
              </li>
            ))}
          </ul>
        )}
        {
          courseWithoutPrerequisites.length === 0 && (
            <p className="text-gray-500 text-sm italic">No hay cursos disponibles</p>
          )
        }
      </div>
    </div >
  )
}
