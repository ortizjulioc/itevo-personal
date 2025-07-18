'use client';
import { Button } from '@/components/ui';
import { Form, Formik } from 'formik';
import { usePathname, useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, createInitialValues as initialValues } from '../form.config';
import { Tab } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import GeneralInformationFields from './general-information-fields';
import { createCourseBranch, loadDefaultPromotion } from '../../../lib/request';
import { TbArrowLeft, TbArrowRight } from 'react-icons/tb';
import { useSession } from 'next-auth/react';
import { Branch } from '@prisma/client';

const COURSE_BRANCH_TABS = [
    'general-information',
    // 'financial-config',
    // 'schedule-assignment',
    // 'confirmation',
];

export default function CreateCourseBranchForm() {
    const route = useRouter();
    const pathname = usePathname();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [defaultPromotion, setDefaultPromotion] = useState<string | null>(null);
    const { data: session, status } = useSession();
    const user = session?.user as {
        id: string;
        name?: string | null;
        email?: string | null;
        username?: string;
        phone?: string;
        lastName?: string;
        roles?: any[];
        mainBranch: Branch;
        branches?: any[];
    };


    useEffect(() => {
        const fetchDefaultPromotion = async () => {
            try {
                const { data } = await loadDefaultPromotion();
                if (data?.id) {
                    setDefaultPromotion(data.id); // o data.value según la estructura
                }
            } catch (error) {
                console.error('Error cargando la promoción por defecto', error);
            }
        };
        fetchDefaultPromotion();
    }, []);

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

        const resp = await createCourseBranch(values);

        if (resp.success) {
            openNotification('success', 'Curso creado correctamente');
            route.push(`/course-branch/${resp.data?.id}?new=true#schedule-assignment`);
        } else {
            openNotification('error', resp.message);
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        const tabIndex = COURSE_BRANCH_TABS.indexOf(hash);
        if (tabIndex !== -1) {
            setSelectedIndex(tabIndex);
        }
    }, []);

    if (!defaultPromotion) return null;
    if (!user) return null;

    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de oferta  academica</h4>
            <Formik
                enableReinitialize
                initialValues={{ 
                    ...initialValues, 
                    promotionId: defaultPromotion,
                    branchId: user.mainBranch.id
                 }}
                validationSchema={createValidationSchema}
                onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched,setFieldValue }) => (
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
                                <Tab className="pointer-events-none -mb-[1px] block rounded p-3.5 py-2 text-white-light dark:text-dark">
                                    Modalidad y horarios
                                </Tab>
                                <Tab className="pointer-events-none -mb-[1px] block rounded p-3.5 py-2 text-white-light dark:text-dark">
                                    Prerrequisitos
                                </Tab>
                                <Tab className="pointer-events-none -mb-[1px] block rounded p-3.5 py-2 text-white-light dark:text-dark">
                                    Configuración financiera
                                </Tab>
                                <Tab className="pointer-events-none -mb-[1px] block rounded p-3.5 py-2 text-white-light dark:text-dark">
                                    Confirmación
                                </Tab>
                            </Tab.List>
                            <Tab.Panels>
                                <Tab.Panel>
                                    <GeneralInformationFields 
                                        values={values} 
                                        errors={errors} 
                                        touched={touched}
                                        setFieldValue={setFieldValue}
                                         />
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>

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
                                        {isSubmitting ? 'Guardando...' : 'Continuar'}
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
