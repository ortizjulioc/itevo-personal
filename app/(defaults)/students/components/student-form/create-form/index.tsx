'use client';
import { Button, FormItem, Input, Checkbox } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';
import { createStudent } from '../../../lib/request';
import { FormatPatterInput } from '@/components/common';
import MultiPhoneInput from '@/components/common/multi-phone-input';
import { useState } from 'react';
import CaptureFingerPrint from '@/components/common/finger-print/capture-finger-print';
import Dropdown from '@/components/dropdown';

interface CreateStudentFormProps {
  onClose?: (id: string) => void;
}

const mapIdentificationType: Record<string, string> = {
  cedula: 'Cédula',
  pasaporte: 'Pasaporte',
  otro: 'Otro',
};

export default function CreateStudentForm({ onClose }: CreateStudentFormProps) {
  const route = useRouter();
  const [fingerprint, setFingerprint] = useState('')


  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    let data;

    if (fingerprint) {
      data = {
        ...values,
        fingerprint,
        sensorType: '2connect'

      };

    } else {
      data = values
    }


    const resp = await createStudent(data);

    if (resp.success) {

      openNotification('success', 'Estudiante creado correctamente');

      if (!onClose) {
        route.push('/students');
      }
      onClose?.(resp.data?.id || '')

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

            <FormItem name="identification" label="Identificación" invalid={Boolean(errors.identification && touched.identification)} errorMessage={errors.identification}>
              <Field name="identification">
                {({ form }: any) => (
                  <>
                    <div className="flex">
                      <div className="dropdown">
                        <Dropdown
                          offset={[0, 5]}
                          placement={`bottom-start`}
                          btnClassName="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] cursor-pointer pt-2 pb-2"
                          button={<span className='w-24'>{mapIdentificationType[values.identificationType]}</span>}
                        >
                          <ul className="!min-w-[170px]">
                            <li>
                              <button type="button" onClick={() => form.setFieldValue('identificationType', 'cedula')}>Cédula</button>
                            </li>
                            <li>
                              <button type="button" onClick={() => form.setFieldValue('identificationType', 'pasaporte')}>Pasaporte</button>
                            </li>
                            <li>
                              <button type="button" onClick={() => form.setFieldValue('identificationType', 'otro')}>Otro</button>
                            </li>
                          </ul>
                        </Dropdown>
                      </div>
                      {values.identificationType === 'cedula' ? (
                        <FormatPatterInput
                          format="###-#######-#"
                          placeholder="000-0000000-0"
                          className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                          value={values.identification}
                          onValueChange={(value: any) => {
                            form.setFieldValue('identification', value.value);
                          }}
                        />
                      ) : (
                        <Input
                          type="text"
                          placeholder=""
                          value={values.identification}
                          onChange={(e) => form.setFieldValue('identification', e.target.value)}
                          className="ltr:rounded-l-none rtl:rounded-r-none"
                        />
                      )}
                    </div>
                  </>
                )}
              </Field>
            </FormItem>
            <FormItem
              name="address"
              label="Dirección"
              invalid={Boolean(errors.address && touched.address)}
              errorMessage={errors.address}
            >
              <Field type="text" name="address" component={Input} textArea />
            </FormItem>

            <FormItem name="phone" label="Teléfono" invalid={Boolean(errors.phone && touched.phone)} errorMessage={errors.phone}>
              <Field name="phone">
                {({ form }: any) => (
                  <MultiPhoneInput
                    phone={values.phone}
                    onChange={(phones: string) => {
                      form.setFieldValue('phone', phones);
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
            >
              <Field type="email" name="email" component={Input} />
            </FormItem>
            <FormItem name="hasTakenCourses" label="" invalid={Boolean(errors.hasTakenCourses && touched.hasTakenCourses)} errorMessage={errors.hasTakenCourses}>
              <Field type="checkbox" name="hasTakenCourses" component={Checkbox}>
                Ha tomado cursos anteriormente
              </Field>
            </FormItem>

            <CaptureFingerPrint
              onChange={(fingerprint) => { setFingerprint(fingerprint) }}
            />

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" color="danger" onClick={() => {
                onClose ? onClose('') : route.back();

              }}>
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
