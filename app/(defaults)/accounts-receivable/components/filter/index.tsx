'use client';
import SelectCourse from "@/components/common/selects/select-course";
import SelectStudent from "@/components/common/selects/select-student";
import SelectReceivableStatus from "../list/select-status";
import DatePicker, { extractDate } from "@/components/ui/date-picker";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { PaymentStatus } from "@prisma/client";

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
                value={searchParams.get('status') as PaymentStatus || ''}
                onChange={(selected) => handleFilterChange('status', selected?.value || '')}
                isClearable
            />

            <DatePicker
                value={
                    searchParams.get('dueDateStart')
                        ? new Date(searchParams.get('dueDateStart')!)
                        : undefined
                }
                onChange={(date) => handleFilterChange('dueDateStart', extractDate(date))}
                placeholder="Desde (vencimiento)"
                isClearable
            />

            <DatePicker
                value={
                    searchParams.get('dueDateEnd')
                        ? new Date(searchParams.get('dueDateEnd')!)
                        : undefined
                }
                onChange={(date) => handleFilterChange('dueDateEnd', extractDate(date))}
                placeholder="Hasta (vencimiento)"
                isClearable
            />

        </div>
    );
}
