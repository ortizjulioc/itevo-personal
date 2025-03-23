import * as Yup from 'yup';

export const createValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    date : Yup.string().required('La fecha es obligatoria'),
    isRecurring: Yup.boolean(),
});

export const updateValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    date : Yup.string().required('La fecha es obligatoria'),
    isRecurring: Yup.boolean(),
});

export const initialValues = {
    name: '',
    date: undefined,
    isRecurring: false,
};
