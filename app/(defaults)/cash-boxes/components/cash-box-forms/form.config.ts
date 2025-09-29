import * as Yup from 'yup';

export const createValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    location: Yup.string(),
});

export const updateValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    location: Yup.string(),
});

export const initialValues = {
    name: '',
    location: '',
};
