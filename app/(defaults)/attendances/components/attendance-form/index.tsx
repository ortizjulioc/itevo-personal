'use client';
import { Button, FormItem, Input, Select } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';
import Swal from 'sweetalert2';
import { normalizeString } from '@/utils/normalize-string';
import { createAttendance, getFingerPrintById } from '../../lib/request';
import SelectCourseBranch from '@/components/common/selects/select-course-branch';
import SelectStudent, { StudentSelect } from '@/components/common/selects/select-student';
import StatusAttendance from '../status-attendance';
import { AttendanceStatus } from '@prisma/client';
import { CourseBranchSelectOption } from '@/app/(defaults)/enrollments/components/enrollment-form/update-form';
import { CSSObjectWithLabel, StylesConfig } from 'react-select';
import CompareFingerPrint from '@/components/common/finger-print/compare-finger-print';
import { useState } from 'react';

interface statusOption {
    value: string;
    label: JSX.Element;
}
const customStyles: StylesConfig<statusOption, false> = {
    menuPortal: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
        ...base,
        zIndex: 9999,
    }),
    menu: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
        ...base,
        zIndex: 9999,
    }),
};
interface CreateAttendanceFormProps {
    onCancel?: () => void;
    onSuccess?: () => void;
}

export default function CreateAttendanceForm({ onCancel, onSuccess }: CreateAttendanceFormProps) {
    //const route = useRouter();
    const [fingerPrint, setFingerPrint] = useState('');
    const [validate, setValidate] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
        setSubmitting(true);
        console.log(values);

        // Si es PRESENT y no hay validación biométrica
        if (values.status === AttendanceStatus.PRESENT && !validate) {
            const result = await Swal.fire({
                title: 'Confirmar asistencia sin huella',
                text: 'No se ha confirmado la huella. ¿Desea registrar la asistencia de todos modos?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, registrar',
                cancelButtonText: 'Cancelar',
            });

            if (!result.isConfirmed) {
                setSubmitting(false);
                return;
            }
        }

        const data = { ...values };
        const resp = await createAttendance(data);
        console.log('Respuesta:', resp); // <-- esto deberías verlo

        if (resp.success) {
            console.log('¡Success detectado!'); // <-- esto debería verse también
            openNotification('success', 'Asistencia registrada correctamente');
            onSuccess?.();
            resetForm();
            setFingerPrint('');
            setValidate(false);
        } else {
            console.log('¡Success FALSO!');
            openNotification('error', resp.message);
        }

        setSubmitting(false);
    };

    const statusOptions = [
        { value: AttendanceStatus.PRESENT, label: <StatusAttendance status={AttendanceStatus.PRESENT} /> },
        { value: AttendanceStatus.ABSENT, label: <StatusAttendance status={AttendanceStatus.ABSENT} /> },
        { value: AttendanceStatus.EXCUSED, label: <StatusAttendance status={AttendanceStatus.EXCUSED} /> },
    ];

    const handleStudentChange = async (option: StudentSelect | null, setFieldValue: (field: string, value: any) => void) => {
        setFieldValue('studentId', option?.value || '');

        if (!option?.value) {
            setFingerPrint('');
            return;
        }

        try {
            setLoading(true);
            const fingerPrint = await getFingerPrintById(option.value);
            console.log(fingerPrint);

            const template = fingerPrint.data?.template;

            let asString = '';

            if (template && typeof template === 'object') {
                const byteArray = Object.values(template);
                const uint8 = Uint8Array.from(byteArray);
                asString = Buffer.from(uint8).toString('base64');
            }

            setFingerPrint(asString);
            setValidate(false);
        } catch (error) {
            console.error('Error al obtener la huella:', error);
            setFingerPrint('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Asistencia</h4>
            <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched }) => (
                    <Form className="form">
                        <FormItem name="courseBranchId" label="Oferta Academica" invalid={Boolean(errors.courseBranchId && touched.courseBranchId)} errorMessage={errors.courseBranchId}>
                            <Field>
                                {({ form, field }: any) => (
                                    <SelectCourseBranch
                                        {...field}
                                        value={values.courseBranchId}
                                        onChange={(option: CourseBranchSelectOption | null) => {
                                            form.setFieldValue('courseBranchId', option?.value || '');
                                        }}
                                    />
                                )}
                            </Field>
                        </FormItem>
                        <FormItem name="studentId" label="Estudiante" invalid={Boolean(errors.studentId && touched.studentId)} errorMessage={errors.studentId}>
                            <Field>
                                {({ form, field }: any) => <SelectStudent value={values.studentId} onChange={(option) => handleStudentChange(option, form.setFieldValue)} loading={loading} />}
                            </Field>
                        </FormItem>
                        <FormItem name="status" label="Estado" invalid={Boolean(errors.status && touched.status)} errorMessage={errors.status}>
                            <Field>
                                {({ form, field }: any) => (
                                    <Select
                                        name="status"
                                        options={statusOptions}
                                        value={statusOptions.find((status) => status.value === values.status)}
                                        onChange={(newValue, _actionMeta) => {
                                            const option = newValue as statusOption | null;
                                            form.setFieldValue('status', option?.value ?? null);
                                        }}
                                        isSearchable={false}
                                        placeholder="Selecciona un estado"
                                        styles={{
                                            menuPortal: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
                                                ...base,
                                                zIndex: 9999,
                                            }),
                                            menu: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
                                                ...base,
                                                zIndex: 9999,
                                            }),
                                        }}
                                        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                                    />
                                )}
                            </Field>
                        </FormItem>

                        <CompareFingerPrint previousFingerprint={fingerPrint} onSuccess={() => setValidate(true)} />

                        <div className="mt-6 flex justify-end gap-2">
                            <Button type="button" color="danger" onClick={() => onCancel?.()}>
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
