'use client';

import { Button, FormItem, Input } from '@/components/ui';
import { Field, FieldProps, Form, Formik } from 'formik';
import { openNotification } from '@/utils';
import { initialValues, ScheduleFormType } from '../form.config'
import Select from 'react-select';

import DatePicker from '@/components/ui/date-picker';
import { getFormattedTime } from '@/utils/date';
import { createValidationSchema } from "../form.config"
import { createSchedule } from '../../../lib/request';

interface WeekOption {
    value: number;
    label: string;
}

const weekOptions: WeekOption[] = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },

];
const stringToTime = (time: string | Date) => {
    if (time instanceof Date) {
        return time; // Si ya es un objeto Date, retornarlo
    }

    if (typeof time === 'string') {
        const [hours, minutes] = time.split(':');
        return new Date(new Date().setHours(Number(hours), Number(minutes), 0, 0));
    }

    throw new Error("Invalid time format: must be a string in 'HH:mm' format or a Date object");
};
export default function CreateScheduleForm() {


    const handleSubmit = async (values: ScheduleFormType, { setSubmitting }: any) => {
        setSubmitting(true);
        const resp = await createSchedule(values);

        if (resp.success) {
            openNotification('success', 'Horario creado correctamente');
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };

    return (
        <div className='panel px-4'>
            <Formik
                initialValues={initialValues}
                validationSchema={createValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, errors, touched }) => (
                    <Form className="form">
                        <div className='flex items-center gap-4'>
                            <FormItem name="weekday" label="Día de la semana" invalid={Boolean(errors.weekday && touched.weekday)} errorMessage={errors.weekday}>
                                <Field>
                                    {({ field, form }: FieldProps<ScheduleFormType>) => (
                                        <Select
                                            field={field}
                                            form={form}
                                            name="weekday"
                                            placeholder="Selecciona un día"
                                            className="min-w-[200px"
                                            options={weekOptions}
                                            value={weekOptions.find((opt) => opt.value === values.weekday)}
                                            onChange={(option: WeekOption | null) => {
                                                form.setFieldValue('weekday', option?.value ?? null);
                                            }}
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            <FormItem
                                name="startTime"
                                label="Hora de inicio"
                                invalid={Boolean(errors.startTime && touched.startTime)}
                                errorMessage={errors.startTime}
                            >
                                <Field
                                    type="time"
                                    name="startTime"
                                    placeholder="Hora de inicio"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem
                                name="endTime"
                                label="Hora de fin"
                                invalid={Boolean(errors.endTime && touched.endTime)}
                                errorMessage={errors.endTime}
                            >
                                <Field
                                    type="time"
                                    name="endTime"
                                    placeholder="Hora de fin"
                                    component={Input}
                                />
                            </FormItem>

                        </div>
                        <div className='mb-4'>
                            <Button loading={isSubmitting} type="submit">
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
