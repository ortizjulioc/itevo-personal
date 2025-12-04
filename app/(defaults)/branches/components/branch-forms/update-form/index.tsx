'use client';
import { Button, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { updateValidationSchema } from '../form.config';
import { updateBranch } from '../../../lib/request';
import { Branch } from '@prisma/client';
import { FormatPatterInput } from '@/components/common';

export default function UpdateBranchForm({ initialValues }: { initialValues: Branch }) {
    const route = useRouter();
    const handleSubmit = async (values: any) => {
        const data = { ...values };
        delete data.confirmPassword;

        const resp = await updateBranch(initialValues.id, data);


        if (resp.success) {
            openNotification('success', 'Sucursal editada correctamente');
            route.push('/branches');
        } else {
            alert(resp.message);
        }
    }


    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario  de sucursales</h4>
            <Formik initialValues={initialValues} validationSchema={updateValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched }) => (
                    <Form className="form">
                         <FormItem name="name" label="Nombre" invalid={Boolean(errors.name && touched.name)} errorMessage={errors.name}>
                            <Field type="text" name="name" component={Input} placeholder="Nombre" />
                        </FormItem>

                        <FormItem name="address" label="Direccion" invalid={Boolean(errors.address && touched.address)} errorMessage={errors.address}>
                            <Field type="text" name="address" component={Input} placeholder="Direccion" />
                        </FormItem>
                        <FormItem
                            extra={<span className="text-sm text-gray-500">(Opcional)</span>}
                            name="phone"
                            label="Teléfono"
                            invalid={Boolean(errors.phone && touched.phone)}
                            errorMessage={errors.phone}
                        >
                            <Field name="phone">
                                {({ form }: any) => (
                                    <FormatPatterInput
                                        format="(###) ###-####"
                                        placeholder="(___) ___-____"
                                        className="form-input"
                                        value={values.phone}
                                        onValueChange={(value: any) => {
                                            form.setFieldValue('phone', value.value);
                                        }}
                                    />
                                )}
                            </Field>
                        </FormItem>

                        <FormItem name="email" label="Correo electrónico" invalid={Boolean(errors.email && touched.email)} errorMessage={errors.email}>
                            <Field type="text" name="email" component={Input} placeholder="Correo electrónico" />
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
