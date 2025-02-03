'use client';
import { Button, FormItem, Input,Checkbox } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';
import { createStudent } from '../../../lib/request';
import { FormatPatterInput } from '@/components/common';


export default function CreateStudentForm() {
  const route = useRouter();
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    const data = { ...values };
    delete data.confirmPassword;

    const resp = await createStudent(data);

    if (resp.success) {
      openNotification('success', 'Estudiante creado correctamente');
      route.push('/students');
    } else {
      openNotification('error', resp.message);
    }
    setSubmitting(false);
  };


  return (
    <div className="panel">
      <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Estudiante</h4>
      <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
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
            <FormItem 
              name="email"
              label="Correo electrónico"
              invalid={Boolean(errors.email && touched.email)} 
              errorMessage={errors.email}
              extra={<span className="text-sm text-gray-500">(Opcional)</span>}
              >
              <Field type="email" name="email" component={Input} />
            </FormItem>
            <FormItem name="hasTakenCourses" label="" invalid={Boolean(errors.hasTakenCourses && touched.hasTakenCourses)} errorMessage={errors.hasTakenCourses}>
              <Field type="checkbox" name="hasTakenCourses" component={Checkbox} >
                Ha tomado cursos anteriormente
              </Field>
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
