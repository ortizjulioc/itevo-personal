'use client';
import { Button } from '@/components/ui';
import { Form, Formik } from 'formik';
import { usePathname, useRouter } from 'next/navigation';
import { confirmDialog, openNotification } from '@/utils';
import { updateValidationSchema } from '../form.config';
import { CourseBranch } from '@prisma/client';
import { assignPrerequisiteToCourseBranch, unassignPrerequisiteToCourseBranch, updateCourseBranch } from '../../../lib/request';
import { Tab } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import GeneralInformationFields from './general-information-fields';
import FinancialConfigFields from './financial-config-fields';
import { TbArrowLeft, TbArrowRight } from 'react-icons/tb';
import ScheduleAssignmentFields from './schedule-assignment-fields';
import Swal from 'sweetalert2';
import ConfirmationFields from './confirmation-fields';
import StickyFooter from '@/components/common/sticky-footer';
import { useURLSearchParams } from '@/utils/hooks';
import PrerequisitesFields from './prerequisites-fields';
import { CourseBranchProvider } from './course-branch-provider';
import { useFetchPreRequisites } from '@/app/(defaults)/courses/lib/use-fetch-courses';

const COURSE_BRANCH_TABS = [
    'general-information',
    'schedule-assignment',
    'prerequisites',
    'financial-config',
    'confirmation',
];

const TABS_FIELDS = [
    ['promotionId', 'branchId', 'teacherId', 'courseId', 'capacity'],
    ['modality', 'startDate', 'endDate', 'schedules'],
    ['prerequisites'],
    ['amount', 'commissionRate'],
]


export default function UpdateCourseBranchForm({ initialValues }: { initialValues: CourseBranch }) {
    const route = useRouter();
    const pathname = usePathname();
    const params = useURLSearchParams();
    const isANewCourseBranch = params.get('new') === 'true';
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { preRequisites, fetchPreRequisites } = useFetchPreRequisites(initialValues.courseId);

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
        const resp = await updateCourseBranch(initialValues.id, values);

        if (resp.success) {
            openNotification('success', 'Oferta academica  creado correctamente');
            if (isANewCourseBranch) {
                await askForNewCourseBranch();
            } else {
                route.push('/course-branch');
            }
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };

    const handleErrors = (errors: any) => {
        const errorKeys = Object.keys(errors);
        console.log('errors', errors)
        if (errorKeys.length) {
            changeTab(TABS_FIELDS.findIndex((tabFields) => tabFields.some((field) => errorKeys.includes(field))));
            Swal.fire({
                title: 'Error',
                text: 'Por favor revisa los campos con errores',
                icon: 'error',
            });
        }
    }

    const askForNewCourseBranch = async () => {
        await confirmDialog({
            title: 'Crear nueva oferta académica',
            text: '¿Le gustaría crear una nueva oferta académica?',
            confirmButtonText: 'Sí, crear',
            cancelButtonText: 'Salir',
            icon: 'question',
        }, () => route.push('/course-branch/new'),
            () => route.push('/course-branch')
        );

    };

    const handleAddPrerequisite = async (course: any) => {
        //console.log(`Agregar prerrequisito: ${course.id}`);
        const response = await assignPrerequisiteToCourseBranch(initialValues.courseId, course.id);

        if (response.success) {
            openNotification('success', 'Prerrequisito agregado correctamente');
            //console.log('el curso en cuestion', course);

            fetchPreRequisites(initialValues.courseId);
        } else {
            openNotification('error', response.message);
        }
    };

    // Función para eliminar un prerrequisito
    const handleRemovePrerequisite = async (courseId: string) => {
        const response = await unassignPrerequisiteToCourseBranch(initialValues.courseId, courseId);
        if (response.success) {
            openNotification('success', 'Prerrequisito eliminado correctamente');
            fetchPreRequisites(initialValues.courseId);
        }
        else {
            openNotification('error', response.message);
        }
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
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de oferta academica</h4>

            <Formik initialValues={initialValues} validationSchema={updateValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched,setFieldValue }) => (
                    <CourseBranchProvider value={{
                        selectedIndex,
                        changeTab,
                        handleSubmit,
                        handleErrors,
                        handleAddPrerequisite,
                        handleRemovePrerequisite,
                        setFieldValue,
                        preRequisites
                    }}>
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
                                                Prerrequisitos
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
                                    <Tab as={Fragment}>
                                        {({ selected }) => (
                                            <button
                                                className={`${selected ? 'text-secondary !outline-none before:!w-full' : ''} relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                                            >
                                                Confirmación
                                            </button>
                                        )}
                                    </Tab>
                                </Tab.List>
                                <Tab.Panels>
                                    <Tab.Panel>
                                        <GeneralInformationFields className='p-4' values={values} errors={errors} touched={touched} />
                                    </Tab.Panel>

                                    <Tab.Panel>
                                        <ScheduleAssignmentFields className='p-4' values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} />
                                    </Tab.Panel>

                                    <Tab.Panel>
                                        <PrerequisitesFields className='p-4' values={values} errors={errors} touched={touched} />
                                    </Tab.Panel>

                                    <Tab.Panel>
                                        <FinancialConfigFields className='p-4' values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} />
                                    </Tab.Panel>

                                    <Tab.Panel>
                                        <ConfirmationFields className='p-4' values={values} errors={errors} touched={touched} onChangeTab={changeTab} />
                                    </Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>


                            <StickyFooter className='-mx-11 px-8 py-4' stickyClass='border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'>
                                <div className="flex justify-between gap-2 px-3">
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
                                            <Button onClick={() => handleErrors(errors)} loading={isSubmitting} type="submit">
                                                {isSubmitting ? 'Guardando...' : 'Finalizar'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </StickyFooter>
                        </Form>
                    </CourseBranchProvider>
                )}
            </Formik>

        </div>
    );
}
