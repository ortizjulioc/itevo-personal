import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState } from 'react';
import { CourseBranch, CourseBranchResponse } from '@/app/(defaults)/course-branch/lib/use-fetch-course-branch';
import ReactSelect, { ActionMeta, components, CSSObjectWithLabel, GroupBase, StylesConfig } from 'react-select';
import { TbCheck } from 'react-icons/tb';
import { formatCurrency } from '@/utils';
import ModalityTag from '@/app/(defaults)/course-branch/components/modality';
import { formatSchedule } from '@/utils/schedule';
import { StudentSelect } from './select-student';
import { getCustomStyles } from '@/components/ui/select';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useActiveBranch } from '@/utils/hooks/use-active-branch';
const { Control } = components


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


interface CourseBranchSelect {
    value: string;
    label: string;
    courseBranch?: CourseBranch;
}

interface SelectCourseBranchProps {
    value?: string;
    onChange?: (selected: CourseBranchSelect | null, actionMeta: ActionMeta<CourseBranchSelect>) => void;
    onlyEnrollable?: boolean;
}

export default function SelectCourseBranch({ value, onlyEnrollable = false, ...rest }: SelectCourseBranchProps) {
    const [options, setOptions] = useState<CourseBranchSelect[]>([]);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const { activeBranchId } = useActiveBranch();

    const fetchCourseBranchData = async (inputValue: string, branchId?: string): Promise<CourseBranchSelect[]> => {
        try {
            const queryParams = new URLSearchParams({
                search: inputValue,
                top: '1000',
            });
            if (branchId) {
                queryParams.set('branchId', branchId);
            }
            
            const response = await apiRequest.get<CourseBranchResponse>(`/course-branch?${queryParams.toString()}`);
            console.log('response', response);
            if (!response.success) {
                throw new Error(response.message);
            }

            let branches = response.data?.courseBranches || [];

            if (onlyEnrollable) {
                branches = branches.filter(courseBranch => {
                    // Siempre permitimos el valor actualmente seleccionado
                    if (courseBranch.id === value) return true;

                    const isInvalidStatus = ['DRAFT', 'CANCELED', 'COMPLETED'].includes(courseBranch.status);
                    const isExpired = courseBranch.endDate && new Date(courseBranch.endDate) < new Date();

                    return !isInvalidStatus && !isExpired;
                });
            }

            return branches.map(courseBranch => ({
                value: courseBranch.id,
                label: courseBranch.course.name,
                courseBranch: courseBranch
            }));
        } catch (error) {
            console.error('Error fetching Course-Branches data:', error);
            return [];
        }
    };

    const loadOptions = async (inputValue: string): Promise<CourseBranchSelect[]> => {
        return fetchCourseBranchData(inputValue, activeBranchId || undefined);
    };

    const CustomSelectedOption = (props: any) => {
        const { isSelected, isDisabled, innerProps, data } = props;
        const { courseBranch } = data;

        const enrolledCount = courseBranch.enrollment?.filter((e: any) => e.status === 'ENROLLED').length || 0;
        const capacity = courseBranch.capacity;
        const available = capacity > 0 ? Math.max(0, capacity - enrolledCount) : null;

        return (
            <div
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition px-4
              ${isSelected ? "bg-gray-100 dark:bg-gray-700" : "hover:bg-gray-50 dark:hover:bg-gray-600"}
              ${isDisabled ? "opacity-60 cursor-not-allowed bg-red-50/20 dark:bg-red-950/10" : ""}
            `}
                {...innerProps}
            >
                <div className="flex flex-col">
                    <div>
                        <span className={`font-semibold text-base mr-2 ${isDisabled ? "text-red-500 dark:text-red-400" : "text-black dark:text-white"}`}>
                            {courseBranch.course.name}
                        </span>
                        <ModalityTag modality={courseBranch.modality} />
                        {isDisabled && (
                            <span className="badge bg-danger/10 text-danger border border-danger/25 text-[10px] ml-2 font-bold px-1.5 py-0.5 rounded">
                                Lleno
                            </span>
                        )}
                    </div>

                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {courseBranch.teacher.firstName} {courseBranch.teacher.lastName} | {courseBranch.branch.name}
                    </span>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {courseBranch.schedules && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatSchedule(courseBranch.schedules)}
                            </span>
                        )}
                        {capacity > 0 && (
                            <>
                                <span className="text-slate-300 dark:text-slate-600 text-xs">|</span>
                                <span className={`text-xs font-semibold ${available === 0 ? "text-red-500 font-bold" : "text-emerald-600 dark:text-emerald-400"}`}>
                                    Cupos: {available} disp. / {capacity} tot.
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className='flex items-center'>
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
            const fetchedOptions = await fetchCourseBranchData('', activeBranchId || undefined);
            console.log('fetchedOptions', fetchedOptions);
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
    }, [value, activeBranchId, onlyEnrollable]);

    return (
        <div>
            <ReactSelect<CourseBranchSelect, false, GroupBase<CourseBranchSelect>>
                // loadOptions={loadOptions}
                // cacheOptions
                // defaultOptions={options}
                options={options}
                className="w-full"
                placeholder="-Ofertas Academicas-"
                noOptionsMessage={() => 'No hay opciones'}
                value={options.find((option) => option.value === value) || null}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                components={{
                    Control: CustomControl,
                    Option: CustomSelectedOption
                }}
                isOptionDisabled={(option) => {
                    if (option.value === value) return false;
                    if (onlyEnrollable && option.courseBranch) {
                        const cb = option.courseBranch;
                        const enrolledCount = cb.enrollment?.filter((e: any) => e.status === 'ENROLLED').length || 0;
                        return cb.capacity > 0 && enrolledCount >= cb.capacity;
                    }
                    return false;
                }}
                styles={{...getCustomStyles(Boolean(themeConfig.isDarkMode)), ...customStyles}}
                isClearable
                {...rest}
            />
        </div>
    );
}
