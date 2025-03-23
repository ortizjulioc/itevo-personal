import * as Yup from 'yup';

export const createValidationSchema = Yup.object().shape({
    code: Yup.string().required('El código es obligatorio'),
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
    duration: Yup.number().required('La duración es obligatoria'),
    requiresGraduation: Yup.boolean().required('Este campo es obligatorio'),
});

export const updateValidationSchema = Yup.object().shape({
    code: Yup.string().required('El código es obligatorio'),
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
    duration: Yup.number().required('La duración es obligatoria'),
    requiresGraduation: Yup.boolean().required('Este campo es obligatorio'),
});

export const initialValues = {
    code: '',
    name: '',
    description: '',
    duration: '',
    requiresGraduation: false,
};
