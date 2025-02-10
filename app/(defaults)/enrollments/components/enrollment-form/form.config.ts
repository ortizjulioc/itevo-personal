import * as Yup from 'yup';
import Enrollment from '../../page';

export const createValidationSchema = Yup.object().shape({
    studentId : Yup.string().required('El estudiante es obligatorio'),
    courseBranchId: Yup.string().required('El curso es obligatorio'),
    enrollmentDate: Yup.string().required('La fecha de inscripción es obligatoria'),


});

export const updateValidationSchema = Yup.object().shape({
   studentId : Yup.string().required('El estudiante es obligatorio'),
    courseBranchId: Yup.string().required('El curso es obligatorio'),
    enrollmentDate: Yup.string().required('La fecha de inscripción es obligatoria'),
});

export const initialValues = {
    studentId: '',
    courseBranchId: '',
    enrollmentDate: undefined,
};
