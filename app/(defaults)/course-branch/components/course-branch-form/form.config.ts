import { MODALITIES } from '@/constants/modality.constant';
import * as Yup from 'yup';

export const createValidationSchema = Yup.object().shape({
    promotionId: Yup.string().required('La promoción es obligatoria'),
    branchId: Yup.string().required('La sucursal es obligatoria'),
    teacherId: Yup.string().required('El profesor es obligatorio'),
    courseId: Yup.string().required('El curso es obligatorio'),
    capacity: Yup.number().required('La capacidad es obligatoria').nullable(),
});

export const updateValidationSchema = Yup.object().shape({
    promotionId: Yup.string().required('La promoción es obligatoria'),
    branchId: Yup.string().required('La sucursal es obligatoria'),
    teacherId: Yup.string().required('El profesor es obligatorio'),
    courseId: Yup.string().required('El curso es obligatorio'),
    amount: Yup.number().required('El monto es obligatorio'),
    modality: Yup.string().required('La modalidad es obligatoria'),
    startDate: Yup.string().required('La fecha de inicio es obligatoria').nullable(), // Cambiado a Yup.date()
    endDate: Yup.string().required('La fecha de fin es obligatoria').nullable(), // Cambiado a Yup.date()
    commissionRate: Yup.number()
        .typeError('La comisión debe ser un número')
        .min(0, 'La comisión no puede ser menor a 0')
        .max(100, 'La comisión no puede ser mayor a 100')
        .required('La comisión es obligatoria'),
    capacity: Yup.number().required('La capacidad es obligatoria'),
});

export const updateInitialValues = {
    promotionId: '',
    branchId: '',
    teacherId: '',
    courseId: '',
    amount: '',
    modality: MODALITIES.PRESENTIAL,
    startDate: null,
    endDate: null,
    commissionRate: '',
    capacity: '',
};

export const createInitialValues = {
    promotionId: '',
    branchId: '',
    teacherId: '',
    courseId: '',
    capacity: '',
    modality: MODALITIES.PRESENTIAL,
    startDate: null,
    endDate: null,
};

export type CourseBranchFormType = {
    promotionId: string;
    branchId: string;
    teacherId: string;
    courseId: string;
    amount?: number | string;
    modality?: string;
    startDate: Date | null;
    endDate: Date | null;
    commissionRate?: number | string;
    capacity: number | string;
}
