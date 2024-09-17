import * as Yup from 'yup';

// Esquema de validación con Yup
const validationSchema = Yup.object({
  nombres: Yup.string()
    .min(2, 'El nombre debe tener como mínimo 2 caracteres')
    .max(50, 'El nombre debe tener como máximo 50 caracteres')
    .required('El nombre es requerido'),
  apellidos: Yup.string()
    .min(2, 'El apellido debe tener como mínimo 2 caracteres')
    .max(50, 'El apellido debe tener como máximo 50 caracteres')
    .required('El apellido es requerido'),
  correo: Yup.string()
    .email('El correo electrónico debe ser válido')
    .required('El correo electrónico es requerido'),
  username: Yup.string()
    .min(3, 'El nombre de usuario debe tener como mínimo 3 caracteres')
    .max(20, 'El nombre de usuario debe tener como máximo 20 caracteres')
    .required('El nombre de usuario es requerido'),
});

// Valores predeterminados
const defaultValues = {
  nombres: '',
  apellidos: '',
  correo: '',
  username: '',
};

// Exportar la configuración del formulario
const UserFormConfig = { validationSchema, defaultValues };

export default UserFormConfig;
