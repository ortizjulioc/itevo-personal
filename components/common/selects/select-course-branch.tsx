import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { CourseBranch } from '@prisma/client';
import { Select } from '@/components/ui';

interface CourseBranchSelect {
    value: string;
    label: JSX.Element;
}

export interface CourseBranchsResponse {
    courseBranches: CourseBranch[];
    totalCourseBranches: number;
}

interface SelectCourseBranchProps {
    value?: string;
    onChange?: (selected: CourseBranchSelect | null) => void;
}

const CourseBranchLabel = ({ courseBranch }: { courseBranch: CourseBranch }) => (
    <span>{courseBranch.id} {courseBranch.teacherId}</span>
);

export default function SelectCourseBranch({ value, ...rest }: SelectCourseBranchProps) {
    const [options, setOptions] = useState<CourseBranchSelect[]>([]);

    const fetchCourseBranchData = async (inputValue: string): Promise<CourseBranchSelect[]> => {
        try {
            const response = await apiRequest.get<CourseBranchsResponse>(`/course-branch?search=${inputValue}`);
            console.log('response', response);
            if (!response.success) {
                throw new Error(response.message);
            }

            return response.data?.courseBranches.map(courseBranch => ({
                value: courseBranch.id,
                label: <CourseBranchLabel courseBranch={courseBranch} />
            })) || [];
        } catch (error) {
            console.error('Error fetching Course-Branches data:', error);
            return [];
        }
    };

    const loadOptions = async (inputValue: string, callback: (options: CourseBranchSelect[]) => void) => {
        const options = await fetchCourseBranchData(inputValue);
        callback(options);
    };

    useEffect(() => {
        const fetchData = async () => {
            const fetchedOptions = await fetchCourseBranchData('');
            setOptions(fetchedOptions);

            if (value && !fetchedOptions.some(option => option.value === value)) {
                try {
                    const response = await apiRequest.get<CourseBranch>(`/CourseBranchs/${value}`);
                    if (response.success && response.data) {
                        const newOption = {
                            value: response.data.id,
                            label: <CourseBranchLabel courseBranch={response.data} />
                        };
                        setOptions(prevOptions => [...prevOptions, newOption]);
                    }
                } catch (error) {
                    console.error('Error fetching single CourseBranch:', error);
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
                placeholder="-Ofertas Academicas-"
                noOptionsMessage={() => 'No hay opciones'}
                value={options.find((option) => option.value === value) || null}
                isClearable
                asComponent={AsyncSelect}
                {...rest}
            />
        </div>
    );
}
