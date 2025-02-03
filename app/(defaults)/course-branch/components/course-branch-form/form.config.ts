import * as Yup from 'yup';

export const createValidationSchema = Yup.object().shape({
    promotionId: Yup.string().required('La promoción es obligatoria'),
    branchId: Yup.string().required('La sucursal es obligatoria'),
    teacherId: Yup.string().required('El profesor es obligatorio'),
    courseId: Yup.string().required('El curso es obligatorio'),
    modality: Yup.string().required('La modalidad es obligatoria'),
    startDate: Yup.date().required('La fecha de inicio es obligatoria'),
    endDate: Yup.date().required('La fecha de fin es obligatoria'),
    commissionRate: Yup.number().required('La comisión es obligatoria'),
    capacity: Yup.number().required('La capacidad es obligatoria'),

    
});

export const updateValidationSchema = Yup.object().shape({
    promotionId: Yup.string().required('La promoción es obligatoria'),
    branchId: Yup.string().required('La sucursal es obligatoria'),
    teacherId: Yup.string().required('El profesor es obligatorio'),
    courseId: Yup.string().required('El curso es obligatorio'),
    modality: Yup.string().required('La modalidad es obligatoria'),
    startDate: Yup.date().required('La fecha de inicio es obligatoria'),
    endDate: Yup.date().required('La fecha de fin es obligatoria'),
    commissionRate: Yup.number().required('La comisión es obligatoria'),
    capacity: Yup.number().required('La capacidad es obligatoria'),
});

export const initialValues = {
    promotionId: '',
    branchId: '',
    teacherId: '',
    courseId: '',
    modality: '',
    startDate: '',
    endDate: '',
    commissionRate: 0,
    capacity: 0,
};
