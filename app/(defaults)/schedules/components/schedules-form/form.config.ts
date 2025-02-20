import * as Yup from 'yup';

export const createValidationSchema = Yup.object().shape({
  startTime: Yup.string().required('La hora de inicio es obligatoria'),
  endTime: Yup.string().required('La hora de fin es obligatoria'),
  weekday:Yup.number()
    .nullable()
    .min(0, 'El día de la semana debe ser igual o mayor a 0')
    .max(6, 'El día de la semana debe ser  igual o menor a 6') 
});

export const updateValidationSchema = Yup.object().shape({
  startTime: Yup.string().required('La hora de inicio es obligatoria'),
  endTime: Yup.string().required('La hora de fin es obligatoria'),
  weekday: Yup.number()
    .nullable()
    .required('El día de la semana es obligatorio')
    .min(0, 'El día de la semana debe ser igual o mayor a 0')
    .max(6, 'El día de la semana debe ser  igual o menor a 6') 
});

export const initialValues = {
    startTime: '', 
    endTime: '',
    weekday: null,
  };
