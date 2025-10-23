'use client';
import { Button, FormItem, Select } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';
import DatePicker, { extractDate } from '@/components/ui/date-picker';
import { createEnrollment } from '../../../lib/request';
import SelectCourseBranch from '@/components/common/selects/select-course-branch';
import SelectStudent from '@/components/common/selects/select-student';
import StatusEnrollment, { EnrollmentStatus } from '@/components/common/info-labels/status/status-enrollment';
import Tooltip from '@/components/ui/tooltip';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { useState } from 'react';
import ModalOpenFormStudent from './modal-open-form-student';

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
    label: JSX.Element;
}

export default function CreateEnrollmentForm({ courseBranchId, studentId }: { courseBranchId?: string, studentId?: string }) {
    const route = useRouter();
    const [modal, setModal] = useState<boolean>(false);
    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);
        const data = { ...values };

        console.log('Submitting values:', data);


        const resp = await createEnrollment(data);

        if (resp.success) {
            openNotification('success', 'Inscripcion creada correctamente');
            route.push('/enrollments');
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };

    const statusOptions = [
        { value: 'WAITING', label: <StatusEnrollment status={EnrollmentStatus.WAITING} /> },
        { value: 'ENROLLED', label: <StatusEnrollment status={EnrollmentStatus.ENROLLED} /> },
        { value: 'COMPLETED', label: <StatusEnrollment status={EnrollmentStatus.COMPLETED} /> },
        { value: 'ABANDONED', label: <StatusEnrollment status={EnrollmentStatus.ABANDONED} /> },
    ]


    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de inscripción</h4>
            <Formik
                initialValues={{ ...initialValues, courseBranchId: courseBranchId || initialValues.courseBranchId, studentId: studentId || initialValues.studentId }}
                validationSchema={createValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">
                        <FormItem name="courseBranchId" label="Oferta Academica" invalid={Boolean(errors.courseBranchId && touched.courseBranchId)} errorMessage={errors.courseBranchId}>
                            <Field>
                                {({ form, field }: any) => (
                                    <SelectCourseBranch
                                        {...field}
                                        value={values.courseBranchId}
                                        onChange={(option: CourseBranchSelect | null) => {
                                            form.setFieldValue('courseBranchId', option?.value || '');
                                        }}
                                    />
                                )}
                            </Field>
                        </FormItem>

                        <FormItem
                            name="studentId"
                            label={
                                <div className="flex items-center gap-2">
                                    <span className="text-base leading-none">Estudiante</span>
                                    <Tooltip title="Crear estudiante">
                                        <button type="button" className="p-0.5 text-primary transition-colors duration-200 hover:text-primary/80" onClick={() => setModal(true)}>
                                            <IoMdAddCircleOutline className="h-6 w-6 align-middle" />
                                        </button>
                                    </Tooltip>
                                </div>
                            }
                            invalid={Boolean(errors.studentId && touched.studentId)}
                            errorMessage={errors.studentId}
                        >
                            <SelectStudent
                                value={values.studentId}
                                onChange={(option: OptionSelect | null) => {
                                    setFieldValue('studentId', option?.value || '');
                                }}
                            />
                        </FormItem>

                        <FormItem name="status" label="Estado" invalid={Boolean(errors.status && touched.status)} errorMessage={errors.status}>
                            <Select
                                name="status"
                                options={statusOptions}
                                value={statusOptions.find((status) => status.value === values.status)}
                                onChange={(newValue, _actionMeta) => {
                                    const option = newValue as statusOption | null;
                                    setFieldValue('status', option?.value ?? null);
                                }}
                                isSearchable={false}
                                placeholder="Selecciona un estado"
                            />
                        </FormItem>

                        <FormItem
                            name="enrollmentDate"
                            label="Fecha de Inscripcion"
                            invalid={Boolean(errors.enrollmentDate && touched.enrollmentDate)}
                            errorMessage={errors.enrollmentDate ? String(errors.enrollmentDate) : undefined}
                        >
                            <DatePicker
                                value={values.enrollmentDate}
                                onChange={(date) => setFieldValue('enrollmentDate', extractDate(date))}
                            />
                        </FormItem>

                        <div className="mt-6 flex justify-end gap-2">
                            <Button type="button" color="danger" onClick={() => route.back()}>
                                Cancelar
                            </Button>
                            <Button loading={isSubmitting} type="submit">
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
                            </Button>
                            <ModalOpenFormStudent
                                modal={modal} setModal={setModal}
                                setFieldValue={setFieldValue}

                            />
                        </div>
                    </Form>

                )}

            </Formik>

        </div>
    );
}
