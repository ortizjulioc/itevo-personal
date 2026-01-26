import * as Yup from 'yup';

export const createValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string(),
    type: Yup.string().required('El tipo es obligatorio'), // e.g., 'percentage', 'fixed_amount'
    value: Yup.number().required('El valor es obligatorio').oneOf([50, 100], 'El valor debe ser 50 o 100'),
    isActive: Yup.boolean(),
});

export const updateValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string(),
    type: Yup.string().required('El tipo es obligatorio'),
    value: Yup.number().required('El valor es obligatorio').oneOf([50, 100], 'El valor debe ser 50 o 100'),
    isActive: Yup.boolean(),
});

export const initialValues = {
    name: '',
    description: '',
    type: 'percentage',
    value: 50,
    isActive: true,
};
