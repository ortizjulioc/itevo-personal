'use client';
import { Button, FormItem, Input, Checkbox, Select } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';

import { createValidationSchema, initialValues } from '../form.config';
import SelectPromotion from '@/components/common/selects/select-promotion';
import SelectBranch from '@/components/common/selects/select-branch';
import { createCourseBranch } from '../../../lib/request';
import SelectTeacher from '@/components/common/selects/select-teacher';
import SelectCourse from '@/components/common/selects/select-course';
import DatePicker from '@/components/ui/date-picker';
import { MODALITIES } from '@/constants/modality.constant';
import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import Tooltip from '@/components/ui/tooltip';
import { TbQuestionMark } from 'react-icons/tb';

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


export default function CreateCourseBranchForm() {
    const route = useRouter();
    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);
        console.log('values', values);
        // const resp = await createCourseBranch(values);

        // if (resp.success) {
        //     openNotification('success', 'Curso creado correctamente');
        //     route.push(`/course-branch/${resp.data?.id}`);
        // } else {
        //     openNotification('error', resp.message);
        // }
        setSubmitting(false);
    };

    const stringToTime = (time: string | Date) => {
        if (time instanceof Date) {
            return time; // Si ya es un objeto Date, retornarlo
        }

        if (typeof time === 'string') {
            const [hours, minutes] = time.split(':');
            return new Date(new Date().setHours(Number(hours), Number(minutes), 0, 0));
        }

        throw new Error("Invalid time format: must be a string in 'HH:mm' format or a Date object");
    };


    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de oferta  academica</h4>
            <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">
                        <Tab.Group>
                            <Tab.List className=" flex flex-wrap">
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${selected ? 'text-secondary !outline-none before:!w-full' : ''} relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                                        >
                                            Información general
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${selected ? 'text-secondary !outline-none before:!w-full' : ''} relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                                        >
                                            Configuración financiera
                                        </button>
                                    )}
                                </Tab>
                                {/* <Tab className="pointer-events-none -mb-[1px] block rounded p-3.5 py-2 text-white-light dark:text-dark">
                                    Configuración financiera
                                </Tab> */}
                                <Tab className="pointer-events-none -mb-[1px] block rounded p-3.5 py-2 text-white-light dark:text-dark">
                                    Asignación de horarios
                                </Tab>
                                <Tab className="pointer-events-none -mb-[1px] block rounded p-3.5 py-2 text-white-light dark:text-dark">
                                    Confirmación
                                </Tab>
                                {/* <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${selected ? 'text-secondary !outline-none before:!w-full' : ''} relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                                        >
                                            Asignación de horarios
                                        </button>
                                    )}
                                </Tab> */}
                                {/* <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${selected ? 'text-secondary !outline-none before:!w-full' : ''} relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                                        >
                                            Confirmación
                                        </button>
                                    )}
                                </Tab> */}
                            </Tab.List>
                            <Tab.Panels>
                                <Tab.Panel>
                                    <div className="mt-6">
                                        <FormItem name="promotionId" label="Promocion" invalid={Boolean(errors.promotionId && touched.promotionId)} errorMessage={errors.promotionId}>
                                            <Field>
                                                {({ form, field }: any) => (
                                                    <SelectPromotion
                                                        {...form}
                                                        {...field}
                                                        value={values.promotionId}
                                                        onChange={(option: OptionSelect | null) => {
                                                            setFieldValue('promotionId', option?.value || '');
                                                        }}
                                                    />
                                                )}
                                            </Field>
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
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="mt-6">
                                        <FormItem
                                            extra={(<Tooltip title="Este es el costo que tendrá cada cuota"><span className='text-gray-600 bg-gray-200 rounded-full px-1 text-xs'>?</span></Tooltip>)}
                                            name='amount'
                                            label='Monto'
                                            invalid={Boolean(errors.amount && touched.amount)}
                                            errorMessage={errors.amount}
                                        >
                                            <Field
                                                type='number'
                                                name='amount'
                                                component={Input}
                                                placeholder='Ingrese el monto'
                                            />
                                        </FormItem>

                                        <FormItem name='modality' label='Modalidad' invalid={Boolean(errors.modality && touched.modality)} errorMessage={errors.modality}>
                                            <Select
                                                name="weekday"
                                                options={modalities}
                                                value={modalities.find((modality) => modality.value === values.modality)}
                                                onChange={(option: ModalityOption | null) => {
                                                    setFieldValue('modality', option?.value ?? null);
                                                }}
                                                isSearchable={false}
                                                placeholder="Selecciona una modalidad"
                                            />
                                        </FormItem>

                                        <FormItem name='startDate' label='Fecha de inicio' invalid={Boolean(errors.startDate && touched.startDate)} errorMessage={errors.startDate}>
                                            <DatePicker
                                                placeholder='Selecciona una fecha'
                                                value={values.startDate ? stringToTime(values.startDate) : undefined}
                                                onChange={(date: Date | Date[]) => {
                                                    const selectedDate = Array.isArray(date) ? date[0] : date; // Garantizamos que sea un único Date
                                                    setFieldValue('startDate', selectedDate);
                                                }}
                                            />
                                        </FormItem>

                                        <FormItem name='endDate' label='Fecha de fin' invalid={Boolean(errors.endDate && touched.endDate)} errorMessage={errors.endDate}>
                                            <DatePicker
                                                placeholder='Selecciona una fecha'
                                                value={values.endDate ? stringToTime(values.endDate) : undefined}
                                                onChange={(date: Date | Date[]) => {
                                                    const selectedDate = Array.isArray(date) ? date[0] : date; // Garantizamos que sea un único Date
                                                    setFieldValue('endDate', selectedDate);
                                                }}
                                            />
                                        </FormItem>

                                        <FormItem
                                            extra={(<Tooltip title="El porcentaje que recibirá el profesor por este curso"><span className='text-gray-600 bg-gray-200 rounded-full px-1 text-xs'>?</span></Tooltip>)}
                                            name='commissionRate'
                                            label='Comision'
                                            invalid={Boolean(errors.commissionRate && touched.commissionRate)}
                                            errorMessage={errors.commissionRate}
                                        >
                                            <Field type='number' name='commissionRate' component={Input} />
                                        </FormItem>

                                        <FormItem name="capacity" label="Capacidad" invalid={Boolean(errors.capacity && touched.capacity)} errorMessage={errors.capacity}>
                                            <Field type="number" name="capacity" component={Input} />
                                        </FormItem>
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>

                        <div className="mt-6 flex justify-end gap-2">
                            <Button type="button" color="danger" onClick={() => route.back()}>
                                Cancelar
                            </Button>
                            <Button loading={isSubmitting} type="submit">
                                {isSubmitting ? 'Guardando...' : 'Siguiente'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
