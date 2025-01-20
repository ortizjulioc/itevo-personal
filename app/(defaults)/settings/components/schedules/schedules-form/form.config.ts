import * as Yup from 'yup';

export const createValidationSchema = Yup.object().shape({
  startTime: Yup.string().required('La hora de inicio es obligatoria'),
  endTime: Yup.string().required('La hora de fin es obligatoria'),
  weekday:Yup.number()
    .nullable()
    .required('El día de la semana es obligatorio'),
});

export const updateValidationSchema = Yup.object().shape({
  startTime: Yup.string().required('La hora de inicio es obligatoria'),
  endTime: Yup.string().required('La hora de fin es obligatoria'),
  weekday: Yup.number()
    .nullable()
    .required('El día de la semana es obligatorio'),
});

export const initialValues = {
    startTime: '', 
    endTime: '',
    weekday: null,
  };
