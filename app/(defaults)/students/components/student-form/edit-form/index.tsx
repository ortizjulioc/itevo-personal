'use client';
import { Button, Checkbox, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { updateValidationSchema } from '../form.config';
import { FormatPatterInput } from '@/components/common';
import { Student } from '@prisma/client';
import { updateStudent } from '../../../lib/request';
import CaptureFingerPrint from '@/components/common/finger-print/capture-finger-print';
import MultiPhoneInput from '@/components/common/multi-phone-input';
import Dropdown from '@/components/dropdown';
import { useState } from 'react';

const mapIdentificationType: Record<string, string> = {
  cedula: 'Cédula',
  pasaporte: 'Pasaporte',
  otro: 'Otro',
};

type Props = {
  initialValues: Student;
};

export default function UpdateStudentForm({ initialValues }: Props) {
  const route = useRouter();
  const [fingerprint, setFingerprint] = useState('');

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);

    console.log('Submitting values:', values);

    const data = { ...values };
    const resp = await updateStudent(initialValues.id, data);

    if (resp.success) {
      openNotification('success', 'Estudiante actualizado correctamente');
      route.push('/students');
    } else {
      openNotification('error', resp.message);
    }

    setSubmitting(false);
  };

  return (
    <div className="panel">
      <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Estudiante</h4>
      <Formik
        initialValues={{
          ...initialValues,
          identificationType: (initialValues.identificationType ?? 'CEDULA').toUpperCase(),
          identification: (initialValues.identification ?? '').toUpperCase(),
          phone: initialValues.phone ?? '',
        }}
        validationSchema={updateValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, errors, touched, setFieldValue }) => {
          // Mostrar errores en consola
          console.log('Errores del formulario:', errors);

          return (
            <Form className="form">


              {/* Nombres */}
              <FormItem
                name="firstName"
                label="Nombres"
                invalid={Boolean(errors.firstName && touched.firstName)}
                errorMessage={errors.firstName}
              >
                <Field
                  type="text"
                  name="firstName"
                  component={Input}
                  onChange={(e: any) => setFieldValue('firstName', e.target.value.toUpperCase())}
                />
              </FormItem>

              {/* Apellidos */}
              <FormItem
                name="lastName"
                label="Apellidos"
                invalid={Boolean(errors.lastName && touched.lastName)}
                errorMessage={errors.lastName}
              >
                <Field
                  type="text"
                  name="lastName"
                  component={Input}
                  onChange={(e: any) => setFieldValue('lastName', e.target.value.toUpperCase())}
                />
              </FormItem>

              {/* Identificación */}
              <FormItem
                name="identification"
                label="Identificación"
                invalid={Boolean(errors.identification && touched.identification)}
                errorMessage={errors.identification}
              >
                <Field name="identification">
                  {() => (
                    <div className="flex">
                      <div className="dropdown">
                        <Dropdown
                          offset={[0, 5]}
                          placement="bottom-start"
                          btnClassName="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] cursor-pointer pt-2 pb-2"
                          button={
                            <span className="w-24">
                              {mapIdentificationType[(values.identificationType ?? 'CEDULA').toLowerCase()]}
                            </span>
                          }
                        >
                          <ul className="!min-w-[170px]">
                            {['CEDULA', 'PASAPORTE', 'OTRO'].map((type) => (
                              <li key={type}>
                                <button
                                  type="button"
                                  onClick={() => setFieldValue('identificationType', type)}
                                >
                                  {mapIdentificationType[type.toLowerCase()]}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </Dropdown>
                      </div>

                      {values.identificationType === 'CEDULA' ? (
                        <FormatPatterInput
                          format="###-#######-#"
                          placeholder="000-0000000-0"
                          className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                          value={values.identification ?? ''}
                          onValueChange={(value: any) =>
                            setFieldValue('identification', (value.value ?? '').toUpperCase())
                          }
                        />
                      ) : (
                        <Input
                          type="text"
                          placeholder=""
                          value={values.identification ?? ''}
                          onChange={(e) =>
                            setFieldValue('identification', e.target.value.toUpperCase())
                          }
                          className="ltr:rounded-l-none rtl:rounded-r-none"
                        />
                      )}
                    </div>
                  )}
                </Field>
              </FormItem>

              {/* Dirección */}
              <FormItem
                name="address"
                label="Dirección"
                invalid={Boolean(errors.address && touched.address)}
                errorMessage={errors.address}
              >
                <Field type="text" name="address" component={Input} textArea />
              </FormItem>

              {/* Teléfono */}
              <FormItem
                name="phone"
                label="Teléfono"
                invalid={Boolean(errors.phone && touched.phone)}
                errorMessage={errors.phone}
              >
                <Field name="phone">
                  {() => (
                    <MultiPhoneInput
                      phone={values.phone ?? ''}
                      onChange={(phones: string) => setFieldValue('phone', phones)}
                    />
                  )}
                </Field>
              </FormItem>

              {/* Email */}
              <FormItem
                name="email"
                label="Correo electrónico"
                invalid={Boolean(errors.email && touched.email)}
                errorMessage={errors.email}
              >
                <Field type="email" name="email" component={Input} />
              </FormItem>

              {/* Ha tomado cursos */}
              <FormItem
                name="hasTakenCourses"
                label=""
                invalid={Boolean(errors.hasTakenCourses && touched.hasTakenCourses)}
                errorMessage={errors.hasTakenCourses}
              >
                <Field type="checkbox" name="hasTakenCourses" component={Checkbox}>
                  Ha tomado cursos anteriormente
                </Field>
              </FormItem>

              {/* Captura de huella */}
              <CaptureFingerPrint onChange={(fp) => setFingerprint(fp)} />

              {/* Botones */}
              <div className="mt-6 flex justify-end gap-2">
                <Button type="button" color="danger" onClick={() => route.back()}>
                  Cancelar
                </Button>
                <Button loading={isSubmitting} type="submit">
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
