import * as Yup from 'yup';

export const updateValidationSchema = Yup.object().shape({
    rnc: Yup.string()
        .required('El RNC es obligatorio')
        .matches(/^\d+$/, 'El RNC debe ser numérico'),
    companyName: Yup.string().required('El nombre de la empresa es obligatorio'),
    address: Yup.string().required('La dirección es obligatoria'),
    phone: Yup.string(),
    email: Yup.string().email('Correo electrónico no válido'),
    logo: Yup.string(),
    defaultPassword: Yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    rules: Yup.string(),
    billingWithoutNcf: Yup.boolean(),
    billingWithoutStock: Yup.boolean(),
});

export const initialValues = {
    rnc: '',
    companyName: '',
    address: '',
    phone: '',
    email: '',
    logo: '',
    defaultPassword: '',
    rules: '',
    billingWithoutNcf: true,
    billingWithoutStock: true,
};

