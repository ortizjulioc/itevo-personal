import * as Yup from 'yup';

export const createValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string(),
    type: Yup.string().required('El tipo es obligatorio'), // e.g., 'percentage', 'fixed_amount'
    value: Yup.number().required('El valor es obligatorio').min(0, 'El valor debe ser positivo'),
    isActive: Yup.boolean(),
});

export const updateValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string(),
    type: Yup.string().required('El tipo es obligatorio'),
    value: Yup.number().required('El valor es obligatorio').min(0, 'El valor debe ser positivo'),
    isActive: Yup.boolean(),
});

export const initialValues = {
    name: '',
    description: '',
    type: '',
    value: 0,
    isActive: true,
};
