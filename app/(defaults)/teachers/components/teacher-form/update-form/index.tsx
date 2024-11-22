'use client';
import { Button, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { updateValidationSchema, initialValues } from '../form.config';
import { updateTeacher } from '../../../lib/request';
import { FormatPatterInput } from '@/components/common';
import { Teacher } from '@prisma/client';


export default function UpdateTeacherForm({ initialValues }: { initialValues: Teacher }) {
  const route = useRouter();

 

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    const data = { ...values };
    delete data.confirmPassword;

    const resp = await updateTeacher(initialValues.id,data);

    if (resp.success) {
      openNotification('success', 'Profesor creado correctamente');
      route.push('/teachers');
    } else {
      openNotification('error', resp.message);
    }
    setSubmitting(false);
  };


  return (
    <div className="panel">
      <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Profesor</h4>
      <Formik initialValues={initialValues} validationSchema={updateValidationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting, values, errors, touched }) => (
          <Form className="form">

            <FormItem name="firstName" label="Nombres" invalid={Boolean(errors.firstName && touched.firstName)} errorMessage={errors.firstName}>
              <Field type="text" name="firstName" component={Input} />
            </FormItem>
            <FormItem name="lastName" label="Apellidos" invalid={Boolean(errors.lastName && touched.lastName)} errorMessage={errors.lastName}>
              <Field type="text" name="lastName" component={Input} />
            </FormItem>

            <FormItem
              name="identification"
              label="Identificación"
              invalid={Boolean(errors.identification && touched.identification)}
              errorMessage={errors.identification}
            >
              <Field name="identification">
                {({ form }: any) => (
                  <FormatPatterInput
                    format="###-#######-#"
                    placeholder="000-0000000-0"
                    className="form-input"
                    value={values.identification}
                    onValueChange={(value: any) => {
                      console.log(value);
                      form.setFieldValue('identification', value.value);
                    }}
                  />
                )}
              </Field>
            </FormItem>
            <FormItem
              name="address"
              label="Dirección"
              invalid={Boolean(errors.address && touched.address)}
              errorMessage={errors.address}
              extra={<span className="text-sm text-gray-500">(Opcional)</span>}
            >
              <Field type="text" name="address" component={Input} />
            </FormItem>
            <FormItem

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
              <Field type="email" name="email" component={Input} />
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
