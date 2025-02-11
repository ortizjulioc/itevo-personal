'use client';
import { Button, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { updateValidationSchema } from '../form.config';
import { updatePromotion } from '../../../lib/request';
import type { Promotion } from '@prisma/client';
import DatePicker from '@/components/ui/date-picker';

export default function UpdatePromotionForm({ initialValues }: { initialValues: Promotion }) {

    const route = useRouter();
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleSubmit = async (values: any) => {
        const data = { ...values };
        data.startDate = new Date(data.startDate).toISOString();
        data.endDate = new Date(data.endDate).toISOString();

        const resp = await updatePromotion(initialValues.id, data);
     

        if (resp.success) {
            openNotification('success', 'Promoción editada correctamente');
            route.push('/promotions');
        } else {
            alert(resp.message);
        }
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const onChangeName = (name: string, form: any) => {
        form.setFieldValue('name', name);
    };

    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de promociones</h4>
            <Formik initialValues={initialValues} validationSchema={updateValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">
                        <FormItem name="description" label="Nombre" invalid={Boolean(errors.description && touched.description)} errorMessage={errors.description}>
                            <Field type="text" name="description" component={Input} placeholder="Ingrese el nombre de la promoción" />
                        </FormItem>
                        <FormItem
                            name="startDate"
                            label="Fecha de inicio"
                            invalid={Boolean(errors.startDate && touched.startDate)}
                            errorMessage={typeof errors.startDate === 'string' ? errors.startDate : undefined}
                        >
                            <DatePicker
                                value={values.startDate}
                                onChange={(date: Date | Date[]) => {
                                    if (date instanceof Date) {
                                        setFieldValue('startDate', date);
                                    } else if (Array.isArray(date) && date.length > 0) {
                                        setFieldValue('startDate', date[0]);
                                    }
                                }}
                            />
                        </FormItem>
                        <FormItem
                            name="endDate"
                            label="Fecha fin"
                            invalid={Boolean(errors.endDate && touched.endDate)}
                            errorMessage={typeof errors.endDate === 'string' ? errors.endDate : undefined}
                        >
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
