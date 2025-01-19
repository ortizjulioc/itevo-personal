import * as Yup from 'yup';

export const createValidationSchema = Yup.object().shape({
  startTime: Yup.date().required('La hora de inicio es obligatoria'),
  endTime: Yup.date().required('La hora de fin es obligatoria'),
  weekday:Yup.number()
    .nullable()
    .required('El día de la semana es obligatorio'),
});

export const updateValidationSchema = Yup.object().shape({
  startTime: Yup.date().required('La hora de inicio es obligatoria'),
  endTime: Yup.date().required('La hora de fin es obligatoria'),
  weekday: Yup.number()
    .nullable()
    .required('El día de la semana es obligatorio'),
});

export const initialValues = {
    startTime: undefined as Date | undefined, // Cambiamos null a undefined
    endTime: undefined as Date | undefined,
    weekday: null,
  };
