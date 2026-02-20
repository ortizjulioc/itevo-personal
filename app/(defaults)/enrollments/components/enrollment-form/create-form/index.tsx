'use client';
import React from 'react';
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
import { MdCardGiftcard } from 'react-icons/md';
import { useState, useEffect } from 'react';
import ModalOpenFormStudent from './modal-open-form-student';
import AssignScholarshipDrawer from '@/components/common/drawers/assign-scholarship-drawer';
import { getScholarships } from '@/app/(defaults)/students/lib/student-scholarship-request';
import { useSession } from 'next-auth/react';
import { SUPER_ADMIN, GENERAL_ADMIN, ADMIN } from '@/constants/role.constant';

interface OptionSelect {
    value: string;
    label: string;
}
interface CourseBranchSelect {
    value: string;
    label: React.ReactElement;
}
interface statusOption {
    value: string;
    label: React.ReactElement;
}

export default function CreateEnrollmentForm({ courseBranchId, studentId }: { courseBranchId?: string, studentId?: string }) {
    const route = useRouter();
    const [modal, setModal] = useState<boolean>(false);
    const [scholarshipDrawer, setScholarshipDrawer] = useState<boolean>(false);
    const [selectedStudentId, setSelectedStudentId] = useState<string>(studentId || '');
    const [selectedCourseBranchId, setSelectedCourseBranchId] = useState<string>(courseBranchId || '');
    const [applicableScholarship, setApplicableScholarship] = useState<any>(null);
    const [loadingScholarship, setLoadingScholarship] = useState<boolean>(false);
    const { data: session } = useSession();

    // Verificar si el usuario tiene permisos para asignar becas
    const userRoles = (session?.user as any)?.roles || [];
    const canManageScholarships = userRoles.some((role: any) =>
        [SUPER_ADMIN, GENERAL_ADMIN, ADMIN].includes(role.normalizedName)
    );

    // Verificar becas aplicables cuando cambia el estudiante o la oferta académica
    useEffect(() => {
        const checkScholarships = async () => {
            if (!selectedStudentId) {
                setApplicableScholarship(null);
                return;
            }

            setLoadingScholarship(true);
            try {
                const response = await getScholarships(selectedStudentId);
                if (response.success && response.data?.data) {
                    const scholarships = response.data.data;
                    const now = new Date();

                    // Buscar beca aplicable
                    const applicable = scholarships.find((scholarship: any) => {
                        // Debe estar activa
                        if (!scholarship.active) return false;

                        // No debe estar vencida
                        if (scholarship.validUntil && new Date(scholarship.validUntil) < now) return false;

                        // Debe corresponder a la oferta académica o ser general (null)
                        if (scholarship.courseBranch) {
                            return scholarship.courseBranch.id === selectedCourseBranchId;
                        }

                        // Beca general (sin oferta académica específica)
                        return true;
                    });

                    console.log('Applicable Scholarship:', applicable);
                    setApplicableScholarship(applicable || null);
                }
            } catch (error) {
                console.error('Error checking scholarships:', error);
            } finally {
                setLoadingScholarship(false);
            }
        };

        checkScholarships();
    }, [selectedStudentId, selectedCourseBranchId]);

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
        { value: 'CONFIRMED', label: <StatusEnrollment status={EnrollmentStatus.CONFIRMED} /> },
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
                                            setSelectedCourseBranchId(option?.value || '');
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
                                    setSelectedStudentId(option?.value || '');
                                }}
                            />

                            {canManageScholarships && values.studentId && !loadingScholarship && (
                                applicableScholarship ? (
                                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <MdCardGiftcard className="w-5 h-5 text-green-600 dark:text-green-400" />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                                                    Beca: {applicableScholarship.scholarship?.name}
                                                </p>
                                                <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                                                    Cobertura: {applicableScholarship.scholarship?.type === 'percentage'
                                                        ? `${applicableScholarship.scholarship?.value}%`
                                                        : `$${applicableScholarship.scholarship?.value?.toLocaleString()}`}
                                                    {' • '}
                                                    {applicableScholarship.courseBranch
                                                        ? 'Específica para este curso'
                                                        : 'Beca general'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        color="success"
                                        icon={<MdCardGiftcard className="w-4 h-4" />}
                                        onClick={() => setScholarshipDrawer(true)}
                                        className="mt-2 w-full"
                                    >
                                        Asignar Beca (Opcional)
                                    </Button>
                                )
                            )}

                            {canManageScholarships && values.studentId && loadingScholarship && (
                                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                        Verificando becas...
                                    </p>
                                </div>
                            )}
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
                        </div>

                        <ModalOpenFormStudent
                            modal={modal}
                            setModal={setModal}
                            setFieldValue={setFieldValue}
                        />

                        {canManageScholarships && (
                            <AssignScholarshipDrawer
                                isOpen={scholarshipDrawer}
                                onClose={() => setScholarshipDrawer(false)}
                                studentId={selectedStudentId}
                                courseBranchId={selectedCourseBranchId}
                            />
                        )}
                    </Form>

                )}

            </Formik>

        </div>
    );
}
