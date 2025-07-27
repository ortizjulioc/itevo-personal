
import * as Yup from 'yup';


export const createValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    description: Yup.string(),
    cost : Yup.number().required('El costo es requerido').positive('El costo debe ser un número positivo'),
    price: Yup.number().required('El precio es requerido').positive('El precio debe ser un número positivo'),
    stock: Yup.number().required('El stock es requerido').integer('El stock debe ser un número entero'),
    taxRate: Yup.number().required('La tasa de impuestos es requerida'),
    isTaxIncluded: Yup.boolean(),
    billingWithoutStock: Yup.boolean(),
});

export const updateValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    description: Yup.string(),
    cost : Yup.number().required('El costo es requerido').positive('El costo debe ser un número positivo'),
    price: Yup.number().required('El precio es requerido').positive('El precio debe ser un número positivo'),
    stock: Yup.number().required('El stock es requerido').integer('El stock debe ser un número entero'),
    taxRate: Yup.number().required('La tasa de impuestos es requerida'),
    isTaxIncluded: Yup.boolean(),
    billingWithoutStock: Yup.boolean(),
});

export const initialValues = {
    name: '',
    description: '',
    cost: 0,
    price: 0,
    stock: 0,
    taxRate: 0.18,
    isTaxIncluded: true,
    billingWithoutStock: true,
};
