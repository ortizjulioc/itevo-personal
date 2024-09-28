'use client';
import { Button, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';
import { createRole } from '../../../lib/request';
import { normalizeString } from '@/utils/normalize-string';


export default function CreateRoleForm() {
    const route = useRouter();
    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);
        const data = { ...values };
        delete data.confirmPassword;

        const resp = await createRole(data);

        if (resp.success) {
            openNotification('success', 'Rol creado correctamente');
            route.push('/roles');
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };

    const onChangeName = (name: string, form: any) => {
        const normalizedName = normalizeString(name);
        form.setFieldValue('normalizedName', normalizedName);

        form.setFieldValue('name', name);
    };
    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Rol</h4>
            <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched }) => (
                    <Form className="form">
                        <FormItem name="name" label="Nombre" invalid={Boolean(errors.name && touched.name)} errorMessage={errors.name}>
                        <Field name='name'>
                            {({ field, form }:any) => (
                                <Input
                                field={field}
                                form={form}
                                type="text"
                                placeholder='Nombre'
                                value={values.name}
                                onChange={(e) => onChangeName(e.target.value, form)}
                                autoFocus
                                />
                            )}
                      </Field>
                        </FormItem>

                        <FormItem name="normalizedName" label="Nombre normalizado" invalid={Boolean(errors.normalizedName && touched.normalizedName)} errorMessage={errors.normalizedName}>
                            <Field type="text" name="normalizedName" component={Input} placeholder="Nombre normalizado" />
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
