'use client';
import { Button, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { updateValidationSchema } from './form.config';
import { Setting } from '@prisma/client';
import { FormatPatterInput } from '@/components/common';
import { updateSetting } from '../../../lib/settings/request';

export default function UpdateSettingForm({ initialValues }: { initialValues: Setting }) {
    const route = useRouter();
    const handleSubmit = async (values: any) => {
        const data = { ...values };

        const resp = await updateSetting(initialValues.id, data);
        console.log(resp);

        if (resp.success) {
            openNotification('success', 'Configuracion editada correctamente');
        } else {
            alert(resp.message);
        }
    }

   
    return (
        <div>

            <Formik initialValues={initialValues} validationSchema={updateValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched }) => (
                    <Form className="form">
                         <FormItem name="rnc" label="RNC" invalid={Boolean(errors.rnc && touched.rnc)} errorMessage={errors.rnc}>
                            <Field type="text" name="rnc" component={Input} placeholder="RNC" />
                        </FormItem>
                        <FormItem name="companyName" label="Nombre de la empresa" invalid={Boolean(errors.companyName && touched.companyName)} errorMessage={errors.companyName}>
                            <Field type="text" name="companyName" component={Input} placeholder="Nombre de la empresa" />
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
                        <FormItem name="logo" label="Logo" invalid={Boolean(errors.logo && touched.logo)} errorMessage={errors.logo}>
                            <Field type="text" name="logo" component={Input} placeholder="Logo" />
                        </FormItem>

                        <FormItem name="email" label="Correo" invalid={Boolean(errors.email && touched.email)} errorMessage={errors.email}>
                            <Field type="email" name="email" component={Input} placeholder="Correo" />
                        </FormItem>

                        <FormItem name="defaultPassword" label="Cambiar contraseña por defecto" invalid={Boolean(errors.defaultPassword && touched.defaultPassword)} errorMessage={errors.defaultPassword}>
                            <Field type="text" name="defaultPassword" component={Input} placeholder="Contraseña" />
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
