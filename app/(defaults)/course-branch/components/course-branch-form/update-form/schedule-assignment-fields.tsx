import React, { useEffect } from 'react'
import { CourseBranchFormType } from '../form.config'
import { Field, FormikErrors, FormikTouched } from 'formik';
import { FormItem, Input, Select } from '@/components/ui';
import DatePicker, { extractDate } from '@/components/ui/date-picker';
import { MODALITIES } from '@/constants/modality.constant';
import ScheduleField from './schedule-field';
import useFetchHolidays from '@/app/(defaults)/holidays/lib/use-fetch-holidays';
import { useFetchScheduleByCourseId } from '@/app/(defaults)/schedules/lib/use-fetch-schedules';
import { getCourseEndDate } from '@/utils/date';
import { useParams } from 'next/navigation';

interface ScheduleAssignmentProps {
    values: CourseBranchFormType;
    errors: FormikErrors<CourseBranchFormType>;
    touched: FormikTouched<CourseBranchFormType>;
    setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
    className?: string;
}

const MODALITIES_OPTIONS = [
    { value: MODALITIES.PRESENTIAL, label: 'Presencial' },
    { value: MODALITIES.VIRTUAL, label: 'Virtual' },
    { value: MODALITIES.HYBRID, label: 'Híbrida' },
];

export default function ScheduleAssignmentFields({ values, errors, touched, className, setFieldValue }: ScheduleAssignmentProps) {
    const { id } = useParams();
    const { holidays } = useFetchHolidays('top=365');
    const { schedules, loading } = useFetchScheduleByCourseId(id as string);
    useEffect(() => {
        console.log(values.startDate, values.sessionCount, schedules, holidays);
        if (values.startDate && values.sessionCount && schedules && holidays) {
            const endDate = getCourseEndDate(values.startDate, values.sessionCount, schedules, holidays);
            if (endDate) {
                // Set the end date in the form
                setFieldValue?.('endDate', endDate);
            }
        }
        console.log('useEffect ScheduleAssignmentFields');
    }, [values.startDate, values.sessionCount, schedules, holidays, setFieldValue]);
    return (
        <div className={className}>
            <FormItem name='startDate' label='Fecha de inicio' invalid={Boolean(errors.startDate && touched.startDate)} errorMessage={errors.startDate}>
                <Field name='startDate'>
                    {({ form, field }: any) => (
                        <DatePicker
                            field={field}
                            form={form}
                            placeholder='Selecciona una fecha'
                            value={values.startDate ? new Date(values.startDate) : undefined}
                            onChange={(date: Date | [Date | null, Date | null] | null) => form.setFieldValue('startDate', extractDate(date))} // Usamos extractDate para manejar el formato
                        />
                    )}
                </Field>
            </FormItem>
            <FormItem name='modality' label='Modalidad' invalid={Boolean(errors.modality && touched.modality)} errorMessage={errors.modality}>
                <Field name='modality'>
                    {({ field, form }: any) => (
                        <Select
                            {...field}
                            options={MODALITIES_OPTIONS}
                            value={MODALITIES_OPTIONS.find((modality) => modality.value === values.modality)}
                            onChange={(option: { value: string, label: string } | null) => {
                                form.setFieldValue('modality', option?.value ?? null);
                            }}
                            isSearchable={false}
                            placeholder="Selecciona una modalidad"
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem name="sessionCount" label="Cantidad de sesiones" invalid={Boolean(errors.sessionCount && touched.sessionCount)} errorMessage={errors.sessionCount}>
                <Field type="number" onWheel={(e: React.WheelEvent<HTMLInputElement>) => (e.target as HTMLInputElement).blur()} name="sessionCount" component={Input} />
            </FormItem>



            {/* <FormItem
        name='endDate'
        label='Fecha de fin'
        extra={<span className='text-gray-500'>(se calculara automaticamente al selecicionar horarios)</span>}
        invalid={Boolean(errors.endDate && touched.endDate)}
        errorMessage={errors.endDate}
      >
        <Field name='endDate'>
          {({ form, field }: any) => (
            <DatePicker
              field={field}
              form={form}
              placeholder='Selecciona una fecha'
              value={values.endDate ? new Date(values.endDate) : undefined}
              onChange={(date: Date | Date[]) => {
                const selectedDate = Array.isArray(date) ? date[0] : date; // Garantizamos que sea un único Date
                form.setFieldValue('endDate', selectedDate);
              }}
            />
          )}
        </Field>
      </FormItem> */}

            <ScheduleField values={values} errors={errors} touched={touched} loading={loading} />
        </div>
    )
}
