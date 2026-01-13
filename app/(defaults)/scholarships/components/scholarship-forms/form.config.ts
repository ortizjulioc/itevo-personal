
import * as Yup from 'yup';


export const createValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    percentage: Yup.number().min(0, 'Debe ser mayor o igual a 0').max(100, 'Debe ser menor o igual a 100').required('El porcentaje es obligatorio'),
    description: Yup.string().optional(),
});

export const updateValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    percentage: Yup.number().min(0, 'Debe ser mayor o igual a 0').max(100, 'Debe ser menor o igual a 100').required('El porcentaje es obligatorio'),
    description: Yup.string().optional(),
});

export const initialValues = {
    name: '',
    description: '',
    percentage: 0,
};
