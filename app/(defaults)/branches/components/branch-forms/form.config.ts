
import * as Yup from 'yup';


export const createValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    address: Yup.string().required('La direccion es obligatoria'),
    phone: Yup.string(),
   
});

export const updateValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    address: Yup.string().required('La direccion es obligatoria'),
    phone: Yup.string(),
});

export const initialValues = {
    name: '',
    address: '',
    phone: '',
};
