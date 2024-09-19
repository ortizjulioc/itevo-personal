'use client';
import { FormatPatterInput } from "@/components/common";
import { Button, FormItem, Input } from "@/components/ui";
import { Field, Form, Formik } from 'formik';
import { useRouter } from "next/navigation";

import * as Yup from 'yup';
import { createUser } from "../lib/user";
import { openNotification } from "@/utils";

const usernameRegex = /^(?!.*[_.]{2})[a-zA-Z0-9._]{3,16}(?<![_.])$/;
const userSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    lastName: Yup.string().required('El apellido es obligatorio'),
    phone: Yup.string(),
    username: Yup.string()
        .matches(usernameRegex, 'El nombre de usuario no es válido')
        .required('El nombre de usuario es obligatorio'),
    email: Yup.string().email('Formato de email incorrecto').required('El email es obligatorio'),
    password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
        .required('Debes confirmar la contraseña'),
});

const initialValues = {
    name: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
};

export default function CreateUserForm() {
    const route = useRouter();
    const handleSubmit = async (values: any) => {
        const data = values;
        delete data.confirmPassword;

        const resp = await createUser(data);
        console.log(resp);

        if (resp.success) {
            openNotification('success', 'Usuario creado correctamente');
            route.push('/users');
        } else {
            alert(resp.message);
        }
    }
    return (
        <div className='panel'>
            <h5 className="font-semibold text-lg dark:text-white-light mb-4">Formulario de usuarios</h5>
            <Formik
                initialValues={initialValues}
                validationSchema={userSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, errors, touched }) => (
                    <Form className='form'>
                        <FormItem
                            name="name"
                            label="Nombre"
                            invalid={Boolean(errors.name && touched.name)}
                            errorMessage={errors.name}
                        >
                            <Field
                                type="text"
                                name="name"
                                component={Input}
                                placeholder="Escribe tu nombre"
                            />
                        </FormItem>

                        <FormItem
                            name="lastName"
                            label="Apellido"
                            invalid={Boolean(errors.lastName && touched.lastName)}
                            errorMessage={errors.lastName}
                        >
                            <Field
                                type="text"
                                name="lastName"
                                component={Input}
                                placeholder="Escribe tu apellido"
                            />
                        </FormItem>

                        <FormItem
                            name="username"
                            label="Nombre de usuario"
                            invalid={Boolean(errors.username && touched.username)}
                            errorMessage={errors.username}
                        >
                            <Field
                                type="text"
                                name="username"
                                component={Input}
                                placeholder="Escribe tu nombre de usuario"
                            />
                        </FormItem>

                        <FormItem
                            name="email"
                            label="Correo electrónico"
                            invalid={Boolean(errors.email && touched.email)}
                            errorMessage={errors.email}
                        >
                            <Field
                                type="email"
                                name="email"
                                component={Input}
                                placeholder="Escribe tu correo electrónico"
                            />
                        </FormItem>

                        <FormItem
                            extra={<span className="text-sm text-gray-500">(Opcional)</span>}
                            name="phone"
                            label="Teléfono"
                            invalid={Boolean(errors.phone && touched.phone)}
                            errorMessage={errors.phone}
                        >
                            <Field name="phone">
                                {({ form }: any) => (
                                    <FormatPatterInput
                                        format="(###) ###-####"
                                        placeholder="(___) ___-____"
                                        className="form-input"
                                        value={values.phone}
                                        onValueChange={(value : any) => {
                                            form.setFieldValue('phone', value.value);
                                        }}
                                    />
                                )}
                            </Field>
                        </FormItem>

                        <FormItem
                            name="password"
                            label="Contraseña"
                            invalid={Boolean(errors.password && touched.password)}
                            errorMessage={errors.password}
                        >
                            <Field
                                type="password"
                                name="password"
                                component={Input}
                                placeholder="••••••••"
                            />
                        </FormItem>

                        <FormItem
                            name="confirmPassword"
                            label="Confirmar contraseña"
                            invalid={Boolean(errors.confirmPassword && touched.confirmPassword)}
                            errorMessage={errors.confirmPassword}
                        >
                            <Field
                                type="password"
                                name="confirmPassword"
                                component={Input}
                                placeholder="••••••••"
                            />
                        </FormItem>

                        <div className="flex justify-end gap-2 mt-6">
                            <Button key={1} type="button" color="danger" onClick={() => route.back()}>Cancelar</Button>
                            <Button key={2} type="submit">Guardar</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
