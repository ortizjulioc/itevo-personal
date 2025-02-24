'use client';
import { Button } from '@/components/ui';
import { Form, Formik } from 'formik';
import { usePathname, useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { updateValidationSchema } from '../form.config';
import { CourseBranch } from '@prisma/client';
import { updateCourseBranch } from '../../../lib/request';
import { Tab } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import GeneralInformationFields from './general-information-fields';
import FinancialConfigFields from './financial-config-fields';
import { TbArrowLeft, TbArrowRight } from 'react-icons/tb';
import ScheduleAssignmentFields from './schedule-assignment-fields';

const COURSE_BRANCH_TABS = [
    'general-information',
    'schedule-assignment',
    'financial-config',
    'confirmation',
];

export default function UpdateCourseBranchForm({ initialValues }: { initialValues: CourseBranch }) {
    const route = useRouter();
    const pathname = usePathname();
    const [selectedIndex, setSelectedIndex] = useState(0);
    console.log(initialValues);

    const handleTabChange = (index: number) => {
        setSelectedIndex(index);
        window.history.replaceState(null, '', `${pathname}#${COURSE_BRANCH_TABS[index]}`);
    };

    const changeTab = (index: number) => {
        setSelectedIndex(index);
        window.history.replaceState(null, '', `${pathname}#${COURSE_BRANCH_TABS[index]}`);
    };

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

    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        const tabIndex = COURSE_BRANCH_TABS.indexOf(hash);
        if (tabIndex !== -1) {
            setSelectedIndex(tabIndex);
        }
    }, []);

    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Oferta academica</h4>
            <Formik initialValues={initialValues} validationSchema={updateValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched }) => (
                    <Form className="form">

                        <Tab.Group selectedIndex={selectedIndex} onChange={handleTabChange}>
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
                                            Modalidad y horarios
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
                                <Tab className="pointer-events-none -mb-[1px] block rounded p-3.5 py-2 text-white-light dark:text-dark">
                                    Confirmación
                                </Tab>
                            </Tab.List>
                            <Tab.Panels>
                                <Tab.Panel>
                                    <GeneralInformationFields className='p-4' values={values} errors={errors} touched={touched} />
                                </Tab.Panel>

                                <Tab.Panel>
                                    <ScheduleAssignmentFields className='p-4' values={values} errors={errors} touched={touched} />
                                </Tab.Panel>

                                <Tab.Panel>
                                    <FinancialConfigFields className='p-4' values={values} errors={errors} touched={touched} />
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>


                        {/* <FormItem name="promotionId" label="Promocion" invalid={Boolean(errors.promotionId && touched.promotionId)} errorMessage={errors.promotionId}>
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
                        </FormItem> */}



                        <div className="mt-6 flex justify-between gap-2">
                            <Button type="button" color="danger" onClick={() => route.back()}>
                                Cancelar
                            </Button>

                            <div className="flex gap-2">
                                {selectedIndex > 0 && (
                                    <Button
                                        type="button"
                                        color="secondary"
                                        onClick={() => changeTab(selectedIndex - 1)}
                                        icon={<TbArrowLeft />}
                                    >
                                        Anterior
                                    </Button>
                                )}

                                {selectedIndex < COURSE_BRANCH_TABS.length - 1 && (
                                    <Button
                                        type="button"
                                        color="secondary"
                                        onClick={() => changeTab(selectedIndex + 1)}
                                        icon={<TbArrowRight />}
                                    >
                                        Siguiente
                                    </Button>
                                )}
                                {selectedIndex === COURSE_BRANCH_TABS.length - 1 && (
                                    <Button loading={isSubmitting} type="submit">
                                        {isSubmitting ? 'Guardando...' : 'Finalizar'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
