import * as Yup from 'yup';

export const createValidationSchema = Yup.object().shape({
    code: Yup.string().required('El código es obligatorio'),
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string(),
    duration: Yup.number(),
    requiresGraduation: Yup.boolean().required('Este campo es obligatorio'),
});

export const updateValidationSchema = Yup.object().shape({
    code: Yup.string().required('El código es obligatorio'),
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string(),
    duration: Yup.number(),
    requiresGraduation: Yup.boolean().required('Este campo es obligatorio'),
});

export const initialValues = {
    code: '',
    name: '',
    description: '',
    duration: '',
    requiresGraduation: false,
};
