
import * as Yup from 'yup';


export const createValidationSchema = Yup.object().shape({
    cashBoxId: Yup.string().required('El nombre es requerido'),
    initialBalance: Yup.number(),
});


export const initialValues = {
    cashBoxId: '',
    initialBalance  : 0,

};
