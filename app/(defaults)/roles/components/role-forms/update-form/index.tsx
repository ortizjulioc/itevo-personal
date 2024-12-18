'use client';
import { Button, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { updateValidationSchema } from '../form.config';
import { updateRole } from '../../../lib/request';
import { Role } from '@prisma/client';

export default function UpdateRoleForm({ initialValues }: { initialValues: Role }) {
    const route = useRouter();
    const handleSubmit = async (values: any) => {
        const data = { ...values };
      

        const resp = await updateRole(initialValues.id, data);
        console.log(resp);

        if (resp.success) {
            openNotification('success', 'Rol editado correctamente');
            route.push('/roles');
        } else {
            alert(resp.message);
        }
    }

    const onChangeName = (name: string, form: any) => {
        form.setFieldValue('name', name);
    };

    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Rol</h4>
            <Formik initialValues={initialValues} validationSchema={updateValidationSchema} onSubmit={handleSubmit}>
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
                            <Field type="text" name="normalizedName" component={Input} placeholder="Nombre normalizado" disabled />
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
