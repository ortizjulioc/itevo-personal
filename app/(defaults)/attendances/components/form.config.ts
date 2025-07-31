import * as Yup from 'yup';

export const createValidationSchema = Yup.object().shape({
    courseBranchId: Yup.string().required('La oferta academica es obligatoria'),
    studentId: Yup.string().required('el estudiante es obligatorio'),
    status: Yup.string().required('El estado es obligatorio'),
});

export const initialValues = {
    courseBranchId: '',
    studentId: '',
    status: '',
    date:new Date()
};
