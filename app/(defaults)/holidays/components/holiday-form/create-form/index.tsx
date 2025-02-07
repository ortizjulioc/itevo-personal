'use client';
import { Button, FormItem, Input, Checkbox } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';
import { createHoliday } from '../../../lib/request';
import DatePicker from '@/components/ui/date-picker';




export default function CreateHolidayForm() {
    const route = useRouter();
    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);
        const data = { ...values };
        console.log(data);

        const resp = await createHoliday(data);

        if (resp.success) {
            openNotification('success', 'Dia feriado creado correctamente');
            route.push('/holidays');
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };


    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de dias feriados</h4>
            <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">

                        <FormItem name="name" label="Nombre" invalid={Boolean(errors.name && touched.name)} errorMessage={errors.name}>
                            <Field type="text" name="name" component={Input} />
                        </FormItem>
                        <FormItem name="date" label="Fecha" invalid={Boolean(errors.date && touched.date)} errorMessage={errors.date}>
                            <DatePicker

                                value={values.date}
                                onChange={(date: Date | Date[]) => {
                                    if (date instanceof Date) {
                                        setFieldValue('date', date);
                                    } else if (Array.isArray(date) && date.length > 0) {
                                        setFieldValue('date', date[0]);
                                    }
                                }}
                            />
                        </FormItem>


                        <FormItem name="isRecurring" label="" invalid={Boolean(errors.isRecurring && touched.isRecurring)} errorMessage={errors.isRecurring}>
                            <Field type="checkbox" name="isRecurring" component={Checkbox} >
                                El dia festivo es recurrente
                            </Field>
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
