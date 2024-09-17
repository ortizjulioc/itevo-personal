'use client';
import React from 'react';
import { Formik, Form, Field } from 'formik';
import UserFormConfig from '@/config/form.config/users.config';
const { defaultValues, validationSchema } = UserFormConfig;
import FormItem from '@/components/custom/FormItem';

const UserForm: React.FC = () => {
    return (
        <div className="flex items-center justify-center ">
            <div className="w-full max-w-lg p-6 rounded-lg border border-white-light bg-white shadow-lg dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                <Formik
                    initialValues={defaultValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        console.log(values);
                       
                    }}
                >
                    {({ touched, errors, isSubmitting }) => (
                        <Form>
                            <FormItem
                                label="Nombre"
                                invalid={Boolean(errors.nombres && touched.nombres)} // Convertir a booleano
                                errorMessage={errors.nombres}
                            >
                                <Field name="nombres">
                                    {({ field }: any) => <input {...field} type="text" className="form-input"   />}
                                </Field>
                            </FormItem>

                            <FormItem
                                label="Apellido"
                                invalid={Boolean(errors.apellidos && touched.apellidos)} // Convertir a booleano
                                errorMessage={errors.apellidos}
                            >
                                <Field name="apellidos">
                                    {({ field }: any) => <input {...field} type="text" className="form-input"  />}
                                </Field>
                            </FormItem>

                            <FormItem
                                label="Correo"
                                invalid={Boolean(errors.correo && touched.correo)} // Convertir a booleano
                                errorMessage={errors.correo}
                            >
                                <Field name="correo">
                                    {({ field }: any) => <input {...field} type="email" className="form-input" />}
                                </Field>
                            </FormItem>

                            <FormItem
                                label="Username"
                                invalid={Boolean(errors.username && touched.username)} // Convertir a booleano
                                errorMessage={errors.username}
                            >
                                <Field name="username">
                                    {({ field }: any) => <input {...field} type="text" className="form-input" />}
                                </Field>
                            </FormItem>

                            <FormItem
                                label="Password"
                                invalid={Boolean(errors.password && touched.password)} // Convertir a booleano
                                errorMessage={errors.password}
                            >
                                <Field name="password">
                                    {({ field }: any) => <input {...field} type="password" className="form-input" />}
                                </Field>
                            </FormItem>

                            <div className="mt-6">
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    Guardar
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default UserForm;
