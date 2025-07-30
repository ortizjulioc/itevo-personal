'use client';
import { Button, FormItem, Input, Checkbox } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';
import { createCourse } from '../../../lib/request';
import Tooltip from '@/components/ui/tooltip';


interface Props {
  onClose?: (id: string) => void;
}
export default function CreateCourseForm({ onClose }: Props) {
  const route = useRouter();
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    const data = { ...values };
    delete data.confirmPassword;

    const resp = await createCourse(data);

    if (resp.success) {
      openNotification('success', 'Curso creado correctamente');
      if (!onClose) {
        route.push('/courses');
      }
      onClose?.(resp?.data?.id || '');

    } else {
      openNotification('error', resp.message);
    }
    setSubmitting(false);
  };


  return (
    <div className="panel">
      <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Curso</h4>
      <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting, values, errors, touched }) => (
          <Form className="form">

            <FormItem name="name" label="Nombre" invalid={Boolean(errors.name && touched.name)} errorMessage={errors.name}>
              <Field type="text" name="name" component={Input} />
            </FormItem>
            <FormItem name="description" label="Descripcion" invalid={Boolean(errors.description && touched.description)} errorMessage={errors.description}>
              <Field type="textarea" name="description" component={Input} />
            </FormItem>
            <FormItem
              extra={(<Tooltip title="La cantidad de veces/semanas que se impartirá el curso. *Puede ser un estimado."><span className='text-gray-600 bg-gray-200 rounded-full px-1 text-xs'>?</span></Tooltip>)}
              name="duration"
              label="Cantidad de sesiones"
              invalid={Boolean(errors.duration && touched.duration)}
              errorMessage={errors.duration}
            >
              <Field type="number" name="duration" component={Input} />
            </FormItem>

            <FormItem name="requiresGraduation" label="" invalid={Boolean(errors.requiresGraduation && touched.requiresGraduation)} errorMessage={errors.requiresGraduation}>
              <Field type="checkbox" name="requiresGraduation" component={Checkbox} >
                Este Curso Requiere Graduacion
              </Field>
            </FormItem>

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" color="danger" onClick={() =>{ onClose ? onClose('') : route.back();}}>
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
