'use client';
import { Button, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';
import { createPromotion } from '../../../lib/request';
import DatePicker from '@/components/ui/date-picker';


export default function CreatePromotionForm() {
    const route = useRouter();
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);
        const data = { ...values };
        data.startDate = new Date(data.startDate).toISOString();
        data.endDate = new Date(data.endDate).toISOString();

        const resp = await createPromotion(data);

        if (resp.success) {
            openNotification('success', 'Promoción creada correctamente');
            route.push('/promotions');
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de promoción</h4>
            <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">
                        <FormItem name="description" label="Nombre" invalid={Boolean(errors.description && touched.description)} errorMessage={errors.description}>
                            <Field type="text" name="description" component={Input} placeholder="Ingrese el nombre de la promoción" />
                        </FormItem>

                        <FormItem name="startDate" label="Fecha de inicio" invalid={Boolean(errors.startDate && touched.startDate)} errorMessage={errors.startDate}>
                            <DatePicker
                                value={values.startDate}
                                onChange={(date: Date | Date[]) => {
                                    // Verificar si "date" es un objeto `Date` o un array
                                    if (date instanceof Date) {
                                        setFieldValue('startDate', date);
                                    } else if (Array.isArray(date) && date.length > 0) {
                                        // Si es un array, tomar el primer elemento como el valor
                                        setFieldValue('startDate', date[0]);
                                    }
                                }}
                            />
                        </FormItem>
                        <FormItem name="endDate" label="Fecha fin" invalid={Boolean(errors.endDate && touched.endDate)} errorMessage={errors.endDate}>
                            <DatePicker

                                value={values.endDate}
                                onChange={(date: Date | Date[]) => {
                                    if (date instanceof Date) {
                                        setFieldValue('endDate', date);
                                    } else if (Array.isArray(date) && date.length > 0) {
                                        setFieldValue('endDate', date[0]);
                                    }
                                }}
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
