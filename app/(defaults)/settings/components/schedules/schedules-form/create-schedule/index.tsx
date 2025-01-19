'use client';

import { Button, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';
import Select from 'react-select';
import { createSchedule } from '@/app/(defaults)/settings/lib/schedules/request';
import DatePicker from '@/components/ui/date-picker';

interface WeekOption {
    value: number; 
    label: string;
}

const weekOptions: WeekOption[] = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 0, label: 'Domingo' },
];

export default function CreateScheduleForm() {
    const route = useRouter();

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);
        const data = { ...values, weekday: values.weekday.value }; // Transformar `weekday` para enviar solo su valor

        const resp = await createSchedule(data);

        if (resp.success) {
            openNotification('success', 'Horario creado correctamente');
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="panel">
            <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">
                        <FormItem name="startTime" label="Hora de inicio" invalid={Boolean(errors.startTime && touched.startTime)} errorMessage={errors.startTime}>
                            <DatePicker
                                mode="time"
                                value={values.startTime}
                                onChange={(date: Date | Date[]) => {
                                    const selectedDate = Array.isArray(date) ? date[0] : date; // Garantizamos que sea un único Date
                                    setFieldValue('startTime', selectedDate);
                                }}
                            />
                        </FormItem>

                        <FormItem name="endTime" label="Hora de fin" invalid={Boolean(errors.endTime && touched.endTime)} errorMessage={errors.endTime}>
                            <DatePicker
                                mode="time"
                                value={values.endTime}
                                onChange={(date: Date | Date[]) => {
                                    const selectedDate = Array.isArray(date) ? date[0] : date; // Garantizamos que sea un único Date
                                    setFieldValue('endTime', selectedDate);
                                }}
                            />
                        </FormItem>

                        <FormItem name="weekday" label="Día de la semana" invalid={Boolean(errors.weekday && touched.weekday)} errorMessage={errors.weekday}>
                            <Select
                                name="weekday"
                                options={weekOptions}
                                value={weekOptions.find((opt) => opt.value === values.weekday)} 
                                onChange={(option: WeekOption | null) => {
                                    setFieldValue('weekday', option?.value || null); 
                                }}
                                isSearchable={false}
                                placeholder="Selecciona un día"
                            />
                        </FormItem>

                        <div className="mt-6 flex justify-end gap-2">
                            <Button type="button" color="danger" onClick={() => route.back()}>
                                Cancelar
                            </Button>
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
