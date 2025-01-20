'use client';

import { Button, FormItem, Input } from '@/components/ui';
import { Form, Formik } from 'formik';
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
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },

];

export default function UpdateScheduleForm({ initialValues, setOpenModal, setSchedules }: { initialValues: Schedule, setOpenModal: (value: boolean) => void, setSchedules: any }) {
    const route = useRouter();

    const handleSubmit = async (values: any) => {
        const formatTime = (isoTime: string): string => {
            const timeRegex = /^([0-9]{1,2}):([0-9]{2})$/;
            
            if (timeRegex.test(isoTime)) {
                return isoTime;
            }
            const date = new Date(isoTime);
            return date.toTimeString().slice(0, 5);
        };

        const data = {
            ...values,
            startTime: formatTime(values.startTime),
            endTime: formatTime(values.endTime),
            weekday: values.weekday,
        };
        const resp = await updateSchedule(initialValues.id, data); // Asegúrate de tener la función de actualización

        if (resp.success) {
            openNotification('success', 'Horario actualizado correctamente');
            setSchedules((prev: any) => {
                const index = prev.findIndex((schedule: any) => schedule.id === initialValues.id);
                prev[index] = resp.data;
                return [...prev];
            });
            setOpenModal(false);
        } else {
            openNotification('error', resp.message);
        }
    };

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

    return (
        <div >
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
                                value={values.startTime ? stringToTime(values.startTime) : undefined}
                                mode="time"
                                onChange={(date: Date | Date[]) => {
                                    const selectedDate = Array.isArray(date) ? date[0] : date; // Garantizamos que sea un único Date
                                    setFieldValue('startTime', selectedDate);
                                }}
                            />
                        </FormItem>

                        <FormItem name="endTime" label="Hora de fin" invalid={Boolean(errors.endTime && touched.endTime)} errorMessage={errors.endTime}>
                            <DatePicker
                                value={values.endTime ? stringToTime(values.endTime) : undefined}
                                mode="time"
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
                                    setFieldValue('weekday', option?.value ?? null);
                                }}
                                isSearchable={false}
                                placeholder="Selecciona un día"
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base: React.CSSProperties) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                }}
                            />
                        </FormItem>



                        <div className="mt-6 flex justify-end gap-2">
                            <Button type="button" color="danger" onClick={() => setOpenModal(false)}>
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
