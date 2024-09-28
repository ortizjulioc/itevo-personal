'use client';
import { Button, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';
import { createBranch } from '../../../lib/request';
import { normalizeString } from '@/utils/normalize-string';


export default function CreateBranchForm() {
    const route = useRouter();
    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);
        const data = { ...values };
        delete data.confirmPassword;

        const resp = await createBranch(data);

        if (resp.success) {
            openNotification('success', 'Sucursal creada correctamente');
            route.push('/branches');
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };

    const onChangeName = (name: string, form: any) => {
        const address = normalizeString(name);
        form.setFieldValue('address', address);

        form.setFieldValue('name', name);
    };
    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Rol</h4>
            <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched }) => (
                    <Form className="form">
                          <FormItem name="name" label="Nombre" invalid={Boolean(errors.name && touched.name)} errorMessage={errors.name}>
                            <Field type="text" name="name" component={Input} placeholder="Nombre" />
                        </FormItem>

                        <FormItem name="address" label="Direccion" invalid={Boolean(errors.address && touched.address)} errorMessage={errors.address}>
                            <Field type="text" name="address" component={Input} placeholder="Direccion" />
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
