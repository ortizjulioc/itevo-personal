'use client';

import { Button, FormItem } from '@/components/ui';
import { Form, Formik } from 'formik';
import { openNotification } from '@/utils';
import { initialValues } from '../form.config'
import Select from 'react-select';

import DatePicker from '@/components/ui/date-picker';
import { getFormattedTime } from '@/utils/date';
import {createValidationSchema } from "../form.config"
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
export default function CreateScheduleForm({ setOpenModal, setSchedules }: { setOpenModal: (value: boolean) => void, setSchedules: any }) {


    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);

        const formatTime = (isoTime: string): string => {
            const date = new Date(isoTime);
            return date.toTimeString().slice(0, 5);
        };
     
        const data = {
            ...values,
            startTime: formatTime(values.startTime),
            endTime: formatTime(values.endTime),
            weekday: values.weekday,
        };



        const resp = await createSchedule(data);

        if (resp.success) {
            openNotification('success', 'Horario creado correctamente');
            setSchedules((prev: any) => [...prev, resp.data]);
            setOpenModal(false);
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };

    return (
        <div >
            <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">
                        <FormItem name="startTime" label="Hora de inicio" invalid={Boolean(errors.startTime && touched.startTime)} errorMessage={errors.startTime}>
                            <DatePicker
                                mode="time"
                                value={values.startTime ? stringToTime(values.startTime) : undefined}
                                onChange={(date: Date | Date[]) => {
                                    const selectedDate = Array.isArray(date) ? date[0] : date; // Garantizamos que sea un único Date                                    
                                    setFieldValue('startTime',  selectedDate);
                                }}
                            />
                        </FormItem>

                        <FormItem name="endTime" label="Hora de fin" invalid={Boolean(errors.endTime && touched.endTime)} errorMessage={errors.endTime}>
                            <DatePicker
                                mode="time"
                                value={values.endTime ? stringToTime(values.endTime) : undefined}
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
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
