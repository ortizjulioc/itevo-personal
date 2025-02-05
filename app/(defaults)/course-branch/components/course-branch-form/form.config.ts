import { MODALITIES } from '@/constants/modality.constant';
import * as Yup from 'yup';

export const createValidationSchema = Yup.object().shape({
    promotionId: Yup.string().required('La promoción es obligatoria'),
    branchId: Yup.string().required('La sucursal es obligatoria'),
    teacherId: Yup.string().required('El profesor es obligatorio'),
    courseId: Yup.string().required('El curso es obligatorio'),
    amount: Yup.number().required('El monto es obligatorio'),
    modality: Yup.string().required('La modalidad es obligatoria'),
    startDate: Yup.string().required('La fecha de inicio es obligatoria'),
    endDate: Yup.string().required('La fecha de fin es obligatoria'),
    commissionRate: Yup.number().required('La comisión es obligatoria'),
    capacity: Yup.number().required('La capacidad es obligatoria'),

    
});

export const updateValidationSchema = Yup.object().shape({
    promotionId: Yup.string().required('La promoción es obligatoria'),
    branchId: Yup.string().required('La sucursal es obligatoria'),
    teacherId: Yup.string().required('El profesor es obligatorio'),
    courseId: Yup.string().required('El curso es obligatorio'),
    amount: Yup.number().required('El monto es obligatorio'),
    modality: Yup.string().required('La modalidad es obligatoria'),
    startDate: Yup.string().required('La fecha de inicio es obligatoria'), // Cambiado a Yup.date()
    endDate: Yup.string().required('La fecha de fin es obligatoria'), // Cambiado a Yup.date()
    commissionRate: Yup.number().required('La comisión es obligatoria'),
    capacity: Yup.number().required('La capacidad es obligatoria'),
});


export const initialValues = {
    promotionId: '',
    branchId: '',
    teacherId: '',
    courseId: '',
    amount: null,
    modality: MODALITIES.PRESENTIAL,
    startDate: '',
    endDate: '',
    commissionRate: null,
    capacity: null,
};
