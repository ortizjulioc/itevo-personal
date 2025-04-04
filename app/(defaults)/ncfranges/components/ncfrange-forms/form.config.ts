
import { NCF_TYPES } from '@/constants/ncfType.constant';

import * as Yup from 'yup';

const VALID_NCF_TYPE_CODES = Object.values(NCF_TYPES).map(type => type.code);

export const createValidationSchema = Yup.object().shape({
    prefix: Yup.string().required('El prefijo es requerido'),
    type: Yup.string() .oneOf(VALID_NCF_TYPE_CODES, 'El tipo seleccionado no es válido')
    .required('El tipo es requerido'),
    startSequence: Yup.number().required('La secuencia inicial es requerida').integer('La secuencia inicial debe ser un número entero').positive('La secuencia inicial debe ser un número positivo'),
    endSequence: Yup.number().required('La secuencia final es requerida').integer('La secuencia final debe ser un número entero').positive('La secuencia final debe ser un número positivo'),
    currentSequence: Yup.number().required('La secuencia actual es requerida').integer('La secuencia actual debe ser un número entero').positive('La secuencia actual debe ser un número positivo'),
    dueDate: Yup.date().required('La fecha de vencimiento es requerida').nullable(),
    authorizationNumber: Yup.string().required('El número de autorización es requerido'),
    isActive: Yup.boolean(),

});

export const updateValidationSchema = Yup.object().shape({
    prefix: Yup.string().required('El prefijo es requerido'),
    type: Yup.string() .oneOf(VALID_NCF_TYPE_CODES, 'El tipo seleccionado no es válido')
    .required('El tipo es requerido'),
    startSequence: Yup.number().required('La secuencia inicial es requerida').integer('La secuencia inicial debe ser un número entero').positive('La secuencia inicial debe ser un número positivo'),
    endSequence: Yup.number().required('La secuencia final es requerida').integer('La secuencia final debe ser un número entero').positive('La secuencia final debe ser un número positivo'),
    currentSequence: Yup.number().required('La secuencia actual es requerida').integer('La secuencia actual debe ser un número entero').positive('La secuencia actual debe ser un número positivo'),
    dueDate: Yup.date().required('La fecha de vencimiento es requerida').nullable(),
    authorizationNumber: Yup.string().required('El número de autorización es requerido'),
    isActive: Yup.boolean(),
});

export const initialValues = {
    prefix: '',
    type: null,
    startSequence: 0,
    endSequence: 0,
    currentSequence: 0,
    dueDate: null,
    isActive: true,
    authorizationNumber: '',
};
