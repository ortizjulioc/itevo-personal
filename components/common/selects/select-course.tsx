
import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState} from 'react';
import AsyncSelect from 'react-select/async';
import { Course } from '@prisma/client';
import { Select } from '@/components/ui';
import { GroupBase } from 'react-select';

type SelectCourseType = {
  value: string;
  label: string;
}

export interface CoursesResponse {
  courses: Course[];
  totalCourses: number;
}

interface SelectCourseProps {
  value?: string;
  onChange?: (selected: SelectCourseType | null) => void;
}

export default function SelectCourse({ value, ...rest }: SelectCourseProps) {
  const [options, setOptions] = useState<SelectCourseType[]>([]);

  const fetchCourseData = async (inputValue: string): Promise<SelectCourseType[]> => {
    try {
      const response = await apiRequest.get<CoursesResponse>(`/courses?search=${inputValue}`);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data?.courses.map(course => ({ value: course.id, label: course.name })) || [];
    } catch (error) {
      console.error('Error fetching Courses data:', error);
      return [];
    }
  };

  const loadOptions = async (inputValue: string): Promise<SelectCourseType[]> => {
    // const options = await fetchCourseData(inputValue);
    // callback(options);
    return fetchCourseData(inputValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedOptions = await fetchCourseData('');
      setOptions(fetchedOptions);

      if (value && !fetchedOptions.some(option => option.value === value)) {
        try {
          const response = await apiRequest.get<Course>(`/courses/${value}`);
          if (response.success && response.data) {
            const newOption = { value: response.data.id, label: response.data.name };
            setOptions(prevOptions => [...prevOptions, newOption]);
          }
        } catch (error) {
          console.error('Error fetching single Course:', error);
        }
      }
    };

    fetchData();

  }, [value]);



  return (
    <div>
      <Select<SelectCourseType, false, GroupBase<SelectCourseType>>
        loadOptions={loadOptions}
        cacheOptions
        defaultOptions={options}
        placeholder="-Cursos-"
        noOptionsMessage={() => 'No hay opciones'}
        value={options.find((option) => option.value === value) || null}
        isClearable
        asComponent={AsyncSelect}
        {...rest}
      />
    </div>
  );
}
