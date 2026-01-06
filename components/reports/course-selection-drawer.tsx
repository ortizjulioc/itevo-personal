'use client';

import { useState, useEffect } from 'react';
import Drawer from '@/components/ui/drawer';
import { IconSearch, IconX } from '@/components/icon';
import Checkbox from '@/components/ui/checkbox';
import { Button } from '@/components/ui';
import { useDebounce } from 'use-debounce';

interface Course {
  id: string;
  code: string;
  name: string;
  price: number;
}

interface CourseSelectionDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedCourses: Course[];
  onSelectionChange: (courses: Course[]) => void;
}

const CourseSelectionDrawer = ({ open, onClose, selectedCourses, onSelectionChange }: CourseSelectionDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/courses?search=${debouncedSearchTerm}&top=20`);
        const data = await response.json();
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchCourses();
    }
  }, [debouncedSearchTerm, open]);

  const handleToggleCourse = (course: Course) => {
    const isSelected = selectedCourses.some((c) => c.id === course.id);
    let newSelection;
    if (isSelected) {
      newSelection = selectedCourses.filter((c) => c.id !== course.id);
    } else {
      newSelection = [...selectedCourses, course];
    }
    onSelectionChange(newSelection);
  };

  const isSelected = (courseId: string) => {
    return selectedCourses.some((c) => c.id === courseId);
  };

  return (
    <Drawer open={open} onClose={onClose} title="Seleccionar Cursos">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              type="search"
              placeholder="Buscar cursos..."
              className="form-input ltr:pl-9 rtl:pr-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 text-gray-500">
              <IconSearch />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <span className="animate-spin border-4 border-primary border-l-transparent rounded-full w-8 h-8 inline-block align-middle m-auto"></span>
            </div>
          ) : courses.length > 0 ? (
            <div className="space-y-2">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isSelected(course.id)
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  onClick={() => handleToggleCourse(course)}
                >
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected(course.id)}
                      onChange={() => handleToggleCourse(course)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{course.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Código: {course.code}
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs">
                      {/* <span className="font-medium text-primary">RD${course.price.toFixed(2)}</span> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No se encontraron cursos
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">
              {selectedCourses.length} curso{selectedCourses.length !== 1 ? 's' : ''} seleccionado{selectedCourses.length !== 1 ? 's' : ''}
            </span>
            {selectedCourses.length > 0 && (
              <button
                type="button"
                className="text-xs text-danger hover:underline"
                onClick={() => onSelectionChange([])}
              >
                Limpiar todo
              </button>
            )}
          </div>
          <Button className="w-full" onClick={onClose}>
            Confirmar Selección
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default CourseSelectionDrawer;
