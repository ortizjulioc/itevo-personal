
import * as Yup from 'yup';


export const createValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    normalizedName: Yup.string().required('El nombre normalizado es obligatorio'),
   
});

export const updateValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    normalizedName: Yup.string().required('El nombre normalizado es obligatorio'),
});

export const initialValues = {
    name: '',
    normalizedName: '',
};
