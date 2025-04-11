
import * as Yup from 'yup';


export const createValidationSchema = Yup.object().shape({
    code: Yup.string().required('El código es requerido'),
    name: Yup.string().required('El nombre es requerido'),
    description: Yup.string(),
    cost : Yup.number().required('El costo es requerido').positive('El costo debe ser un número positivo'),
    price: Yup.number().required('El precio es requerido').positive('El precio debe ser un número positivo'),
    stock: Yup.number().required('El stock es requerido').integer('El stock debe ser un número entero'),
    isTaxIncluded: Yup.boolean(),
});

export const updateValidationSchema = Yup.object().shape({
    code: Yup.string().required('El código es requerido'),
    name: Yup.string().required('El nombre es requerido'),
    description: Yup.string(),
    cost : Yup.number().required('El costo es requerido').positive('El costo debe ser un número positivo'),
    price: Yup.number().required('El precio es requerido').positive('El precio debe ser un número positivo'),
    stock: Yup.number().required('El stock es requerido').integer('El stock debe ser un número entero'),
    isTaxIncluded: Yup.boolean(),
});

export const initialValues = {
    code: '',
    name: '',
    description: '',
    cost: 0,
    price: 0,
    stock: 0,
    isTaxIncluded: false,
};
