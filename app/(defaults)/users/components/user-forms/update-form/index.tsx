'use client';
import { Button } from "@/components/ui";
import { Form, Formik } from 'formik';
import { useRouter } from "next/navigation";
import { openNotification } from "@/utils";
import { User } from "@prisma/client";
import { updateUser } from "../../../lib/request";
import { updateValidationSchema } from "../form.config";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import GeneralInfoFields from "./general-info-fields";
import PasswordFields from "./password-fields";
import AuthorizationFields from "./authorization-fields";

export default function UpdateUserForm({ initialValues }: { initialValues: User }) {
    const route = useRouter();
    const handleSubmit = async (values: any) => {
        const data = { ...values };
        delete data.confirmPassword;

        const resp = await updateUser(initialValues.id, data);
        console.log(resp);

        if (resp.success) {
            openNotification('success', 'Usuario editado correctamente');
            route.push('/users');
        } else {
            alert(resp.message);
        }
    }
    return (
        <div className='panel'>
            <h5 className="font-semibold text-lg dark:text-white-light mb-4">Formulario de usuarios</h5>
            <Formik
                initialValues={{...initialValues, password: '', confirmPassword: ''}}
                validationSchema={updateValidationSchema}
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
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${selected ? 'text-secondary !outline-none before:!w-full' : ''} relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                                        >
                                            Permisos
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
                                <Tab.Panel className='p-5'>
                                    <div className="mb-4">
                                        <h5 className="font-semibold text-lg dark:text-white-light">Permisos</h5>
                                        <p className='text-pretty'>
                                        Asigna los permisos necesarios para determinar las sucursales a las que el usuario tiene acceso.
                                        </p>
                                    </div>
                                    <AuthorizationFields values={values} errors={errors} touched={touched} />
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
