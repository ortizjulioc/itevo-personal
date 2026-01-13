'use client';
import { Button, FormItem, Input, Select, Checkbox } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';
import { createScholarship } from '@/app/(defaults)/scholarships/lib/request';

const scholarshipTypes = [
    { value: 'percentage', label: 'Porcentaje' },
    { value: 'fixed_amount', label: 'Monto Fijo' },
];

export default function CreateScholarshipForm() {
    const route = useRouter();
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);
        const resp = await createScholarship(values);

        if (resp.success) {
            openNotification('success', 'Beca creada correctamente');
            route.push('/scholarships');
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Becas</h4>
            <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, errors, touched, setFieldValue, values }) => (
                    <Form className="form">
                        <FormItem name="name" label="Nombre" invalid={Boolean(errors.name && touched.name)} errorMessage={errors.name as string}>
                            <Field type="text" name="name" component={Input} placeholder="Ingrese el nombre" />
                        </FormItem>

                        <FormItem name="description" label="Descripción" invalid={Boolean(errors.description && touched.description)} errorMessage={errors.description as string}>
                            <Field type="text" name="description" component={Input} placeholder="Ingrese la descripción" />
                        </FormItem>

                        <FormItem name="type" label="Tipo" invalid={Boolean(errors.type && touched.type)} errorMessage={errors.type as string}>
                            <Select
                                options={scholarshipTypes}
                                value={scholarshipTypes.find(option => option.value === values.type)}
                                onChange={(option: any) => setFieldValue('type', option?.value)}
                                placeholder="Seleccione el tipo"
                            />
                        </FormItem>

                        <FormItem name="value" label="Valor" invalid={Boolean(errors.value && touched.value)} errorMessage={errors.value as string}>
                            <Field type="number" name="value" component={Input} placeholder="Ingrese el valor" />
                        </FormItem>

                        <FormItem name="isActive" label="" invalid={Boolean(errors.isActive && touched.isActive)} errorMessage={errors.isActive as string}>
                            <Checkbox checked={values.isActive} onChange={(checked) => setFieldValue('isActive', checked)}>Activo</Checkbox>
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
