'use client';
import SelectCourse from "@/components/common/selects/select-course";
import SelectTeacher from "@/components/common/selects/select-teacher";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { PaymentStatus } from '@/generated/prisma/client';
import SelectPayableStatus, { SelectPayableStatusType } from "./select-status";

export default function AccountPayableFilter() {
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

      <SelectTeacher
        value={searchParams.get('teacherId') || ''}
        onChange={(selected) => handleFilterChange('teacherId', selected?.value || '')}
      />

      <SelectPayableStatus
        value={searchParams.get('status') as PaymentStatus || ''}
        onChange={(selected: SelectPayableStatusType | null) => handleFilterChange('status', selected?.value || '')}
        isClearable
      />
    </div>
  );
}
