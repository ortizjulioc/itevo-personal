
import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { Student } from '@prisma/client';
import { CSSObjectWithLabel, GroupBase, StylesConfig } from 'react-select';
import { getCustomStyles } from '@/components/ui/select';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';

export interface StudentSelect {
  value: string;
  label: string;
}

export interface StudentsResponse {
  students: Student[];
  totalStudents: number;
}

interface SelectStudentProps {
  value?: string;
  loading?: boolean;
  onChange?: (selected: StudentSelect | null) => void;
  isDisabled?: boolean;
}
const customStyles: StylesConfig<StudentSelect, false> = {
  menuPortal: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    zIndex: 9999,
  }),
  menu: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    zIndex: 9999,
  }),
};

export default function SelectStudent({ value, ...rest }: SelectStudentProps) {
  const [options, setOptions] = useState<StudentSelect[]>([]);
  const [loading, setLoading] = useState(false);
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);

  const fetchStudentData = async (inputValue: string): Promise<StudentSelect[]> => {
    try {
      setLoading(true);
      const response = await apiRequest.get<StudentsResponse>(`/students?search=${inputValue}`);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data?.students.map(student => ({ value: student.id, label: `${student.code} - ${student.firstName} ${student.lastName}` })) || [];
    } catch (error) {
      console.error('Error fetching Students data:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async (inputValue: string): Promise<StudentSelect[]> => {
    return fetchStudentData(inputValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedOptions = await fetchStudentData('');
      setOptions(fetchedOptions);

      if (value && !fetchedOptions.some(option => option.value === value)) {
        try {
          const response = await apiRequest.get<Student>(`/students/${value}`);
          if (response.success && response.data) {
            const newOption = { value: response.data.id, label: `${response.data.code} - ${response.data.firstName} ${response.data.lastName}` };
            setOptions(prevOptions => [...prevOptions, newOption]);
          }
        } catch (error) {
          console.error('Error fetching single Student:', error);
        }
      }
      setLoading(false);
    };

    fetchData();

  }, [value]);



  return (
    <div>
      <AsyncSelect<StudentSelect, false, GroupBase<StudentSelect>>
        loadOptions={loadOptions}
        defaultOptions={options}
        isLoading={rest.loading || loading}
        placeholder="-Estudiantes-"
        noOptionsMessage={() => 'No hay opciones'}
        value={options.find((option) => option.value === value) || null}
        isClearable
        styles={{
            ...customStyles,
            ...getCustomStyles(Boolean(themeConfig.isDarkMode)),
        }}
        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
        {...rest}
      />
    </div>
  );
}
