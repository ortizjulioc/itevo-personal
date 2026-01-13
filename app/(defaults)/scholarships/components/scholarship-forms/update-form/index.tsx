'use client';
import { Button, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { updateValidationSchema } from '../form.config';
import { updateScholarship } from '../../../libs/request';
import type { Scholarship } from '../../../libs/request';

export default function UpdateScholarshipForm({ initialValues }: { initialValues: Scholarship }) {

    const route = useRouter();
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleSubmit = async (values: any) => {
        const data = { ...values };
        // data.percentage = Number(data.percentage);

        const resp = await updateScholarship(initialValues.id, data);


        if (resp.success) {
            openNotification('success', 'Beca editada correctamente');
            route.push('/scholarships');
        } else {
            alert(resp.message);
        }
    }

    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de becas</h4>
            <Formik initialValues={initialValues} validationSchema={updateValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">
                        <FormItem name="name" label="Nombre" invalid={Boolean(errors.name && touched.name)} errorMessage={errors.name}>
                            <Field type="text" name="name" component={Input} placeholder="Ingrese el nombre de la beca" />
                        </FormItem>
                        <FormItem
                            name="percentage"
                            label="Porcentaje"
                            invalid={Boolean(errors.percentage && touched.percentage)}
                            errorMessage={typeof errors.percentage === 'string' ? errors.percentage : undefined}
                        >
                            <Field type="number" name="percentage" component={Input} placeholder="Ingrese el porcentaje" />
                        </FormItem>
                        <FormItem
                            name="description"
                            label="Descripción"
                            invalid={Boolean(errors.description && touched.description)}
                            errorMessage={typeof errors.description === 'string' ? errors.description : undefined}
                        >
                            <Field type="text" name="description" component={Input} placeholder="Ingrese descripción" />
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
