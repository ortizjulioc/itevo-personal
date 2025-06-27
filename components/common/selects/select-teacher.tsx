
import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState} from 'react';
import AsyncSelect from 'react-select/async';
import { Teacher } from '@prisma/client';
import { Select } from '@/components/ui';
import { GroupBase } from 'react-select';

export type SelectTeacherType = {
  value: string;
  label: string;
}

export interface TeachersResponse {
  teachers: Teacher[];
  totalTeachers: number;
}

interface SelectTeacherProps {
  value?: string;
  onChange?: (selected: SelectTeacherType | null) => void;
}

export default function SelectTeacher({ value, ...rest }: SelectTeacherProps) {
  const [options, setOptions] = useState<SelectTeacherType[]>([]);

  const fetchTeacherData = async (inputValue: string): Promise<SelectTeacherType[]> => {
    try {
      const response = await apiRequest.get<TeachersResponse>(`/teachers?search=${inputValue}`);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data?.teachers.map(teacher => ({ value: teacher.id, label: `${teacher.firstName} ${teacher.lastName}` })) || [];
    } catch (error) {
      console.error('Error fetching Teachers data:', error);
      return [];
    }
  };

  const loadOptions = async (inputValue: string): Promise<SelectTeacherType[]> => {
    // const options = await fetchTeacherData(inputValue);
    // callback(options);
    return fetchTeacherData(inputValue);
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
      <AsyncSelect<SelectTeacherType, false, GroupBase<SelectTeacherType>>
        loadOptions={loadOptions}
        cacheOptions
        defaultOptions={options}
        placeholder="-Profesores-"
        noOptionsMessage={() => 'No hay opciones'}
        value={options.find((option) => option.value === value) || null}
        isClearable
        //asComponent={AsyncSelect}
        {...rest}
      />
    </div>
  );
}
