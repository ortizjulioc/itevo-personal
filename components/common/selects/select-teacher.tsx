
import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState} from 'react';
import AsyncSelect from 'react-select/async';
import { Teacher } from '@prisma/client';
import { Select } from '@/components/ui';

interface TeacherSelect {
  value: string;
  label: string;
}

export interface TeachersResponse {
  teachers: Teacher[];
  totalTeachers: number;
}

interface SelectTeacherProps {
  value?: string;
  onChange?: (selected: TeacherSelect | null) => void;
}

export default function SelectTeacher({ value, ...rest }: SelectTeacherProps) {
  const [options, setOptions] = useState<TeacherSelect[]>([]);

  const fetchTeacherData = async (inputValue: string): Promise<TeacherSelect[]> => {
    try {
      const response = await apiRequest.get<TeachersResponse>(`/teachers?search=${inputValue}`);
      if (!response.success) {
        throw new Error(response.message);
      }
      console.log('response:', response.data?.teachers);
      return response.data?.teachers.map(teacher => ({ value: teacher.id, label: `${teacher.firstName} ${teacher.lastName}` })) || [];
    } catch (error) {
      console.error('Error fetching Teachers data:', error);
      return [];
    }
  };

  const loadOptions = async (inputValue: string, callback: (options: TeacherSelect[]) => void) => {
    const options = await fetchTeacherData(inputValue);
    callback(options);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedOptions = await fetchTeacherData('');
      setOptions(fetchedOptions);

      if (value && !fetchedOptions.some(option => option.value === value)) {
        try {
          const response = await apiRequest.get<Teacher>(`/teachers/${value}`);
          if (response.success && response.data) {
            const newOption = { value: response.data.id, label: `${response.data.firstName} ${response.data.lastName}` };
            setOptions(prevOptions => [...prevOptions, newOption]);
          }
        } catch (error) {
          console.error('Error fetching single Teacher:', error);
        }
      }
    };

    fetchData();
  
  }, [value]);

 

  return (
    <div>
      <Select
        loadOptions={loadOptions}
        cacheOptions
        defaultOptions={options}
        placeholder="-Profesores-"
        noOptionsMessage={() => 'No hay opciones'}
        value={options.find((option) => option.value === value) || null}
        isClearable
        asComponent={AsyncSelect}
        {...rest}
      />
    </div>
  );
}
