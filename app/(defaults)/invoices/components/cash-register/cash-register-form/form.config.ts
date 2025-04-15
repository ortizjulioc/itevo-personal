
import * as Yup from 'yup';


export const createValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    initialBalance: Yup.number().required('El saldo inicial es requerido').positive('El saldo inicial debe ser un número positivo'),
});


export const initialValues = {
    name: '',
    initialBalance  : 0,

};
