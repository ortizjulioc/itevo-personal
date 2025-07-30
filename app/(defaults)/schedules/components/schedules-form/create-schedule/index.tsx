'use client';
import { Button, FormItem, Input, Select } from '@/components/ui';
import { Field, FieldProps, Form, Formik } from 'formik';
import { openNotification } from '@/utils';
import { initialValues, ScheduleFormType } from '../form.config'
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

];// Por ejemplo, en CreateScheduleForm.tsx
interface CreateScheduleFormProps {
    onCreated?: (schedule: any) => void;
    onClose?: any
}


export default function CreateScheduleForm({ onCreated, onClose }: CreateScheduleFormProps) {

    const handleSubmit = async (values: ScheduleFormType, { setSubmitting }: any) => {
        setSubmitting(true);
        const resp = await createSchedule(values);

        if (resp.success) {
            openNotification('success', 'Horario creado correctamente');
            onCreated?.(resp.data);
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);

        onClose?.()
    };

    return (
        <div className='panel px-4'>
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de creacion de horario</h4>
            <Formik
                initialValues={initialValues}
                validationSchema={createValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, errors, touched }) => (
                    <Form className="form">
                        <div className='grid grid-cols-1  gap-4 md:items-start'>

                            <div className="w-full">
                                <FormItem name="weekday" label="Día de la semana" invalid={Boolean(errors.weekday && touched.weekday)} errorMessage={errors.weekday}>
                                    <Field>
                                        {({ form }: FieldProps<ScheduleFormType>) => (
                                            <Select
                                                name="weekday"
                                                placeholder="Selecciona un día"
                                                className="min-w-[200px] "
                                                options={weekOptions}
                                                value={weekOptions.find((opt) => opt.value === values.weekday)}
                                                onChange={(newValue, _actionMeta) => {
                                                    const option = newValue as WeekOption | null;
                                                    form.setFieldValue('weekday', option?.value ?? null);
                                                }}
                                                menuPortalTarget={typeof window !== 'undefined' ? document.body : null} // <- clave
                                                menuPosition="fixed"
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}

                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </div>
                            <div className="w-full">
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
                            </div>
                            <div className="w-full">
                                <FormItem
                                    name="endTime"
                                    label="Hora de finalización"
                                    invalid={Boolean(errors.endTime && touched.endTime)}
                                    errorMessage={errors.endTime}
                                >
                                    <Field
                                        type="time"
                                        name="endTime"
                                        placeholder="Hora de finalización"
                                        className="min-w-[200px]"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>

                        </div>
                        <div className='mt-6 flex justify-end gap-2'>
                            <Button type="button" color="danger" onClick={() => onClose?.()}>
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
