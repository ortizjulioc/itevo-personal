
import * as Yup from 'yup';


export const createValidationSchema = Yup.object().shape({
    description: Yup.string().required('La descripción es obligatoria'),
    startDate: Yup.date().required('La fecha de inicio es obligatoria'),
    endDate: Yup.date().required('La fecha fin es obligatoria'),
});

export const updateValidationSchema = Yup.object().shape({
    description: Yup.string().required('La descripción es obligatoria'),
    startDate: Yup.date().required('La fecha de inicio es obligatoria'),
    endDate: Yup.date().required('La fecha fin es obligatoria'),
});

export const initialValues = {
    description: '',
    startDate: null,
    endDate: null,
};
