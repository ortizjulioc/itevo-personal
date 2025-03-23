'use client';
import { Button, Checkbox, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { updateValidationSchema } from '../form.config';
import { Course } from '@prisma/client';
import { updateCourse } from '../../../lib/request';


export default function UpdateCourseForm({ initialValues }: { initialValues: Course }) {
    const route = useRouter();

        

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);
        const data = { ...values };
    

        const resp = await updateCourse(initialValues.id, data);

        if (resp.success) {
            openNotification('success', 'Estudiante creado correctamente');
            route.push('/courses');
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };


    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Curso</h4>
            <Formik initialValues={initialValues} validationSchema={updateValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched }) => (
                    <Form className="form">

                        <FormItem name="code" label="Codigo" invalid={Boolean(errors.code && touched.code)} errorMessage={errors.code}>
                            <Field type="text" name="code" component={Input} disabled />
                        </FormItem>

                        <FormItem name="name" label="Nombre" invalid={Boolean(errors.name && touched.name)} errorMessage={errors.name}>
                            <Field type="text" name="name" component={Input} />
                        </FormItem>
                        <FormItem name="description" label="Descripcion" invalid={Boolean(errors.description && touched.description)} errorMessage={errors.description}>
                            <Field type="textarea" name="description" component={Input} />
                        </FormItem>
                        <FormItem name="duration" label="Duracion" extra="(horas)" invalid={Boolean(errors.duration && touched.duration)} errorMessage={errors.duration}>
                            <Field type="number" name="duration" component={Input} />
                        </FormItem>



                        <FormItem name="requiresGraduation" label="" invalid={Boolean(errors.requiresGraduation && touched.requiresGraduation)} errorMessage={errors.requiresGraduation}>
                            <Field type="checkbox" name="requiresGraduation" component={Checkbox} >
                                Este Curso Requiere Graduacion
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
