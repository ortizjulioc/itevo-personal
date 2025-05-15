'use client';

import { Button, FormItem, Input } from '@/components/ui';
import { Field, FieldProps, Form, Formik } from 'formik';
import { openNotification } from '@/utils';
import { ScheduleFormType, updateValidationSchema } from '../form.config';
import { Schedule } from '@prisma/client';
import Select from 'react-select';
import { updateSchedule } from '../../../lib/request';
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

export default function UpdateScheduleForm({ initialValues, setOpenModal, setSchedules }: { initialValues: Schedule, setOpenModal: (value: boolean) => void, setSchedules: any }) {

    const handleSubmit = async (values: ScheduleFormType) => {
        const resp = await updateSchedule(initialValues.id, values); // Asegúrate de tener la función de actualización

        if (resp.success) {
            openNotification('success', 'Horario actualizado correctamente');
        } else {
            openNotification('error', resp.message);
        }
    };

    return (
        <div >
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de actualización de horario</h4>
            <Formik
                initialValues={initialValues}
                validationSchema={updateValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, errors, touched }) => (
                    <Form className="form">
                        <div className='flex items-start gap-4'>
                            <FormItem name="weekday" label="Día de la semana" invalid={Boolean(errors.weekday && touched.weekday)} errorMessage={errors.weekday}>
                                <Field>
                                    {({ form }: FieldProps<ScheduleFormType>) => (
                                        <Select
                                            name="weekday"
                                            placeholder="Selecciona un día"
                                            className="min-w-[200px]"
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
                                    className="min-w-[200px]"
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
                                    className="min-w-[200px]"
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
