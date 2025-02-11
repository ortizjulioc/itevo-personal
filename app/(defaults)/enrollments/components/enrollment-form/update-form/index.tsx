'use client';
import { Button, Checkbox, FormItem, Input, Select } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { updateValidationSchema } from '../form.config';
import { Enrollment } from '@prisma/client';
import DatePicker from '@/components/ui/date-picker';
import { updateEnrollment } from '../../../lib/request';
import { ENROLLMENT_STATUS } from '@/constants/enrollment.status.constant';
import SelectCourseBranch from '@/components/common/selects/select-course-branch';
import SelectStudent from '@/components/common/selects/select-student';



interface OptionSelect {
    value: string;
    label: string;
}
interface CourseBranchSelect {
    value: string;
    label: JSX.Element;
}
interface statusOption {
    value: string;
    label: string;
}


export default function UpdateEnrollmentForm({ initialValues }: { initialValues: Enrollment }) {
    const route = useRouter();



    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);
        const data = { ...values };
        console.log(data);


        const resp = await updateEnrollment(initialValues.id, data);

        if (resp.success) {
            openNotification('success', 'Inscripcion creada correctamente');
            route.push('/enrollments');
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };
     const enrollmentStatus = [
            { value: ENROLLMENT_STATUS.WAITING, label: 'En espera' },
            { value: ENROLLMENT_STATUS.ENROLLED, label: 'Inscrito' },
            { value: ENROLLMENT_STATUS.COMPLETED, label: 'Completado' },
            { value: ENROLLMENT_STATUS.ABANDONED, label: 'Abandonado' },
        ];


    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Inscripcion</h4>
            <Formik initialValues={initialValues} validationSchema={updateValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">
                       <FormItem name="courseBranchId" label="Oferta Academica" invalid={Boolean(errors.courseBranchId && touched.courseBranchId)} errorMessage={errors.courseBranchId}>
                            <SelectCourseBranch
                                value={values.courseBranchId}
                                onChange={(option: CourseBranchSelect | null) => {
                                    setFieldValue('courseBranchId', option?.value || '');
                                }}
                            />
                        </FormItem>

                        <FormItem name="studentId" label="Estudiante" invalid={Boolean(errors.studentId && touched.studentId)} errorMessage={errors.studentId}>
                            <SelectStudent
                                value={values.studentId}
                                onChange={(option: OptionSelect | null) => {
                                    setFieldValue('studentId', option?.value || '');
                                }}
                            />
                        </FormItem>

                        <FormItem name='status' label='Estado' invalid={Boolean(errors.status && touched.status)} errorMessage={errors.status}>
                            <Select
                                name="status"
                                options={enrollmentStatus}
                                value={enrollmentStatus.find((status) => status.value === values.status)}
                                onChange={(option: statusOption | null) => {
                                    setFieldValue('status', option?.value ?? null);
                                }}
                                isSearchable={false}
                                placeholder="Selecciona un estado"
                            />
                        </FormItem>


                        <FormItem name="enrollmentDate" label="Fecha de Inscripcion" invalid={Boolean(errors.enrollmentDate && touched.enrollmentDate)} errorMessage={errors.enrollmentDate ? String(errors.enrollmentDate) : undefined}>
                            <DatePicker

                                value={values.enrollmentDate}
                                onChange={(date: Date | Date[]) => {
                                    if (date instanceof Date) {
                                        setFieldValue('enrollmentDate', date);
                                    } else if (Array.isArray(date) && date.length > 0) {
                                        setFieldValue('enrollmentDate', date[0]);
                                    }
                                }}
                            />
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
