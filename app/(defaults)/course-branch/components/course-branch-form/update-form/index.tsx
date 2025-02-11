'use client';
import { Button,  FormItem, Input, Select } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { updateValidationSchema } from '../form.config';
import { CourseBranch } from '@prisma/client';
import { updateCourseBranch } from '../../../lib/request';
import DatePicker from '@/components/ui/date-picker';
import SelectPromotion from '@/components/common/selects/select-promotion';
import { MODALITIES } from '@/constants/modality.constant';
import SelectBranch from '@/components/common/selects/select-branch';
import SelectTeacher from '@/components/common/selects/select-teacher';
import SelectCourse from '@/components/common/selects/select-course';



interface OptionSelect {
  value: string;
  label: string;
}

interface ModalityOption {
  value: string;
  label: string;
}

const modalities: ModalityOption[] = [
  { value: MODALITIES.PRESENTIAL, label: 'Presencial' },
  { value: MODALITIES.VIRTUAL, label: 'Virtual' },
  { value: MODALITIES.HYBRID, label: 'Hibrido' },
];

const stringToTime = (time: string | Date) => {
  if (time instanceof Date) {
    return time; // Si ya es un objeto Date, retornarlo
  }

  if (typeof time === 'string') {
    const [hours, minutes] = time.split(':');
    return new Date(new Date().setHours(Number(hours), Number(minutes), 0, 0));
  }

  return new Date();
};


export default function UpdateCourseBranchForm({ initialValues }: { initialValues: CourseBranch }) {
    const route = useRouter();
    



    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);
        const data = { ...values };
       


        const resp = await updateCourseBranch(initialValues.id, data);

        if (resp.success) {
            openNotification('success', 'Oferta academica  creado correctamente');
            route.push('/course-branch');
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };
    const formattedInitialValues = {
        ...initialValues,
        startDate: new Date(initialValues.startDate),
        endDate: new Date(initialValues.endDate),
    };
    

    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Oferta academica</h4>
            <Formik initialValues={formattedInitialValues} validationSchema={updateValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched,setFieldValue }) => (
                    <Form className="form">


                        <FormItem name="promotionId" label="Promocion" invalid={Boolean(errors.promotionId && touched.promotionId)} errorMessage={errors.promotionId}>
                            <SelectPromotion
                                value={values.promotionId}
                                onChange={(option: OptionSelect | null) => {
                                    setFieldValue('promotionId', option?.value || '');
                                }}
                            />
                        </FormItem>
                        <FormItem name="branchId" label="Sucursal" invalid={Boolean(errors.branchId && touched.branchId)} errorMessage={errors.branchId}>
                            <SelectBranch
                                value={values.branchId}
                                onChange={(option: OptionSelect | null) => {
                                    setFieldValue('branchId', option?.value || '');
                                }}
                            />
                        </FormItem>

                        <FormItem name="teacherId" label="Profesor" invalid={Boolean(errors.teacherId && touched.teacherId)} errorMessage={errors.teacherId}>
                            <SelectTeacher
                                value={values.teacherId}
                                onChange={(option: OptionSelect | null) => {
                                    setFieldValue('teacherId', option?.value || '');
                                }}
                            />
                        </FormItem>

                        <FormItem name="courseId" label="Curso" invalid={Boolean(errors.courseId && touched.courseId)} errorMessage={errors.courseId}>
                            <SelectCourse
                                value={values.courseId}
                                onChange={(option: OptionSelect | null) => {
                                    setFieldValue('courseId', option?.value || '');
                                }}
                            />
                        </FormItem>

                        <FormItem name='amount' label='Monto' invalid={Boolean(errors.amount && touched.amount)} errorMessage={errors.amount}>
                            <Field type='number' name='amount' component={Input} />
                        </FormItem>

                        <FormItem name='modality' label='Modalidad' invalid={Boolean(errors.modality && touched.modality)} errorMessage={errors.modality}>
                            <Select
                                name="modality"
                                options={modalities}
                                value={modalities.find((modality) => modality.value === values.modality)}
                                onChange={(option: ModalityOption | null) => {
                                    setFieldValue('modality', option?.value ?? null);
                                }}
                                isSearchable={false}
                                placeholder="Selecciona una modalidad"
                            />
                        </FormItem>

                        <FormItem name='startDate' label='Fecha de inicio' invalid={Boolean(errors.startDate && touched.startDate)} errorMessage={errors.startDate ? String(errors.startDate) : undefined}>
                            <DatePicker
                                value={values.startDate ? stringToTime(values.startDate) : undefined}
                                onChange={(date: Date | Date[]) => {
                                    const selectedDate = Array.isArray(date) ? date[0] : date; // Garantizamos que sea un único Date
                                    setFieldValue('startDate', selectedDate);
                                }}
                            />
                        </FormItem>

                        <FormItem name='endDate' label='Fecha de fin' invalid={Boolean(errors.endDate && touched.endDate)} errorMessage={errors.endDate ? String(errors.endDate) : undefined}>
                            <DatePicker
                                value={values.endDate ? stringToTime(values.endDate) : undefined}
                                onChange={(date: Date | Date[]) => {
                                    const selectedDate = Array.isArray(date) ? date[0] : date; // Garantizamos que sea un único Date
                                    setFieldValue('endDate', selectedDate);
                                }}
                            />
                        </FormItem>

                        <FormItem name='commissionRate' label='Comision' invalid={Boolean(errors.commissionRate && touched.commissionRate)} errorMessage={errors.commissionRate}>
                            <Field type='number' name='commissionRate' component={Input} />
                        </FormItem>




                        <FormItem name="capacity" label="Capacidad" invalid={Boolean(errors.capacity && touched.capacity)} errorMessage={errors.capacity}>
                            <Field type="number" name="capacity" component={Input} />
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
