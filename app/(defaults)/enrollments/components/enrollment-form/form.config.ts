import { ENROLLMENT_STATUS } from '@/constants/enrollment.status.constant';
import * as Yup from 'yup';


export const createValidationSchema = Yup.object().shape({
    studentId : Yup.string().required('El estudiante es obligatorio'),
    courseBranchId: Yup.string().required('El curso es obligatorio'),
    enrollmentDate: Yup.string().required('La fecha de inscripción es obligatoria'),
    status: Yup.string().required('El estado es obligatorio'),


});

export const updateValidationSchema = Yup.object().shape({
   studentId : Yup.string().required('El estudiante es obligatorio'),
    courseBranchId: Yup.string().required('El curso es obligatorio'),
    enrollmentDate: Yup.string().required('La fecha de inscripción es obligatoria'),
    status: Yup.string().required('El estado es obligatorio'),
});

export const initialValues = {
    studentId: '',
    courseBranchId: '',
    enrollmentDate: undefined,
    status: ENROLLMENT_STATUS.WAITING,
};
