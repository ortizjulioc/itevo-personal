'use client';
import { Button } from "@/components/ui";
import { Form, Formik } from 'formik';
import { useRouter } from "next/navigation";
import { Fragment, useState } from 'react';
import { openNotification } from "@/utils";
import { Tab } from '@headlessui/react'
import { createValidationSchema, initialValues } from "../form.config";
import GeneralInfoFields from "./general-info-fields";
import PasswordFields from "./password-fields";
import { createUser } from "../../../lib/request";

export default function CreateUserForm() {
    const route = useRouter();
    const [tabIndex, setTabIndex] = useState(0);
    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        if (tabIndex === 0) {
            setTabIndex(1); // Si está en el primer tab, pasa al siguiente
            return;
        }
        setSubmitting(true);
        const data = { ...values };
        delete data.confirmPassword;

        const resp = await createUser(data);

        if (resp.success) {
            openNotification('success', 'Usuario creado correctamente');
            route.push('/users');
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    }
    return (
        <div className='panel'>
            <h4 className="font-semibold text-xl dark:text-white-light mb-4">Formulario de usuarios</h4>
            <Formik
                initialValues={initialValues}
                validationSchema={createValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, errors, touched }) => (
                    <Form className='form'>
                        <Tab.Group selectedIndex={tabIndex} onChange={setTabIndex}>
                            <Tab.List className="mt-3 flex flex-wrap">
                                <Tab as="button" className={({ selected }) =>
                                    `${selected ? 'text-secondary !outline-none before:!w-full' : ''} relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`
                                }>
                                    Información general
                                </Tab>
                                <Tab as="button" className={({ selected }) =>
                                    `${selected ? 'text-secondary !outline-none before:!w-full' : ''} relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`
                                }>
                                    Contraseña
                                </Tab>
                            </Tab.List>
                            <Tab.Panels>
                                <Tab.Panel className='p-5'>
                                    <div className="mb-4">
                                        <h5 className="font-semibold text-lg dark:text-white-light">Información general</h5>
                                        <p className="text-pretty">
                                            Sesión para configurar la información general del usuario. 
                                            Por defecto, el usuario no tiene un rol asignado. Para asignar un rol, 
                                            diríjase a la sección de edición de usuario después de crearlo.
                                        </p>
                                    </div>
                                    <GeneralInfoFields values={values} errors={errors} touched={touched} />
                                </Tab.Panel>
                                <Tab.Panel className='p-5'>
                                    <PasswordFields values={values} errors={errors} touched={touched} />
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>



                        <div className="flex justify-end gap-2 mt-6">
                            <Button type="button" color="danger" onClick={() => route.back()}>
                                Cancelar
                            </Button>
                            <Button
                                type={tabIndex === 1 ? "submit" : "button"}
                                onClick={() => tabIndex === 0 && setTabIndex(1) }
                                loading={isSubmitting}
                            >
                                {tabIndex === 0 ? "Siguiente" : isSubmitting ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
