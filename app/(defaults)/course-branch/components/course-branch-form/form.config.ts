import { MODALITIES } from '@/constants/modality.constant';
import { CourseBranchStatus, Modality, PaymentFrequency } from '@prisma/client';
import * as Yup from 'yup';

export const createValidationSchema = Yup.object().shape({
    promotionId: Yup.string().required('La promoción es obligatoria'),
    branchId: Yup.string().required('La sucursal es obligatoria'),
    teacherId: Yup.string().required('El profesor es obligatorio'),
    courseId: Yup.string().required('El curso es obligatorio'),
    capacity: Yup.number().required('La capacidad es obligatoria').nullable(),
    sessionCount: Yup.number().min(1, 'La cantidad de sesiones debe ser al menos 1').required('La cantidad de sesiones es obligatoria').nullable(),
});

export const updateValidationSchema = Yup.object().shape({
    promotionId: Yup.string().required('La promoción es obligatoria'),
    branchId: Yup.string().required('La sucursal es obligatoria'),
    teacherId: Yup.string().required('El profesor es obligatorio'),
    courseId: Yup.string().required('El curso es obligatorio'),
    amount: Yup.number().required('El monto es obligatorio'),
    enrollmentAmount: Yup.number(),
    modality: Yup.string()
        .oneOf(Object.values(MODALITIES), 'La modalidad no es válida')
        .required('La modalidad es obligatoria'),
    startDate: Yup.string().nullable(), // Cambiado a Yup.date()
    endDate: Yup.string().nullable(), // Cambiado a Yup.date()
    commissionRate: Yup.number()
        .typeError('La comisión debe ser un número')
        .min(0, 'La comisión no puede ser menor a 0')
        .max(100, 'La comisión no puede ser mayor a 100')
        .required('La comisión es obligatoria'),
    commissionAmount: Yup.number()
        .typeError('El monto de comisión debe ser un número')
        .min(0, 'El monto de comisión no puede ser menor a 0')
        .required('El monto de comisión es obligatorio'),
    capacity: Yup.number().required('La capacidad es obligatoria'),
    status: Yup.string()
        .oneOf(Object.values(CourseBranchStatus), 'El estado no es válido')
        .required('El estado es obligatorio'),
    sessionCount: Yup.number().required('El número de sesiones es obligatorio'),
    paymentFrequency: Yup.string()
        .oneOf([PaymentFrequency.WEEKLY, PaymentFrequency.MONTHLY], 'La frecuencia de pago no es válida')
        .required('La frecuencia de pago es obligatoria'),
});

export const updateInitialValues = {
    promotionId: '',
    branchId: '',
    teacherId: '',
    courseId: '',
    amount: '',
    enrollmentAmount: '',
    modality: MODALITIES.PRESENTIAL,
    startDate: null,
    endDate: null,
    commissionRate: '',
    commissionAmount: '',
    capacity: '',
    status: '',
    sessionCount: '',
};

export const createInitialValues = {
    promotionId: '',
    branchId: '',
    teacherId: '',
    courseId: '',
    capacity: '',
    sessionCount: '',
};

export type CreateCourseBranchFormType = {
    promotionId: string;
    branchId: string;
    teacherId: string;
    courseId: string;
    capacity: number | string;
    sessionCount:number | string;
}

export type CourseBranchFormType = {
    promotionId: string;
    branchId: string;
    teacherId: string;
    courseId: string;
    amount: number;
    enrollmentAmount: number;
    modality: Modality;
    startDate: Date | null;
    endDate: Date | null;
    commissionRate: number;
    commissionAmount: number;
    capacity: number;
    status: CourseBranchStatus;
    sessionCount: number;
}
