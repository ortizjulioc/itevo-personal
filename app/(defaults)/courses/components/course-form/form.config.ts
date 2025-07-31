import * as Yup from 'yup';

export const createValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string(),
    duration: Yup.number().min(1, 'El curso debe tener al menos una sesión').required('La cantidad de sesiones es obligatoria'),
    requiresGraduation: Yup.boolean().required('Este campo es obligatorio'),
});

export const updateValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string(),
    duration: Yup.number().min(1, 'El curso debe tener al menos una sesión').required('La cantidad de sesiones es obligatoria'),
    requiresGraduation: Yup.boolean().required('Este campo es obligatorio'),
});

export const initialValues = {
    name: '',
    description: '',
    duration: '',
    requiresGraduation: false,
};
