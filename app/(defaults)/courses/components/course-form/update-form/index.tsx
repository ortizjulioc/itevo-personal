'use client';
import { Button, Checkbox, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { updateValidationSchema } from '../form.config';
import { updateCourse } from '../../../lib/request';
import Tooltip from '@/components/ui/tooltip';
import PrerequisitesFields from '../prerrequisites-field';
import { CourseWithPrerequisites } from '../../../lib/use-fetch-courses';
import StickyFooter from '@/components/common/sticky-footer';
import { assignPrerequisiteToCourseBranch, unassignPrerequisiteToCourseBranch } from '@/app/(defaults)/course-branch/lib/request';
import { Course } from '@prisma/client';


export default function UpdateCourseForm({ initialValues }: { initialValues: CourseWithPrerequisites }) {
    const route = useRouter();
    const handleAddPrerequisite = async (courseId: string, prerequisite: Course, setValues: any) => {
        const prevPrerequisites = initialValues.prerequisites;
        setValues('prerequisites', [...prevPrerequisites, prerequisite]);
        const response = await assignPrerequisiteToCourseBranch(courseId, prerequisite.id);
        if (!response.success) {
            openNotification('error', response.message);
            setValues('prerequisites', prevPrerequisites);
        }
    };

    // Función para eliminar un prerrequisito
    const handleRemovePrerequisite = async (courseId: string, prerequisiteId: string, setValues: any) => {
        const prevPrerequisites = initialValues.prerequisites;
        const newPrerequisites = prevPrerequisites.filter((item) => item.id !== prerequisiteId);
        setValues('prerequisites', newPrerequisites);
        const response = await unassignPrerequisiteToCourseBranch(courseId, prerequisiteId);
        if (!response.success) {
            openNotification('error', response.message);
            setValues('prerequisites', prevPrerequisites);
        }
    };

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);
        const data = { ...values };
        delete data.prerequisites;
        const resp = await updateCourse(initialValues.id, data);
        if (resp.success) {
            openNotification('success', 'Curso actualizado correctamente');
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
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">
                        <div className='flex flex-col md:flex-row gap-4'>
                            <div className='w-full'>
                                <FormItem name="name" label="Nombre" invalid={Boolean(errors.name && touched.name)} errorMessage={errors.name}>
                                    <Field type="text" name="name" component={Input} />
                                </FormItem>
                                <FormItem name="description" label="Descripcion" invalid={Boolean(errors.description && touched.description)} errorMessage={errors.description}>
                                    <Field type="textarea" name="description" component={Input} />
                                </FormItem>
                                <FormItem
                                    extra={(<Tooltip title="La cantidad de veces que se impartirá el curso"><span className='text-gray-600 bg-gray-200 rounded-full px-1 text-xs'>?</span></Tooltip>)}
                                    name="duration"
                                    label="Cantidad de sesiones"
                                    invalid={Boolean(errors.duration && touched.duration)}
                                    errorMessage={errors.duration}
                                >
                                    <Field type="number" onWheel={(e: React.WheelEvent<HTMLInputElement>) => (e.target as HTMLInputElement).blur()} name="duration" component={Input} />
                                </FormItem>

                                <FormItem name="requiresGraduation" label="" invalid={Boolean(errors.requiresGraduation && touched.requiresGraduation)} errorMessage={errors.requiresGraduation}>
                                    <Field type="checkbox" name="requiresGraduation" component={Checkbox} >
                                        Este Curso Requiere Graduacion
                                    </Field>
                                </FormItem>
                            </div>
                            <div className='min-w-64'>
                                <PrerequisitesFields
                                    className='w-full'
                                    courseId={initialValues.id}
                                    prerequisites={values.prerequisites}
                                    onRemove={(id) => handleRemovePrerequisite(initialValues.id, id, setFieldValue)}
                                    onAdd={(course) => handleAddPrerequisite(initialValues.id, course, setFieldValue)}
                                />
                            </div>
                        </div>

                        <StickyFooter className='-mx-11 px-8 py-4' stickyClass='border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'>
                            <div className="flex justify-end gap-2">
                                <Button type="button" color="danger" onClick={() => route.back()}>
                                    Cancelar
                                </Button>
                                <Button loading={isSubmitting} type="submit">
                                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                                </Button>
                            </div>
                        </StickyFooter>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
