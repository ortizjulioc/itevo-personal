'use client';
import { Button, FormItem, Input, Checkbox } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';
import { createScholarship } from '@/app/(defaults)/scholarships/lib/request';

const percentageOptions = [
    { value: 50, label: '50%' },
    { value: 100, label: '100%' },
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

                        <FormItem name="value" label="Porcentaje de Beca" invalid={Boolean(errors.value && touched.value)} errorMessage={errors.value as string}>
                            <div className="flex gap-2 max-w-xs">
                                {percentageOptions.map((option) => (
                                    <Button
                                        key={option.value}
                                        type="button"
                                        size="sm"
                                        variant={values.value === option.value ? 'default' : 'outline'}
                                        color={values.value === option.value ? 'primary' : 'outline'}
                                        onClick={() => {
                                            setFieldValue('value', option.value);
                                            setFieldValue('type', 'percentage');
                                        }}
                                        className="flex-1"
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
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
