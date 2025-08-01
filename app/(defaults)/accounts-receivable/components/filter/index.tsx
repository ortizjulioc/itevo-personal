'use client';
import SelectCourse from "@/components/common/selects/select-course";
import SelectStudent from "@/components/common/selects/select-student";
import SelectReceivableStatus from "../list/select-status";
import DatePicker from "@/components/ui/date-picker";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function AccountReceivableFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [_, startTransition] = useTransition();

    const handleFilterChange = (key: string, value: string | undefined | null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };
    return (
        <div className="grid md:grid-cols-3 gap-3 mb-5">
            <SelectCourse
                value={searchParams.get('courseId') || ''}
                onChange={(selected) => handleFilterChange('courseId', selected?.value || '')}
            />

            <SelectStudent
                value={searchParams.get('studentId') || ''}
                onChange={(selected) => handleFilterChange('studentId', selected?.value || '')}
            />
            <SelectReceivableStatus
                value={searchParams.get('status') || ''}
                onChange={(selected) => handleFilterChange('status', selected?.value || '')}
                isClearable
            />

            <DatePicker
                value={
                    searchParams.get('dueDateStart')
                        ? new Date(searchParams.get('dueDateStart')!)
                        : undefined
                }
                onChange={(date: Date | Date[]) => {
                    if (date instanceof Date) handleFilterChange('dueDateStart', date.toISOString());
                    else if (Array.isArray(date) && date.length > 0) handleFilterChange('dueDateStart', date[0].toISOString());
                    else handleFilterChange('dueDateStart', '');
                }}
                placeholder="Desde (vencimiento)"
                isClearable
            />

            <DatePicker
                value={
                    searchParams.get('dueDateEnd')
                        ? new Date(searchParams.get('dueDateEnd')!)
                        : undefined
                }
                onChange={(date: Date | Date[]) => {
                    if (date instanceof Date) handleFilterChange('dueDateEnd', date.toISOString());
                    else if (Array.isArray(date) && date.length > 0) handleFilterChange('dueDateEnd', date[0].toISOString());
                    else handleFilterChange('dueDateEnd', '');
                }}
                placeholder="Hasta (vencimiento)"
                isClearable
            />

        </div>
    );
}
