
import * as Yup from 'yup';


export const createValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    initialBalance: Yup.number(),
});


export const initialValues = {
    name: '',
    initialBalance  : 0,

};
