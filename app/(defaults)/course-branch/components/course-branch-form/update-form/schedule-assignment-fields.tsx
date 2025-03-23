import React from 'react'
import { CourseBranchFormType } from '../form.config'
import { Field, FormikErrors, FormikTouched } from 'formik';
import { FormItem, Select } from '@/components/ui';
import DatePicker from '@/components/ui/date-picker';
import { MODALITIES } from '@/constants/modality.constant';
import ScheduleField from './schedule-field';

interface ScheduleAssignmentProps {
  values: CourseBranchFormType;
  errors: FormikErrors<CourseBranchFormType>;
  touched: FormikTouched<CourseBranchFormType>;
  className?: string;
}

const MODALITIES_OPTIONS = [
  { value: MODALITIES.PRESENTIAL, label: 'Presencial' },
  { value: MODALITIES.VIRTUAL, label: 'Virtual' },
  { value: MODALITIES.HYBRID, label: 'Híbrida' },
];

export default function ScheduleAssignmentFields({ values, errors, touched, className }: ScheduleAssignmentProps) {
  return (
    <div className={className}>
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

      <FormItem name='startDate' label='Fecha de inicio' invalid={Boolean(errors.startDate && touched.startDate)} errorMessage={errors.startDate}>
        <Field name='startDate'>
          {({ form, field }: any) => (
            <DatePicker
              field={field}
              form={form}
              placeholder='Selecciona una fecha'
              value={values.startDate ? new Date(values.startDate) : undefined}
              onChange={(date: Date | Date[]) => {
                const selectedDate = Array.isArray(date) ? date[0] : date; // Garantizamos que sea un único Date
                form.setFieldValue('startDate', selectedDate);
              }}
            />
          )}
        </Field>
      </FormItem>

      <FormItem name='endDate' label='Fecha de fin' invalid={Boolean(errors.endDate && touched.endDate)} errorMessage={errors.endDate}>
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
      </FormItem>

      <ScheduleField values={values} errors={errors} touched={touched} />
    </div>
  )
}
