

import * as Yup from 'yup';


export const createValidationSchema = Yup.object().shape({
    firstName: Yup.string().required('El nombre es obligatorio'),
    lastName: Yup.string().required('El apellido es obligatorio'),
    identification: Yup.string().required('La identificación es obligatoria'),
    address: Yup.string(),
    phone: Yup.string(),
    email: Yup.string().email('El correo electrónico no es válido'),

});

export const updateValidationSchema = Yup.object().shape({
    firstName: Yup.string().required('El nombre es obligatorio'),
    lastName: Yup.string().required('El apellido es obligatorio'),
    identification: Yup.string().required('La identificación es obligatoria'),
    address: Yup.string(),
    phone: Yup.string(),
    email: Yup.string().email('El correo electrónico no es válido'),
});

export const initialValues = {
    firstName: '',
    lastName: '',
    identification: '',
    address: '',
    phone: '',
    email: '',
};
