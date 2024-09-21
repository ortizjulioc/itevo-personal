'use client';
import { Button } from "@/components/ui";
import { Form, Formik } from 'formik';
import { useRouter } from "next/navigation";
import { Fragment } from 'react';
import { openNotification } from "@/utils";
import { Tab } from '@headlessui/react'
import { createUser } from "../../lib/user";
import { createValidationSchema, initialValues } from "../config";
import GeneralInfoFields from "./general-info-fields";
import PasswordFields from "./password-fields";

export default function CreateUserForm() {
    const route = useRouter();
    const handleSubmit = async (values: any, { setSubmitting }: any) => {
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
                        <Tab.Group>
                            <Tab.List className="mt-3 flex flex-wrap">
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
                                            Contraseña
                                        </button>
                                    )}
                                </Tab>
                            </Tab.List>
                            <Tab.Panels>
                                <Tab.Panel className='p-5'>
                                    <div className="mb-4">
                                        <h5 className="font-semibold text-lg dark:text-white-light">Información general</h5>
                                        <p className="text-pretty">Sesión para configurar la información general del usuario. Por defecto, el usuario no tiene un rol asignado.
                                            Para asignar un rol, diríjase a la sección de edición de usuario después de crearlo.
                                        </p>
                                    </div>
                                    <GeneralInfoFields values={values} errors={errors} touched={touched} />
                                </Tab.Panel>
                                <Tab.Panel className='p-5'>
                                    <div className="mb-4">
                                        <h5 className="font-semibold text-lg dark:text-white-light">Contraseña</h5>
                                        <p className='text-pretty'>
                                            Dejar en blanco si desea asignar la contraseña por defecto. La contraseña puede ser cambiada por el usuario en cualquier momento.
                                        </p>
                                    </div>
                                    <PasswordFields values={values} errors={errors} touched={touched} />
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>



                        <div className="flex justify-end gap-2 mt-6">
                            <Button type="button" color="danger" onClick={() => route.back()}>Cancelar</Button>
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
