import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { Select } from '@/components/ui';
import { CourseBranch, CourseBranchResponse } from '@/app/(defaults)/course-branch/lib/use-fetch-course-branch';
import { ActionMeta, components, GroupBase } from 'react-select';
import { TbCheck } from 'react-icons/tb';
import { formatCurrency } from '@/utils';
import ModalityTag from '@/app/(defaults)/course-branch/components/modality';
import { formatSchedule } from '@/utils/schedule';
const { Control } = components

interface CourseBranchSelect {
    value: string;
    label: string;
    courseBranch?: CourseBranch;
}

interface SelectCourseBranchProps {
    value?: string;
    onChange?: (selected: CourseBranchSelect | null, actionMeta: ActionMeta<CourseBranchSelect>) => void;
}

export default function SelectCourseBranch({ value, ...rest }: SelectCourseBranchProps) {
    const [options, setOptions] = useState<CourseBranchSelect[]>([]);

    const fetchCourseBranchData = async (inputValue: string): Promise<CourseBranchSelect[]> => {
        try {
            const response = await apiRequest.get<CourseBranchResponse>(`/course-branch?search=${inputValue}`);
            console.log('response', response);
            if (!response.success) {
                throw new Error(response.message);
            }

            return response.data?.courseBranches.map(courseBranch => ({
                value: courseBranch.id,
                label: courseBranch.course.name,
                courseBranch: courseBranch
            })) || [];
        } catch (error) {
            console.error('Error fetching Course-Branches data:', error);
            return [];
        }
    };

    const loadOptions = async (inputValue: string): Promise<CourseBranchSelect[]> => {
        // const options = await fetchCourseBranchData(inputValue);
        // callback(options);
        return fetchCourseBranchData(inputValue);
    };

    const CustomSelectedOption = (props: any) => {
        const { isSelected, innerProps, data } = props;
        const { courseBranch } = data;

        return (
            <div
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition px-4
              ${isSelected ? "bg-gray-100 dark:bg-gray-700" : "hover:bg-gray-50 dark:hover:bg-gray-600"}
            `}
                {...innerProps}
            >
                <div className="flex flex-col">
                    <div>
                        <span className="font-semibold text-base text-black dark:text-white mr-2">
                            {courseBranch.course.name}
                        </span>
                        <ModalityTag modality={courseBranch.modality} />
                    </div>

                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {courseBranch.teacher.firstName} {courseBranch.teacher.lastName} | {courseBranch.branch.name}
                    </span>

                    {courseBranch.schedules && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatSchedule(courseBranch.schedules)}
                        </span>
                    )}

                </div>

                <div className='flex'>
                    <span className="text-base font-bold dark:text-white">
                        {formatCurrency(courseBranch.amount)}
                    </span>
                    {isSelected && <TbCheck className="text-emerald-500 text-xl ml-2" />}
                </div>
            </div>
        );
    };

    const CustomControl = (props: any) => {
        const { children, ...rest } = props;
        return (
            <Control {...rest}>
                <div className="flex items-center w-full">{children}</div>
            </Control>
        );
    }

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
                            label: response.data.id,
                            courseBranch: response.data
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
            <AsyncSelect<CourseBranchSelect, false, GroupBase<CourseBranchSelect>>
                loadOptions={loadOptions}
                cacheOptions
                defaultOptions={options}
                placeholder="-Ofertas Academicas-"
                noOptionsMessage={() => 'No hay opciones'}
                value={options.find((option) => option.value === value) || null}
                isClearable
                //asComponent={AsyncSelect}
                components={{
                    Control: CustomControl,
                    Option: CustomSelectedOption
                }}
                {...rest}
            />
        </div>
    );
}
