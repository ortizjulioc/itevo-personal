import * as Yup from 'yup';

export const scheduleValidationSchema = Yup.object().shape({
    startTime: Yup.string()
        .required('La hora de inicio es obligatoria'),
    endTime: Yup.string()
        .required('La hora de fin es obligatoria'),
    weekday: Yup.number()
        .required('El día de la semana es obligatorio')
        .min(0, 'El día de la semana debe estar entre 0 (Domingo) y 6 (Sábado)')
        .max(6, 'El día de la semana debe estar entre 0 (Domingo) y 6 (Sábado)'),
    
});

export const initialValues = {
    startTime: '',
    endTime: '',
    weekday: '',
};
