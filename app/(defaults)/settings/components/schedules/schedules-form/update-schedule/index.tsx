'use client';

import { Button, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { updateValidationSchema } from '../form.config'; 
import { Schedule } from '@prisma/client'; 
import Select from 'react-select';
import { updateSchedule } from '@/app/(defaults)/settings/lib/schedules/request';
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

export default function UpdateScheduleForm({ initialValues }: { initialValues: Schedule }) {
    const route = useRouter();

    const handleSubmit = async (values: any) => {
        const data = { ...values };
        const resp = await updateSchedule(initialValues.id, data); // Asegúrate de tener la función de actualización

        if (resp.success) {
            openNotification('success', 'Horario actualizado correctamente');
            route.push('/schedules'); // Redirige según lo necesario
        } else {
            alert(resp.message); // O usa un sistema de notificación
        }
    };

    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Actualización de Horario</h4>
            <Formik
                initialValues={initialValues}
                validationSchema={updateValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">

                        <FormItem name="startTime" label="Hora de inicio" invalid={Boolean(errors.startTime && touched.startTime)} errorMessage={errors.startTime}>
                            <DatePicker
                                mode="time"
                                onChange={(date: Date | Date[]) => {
                                    const selectedDate = Array.isArray(date) ? date[0] : date; // Garantizamos que sea un único Date
                                    setFieldValue('startTime', selectedDate);
                                }}
                            />
                        </FormItem>

                        <FormItem name="endTime" label="Hora de fin" invalid={Boolean(errors.endTime && touched.endTime)} errorMessage={errors.endTime}>
                            <DatePicker
                                mode="time"
                                onChange={(date: Date | Date[]) => {
                                    const selectedDate = Array.isArray(date) ? date[0] : date; // Garantizamos que sea un único Date
                                    setFieldValue('endTime', selectedDate);
                                }}
                            />
                        </FormItem>

                        <FormItem
                            name="weekday"
                            label="Día de la Semana"
                            invalid={Boolean(errors.weekday && touched.weekday)}
                            errorMessage={errors.weekday}
                        >
                            <Select
                                name="weekday"
                                options={weekOptions}
                                value={weekOptions.find((opt) => opt.value === values.weekday)}
                                onChange={(option: any) => setFieldValue('weekday', option?.value || null)}
                                isSearchable={false}
                                placeholder="Selecciona un día"
                            />
                        </FormItem>



                        <div className="mt-6 flex justify-end gap-2">
                            <Button type="button" color="danger" onClick={() => route.back()}>
                                Cancelar
                            </Button>
                            <Button loading={isSubmitting} type="submit">
                                {isSubmitting ? 'Actualizando...' : 'Actualizar'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
