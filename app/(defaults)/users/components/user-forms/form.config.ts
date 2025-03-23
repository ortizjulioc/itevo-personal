import * as Yup from 'yup';

export interface UserFormValues {
    name: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

const usernameRegex = /^(?!.*[_.]{2})[a-zA-Z0-9._]{3,16}(?<![_.])$/;

export const createValidationSchema = Yup.object().shape({
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

export const updateValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    lastName: Yup.string().required('El apellido es obligatorio'),
    phone: Yup.string(),
    username: Yup.string()
        .matches(usernameRegex, 'El nombre de usuario no es válido')
        .required('El nombre de usuario es obligatorio'),
    email: Yup.string().email('Formato de email incorrecto').required('El email es obligatorio'),
    password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
});

export const initialValues = {
    name: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
};

