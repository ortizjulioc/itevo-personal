import * as Yup from 'yup';

export const createValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    address: Yup.string().required('La direccion es obligatoria'),
    phone: Yup.string().optional(),
    email: Yup.string().email('Correo electrónico inválido').optional(),
});

export const updateValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    address: Yup.string().required('La direccion es obligatoria'),
    phone: Yup.string().optional(),
    email: Yup.string().email('Correo electrónico inválido').optional(),
});

export const initialValues = {
    name: '',
    address: '',
    phone: '',
    email: '',
};
