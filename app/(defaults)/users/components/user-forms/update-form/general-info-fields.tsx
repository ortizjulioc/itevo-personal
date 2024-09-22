import { FormatPatterInput } from "@/components/common";
import { FormItem, Input } from "@/components/ui";
import { Field } from "formik";

export default function GeneralInfoFields({ values, errors, touched }: any) {
    return (
        <>
            <FormItem
                name="name"
                label="Nombre"
                invalid={Boolean(errors.name && touched.name)}
                errorMessage={errors.name}
            >
                <Field
                    type="text"
                    name="name"
                    component={Input}
                    placeholder="Escribe tu nombre"
                />
            </FormItem>

            <FormItem
                name="lastName"
                label="Apellido"
                invalid={Boolean(errors.lastName && touched.lastName)}
                errorMessage={errors.lastName}
            >
                <Field
                    type="text"
                    name="lastName"
                    component={Input}
                    placeholder="Escribe tu apellido"
                />
            </FormItem>

            <FormItem
                name="username"
                label="Nombre de usuario"
                invalid={Boolean(errors.username && touched.username)}
                errorMessage={errors.username}
            >
                <Field
                    type="text"
                    name="username"
                    component={Input}
                    placeholder="Escribe tu nombre de usuario"
                />
            </FormItem>

            <FormItem
                name="email"
                label="Correo electrónico"
                invalid={Boolean(errors.email && touched.email)}
                errorMessage={errors.email}
            >
                <Field
                    type="email"
                    name="email"
                    component={Input}
                    placeholder="Escribe tu correo electrónico"
                />
            </FormItem>

            <FormItem
                extra={<span className="text-sm text-gray-500">(Opcional)</span>}
                name="phone"
                label="Teléfono"
                invalid={Boolean(errors.phone && touched.phone)}
                errorMessage={errors.phone}
            >
                <Field name="phone">
                    {({ form }: any) => (
                        <FormatPatterInput
                            format="(###) ###-####"
                            placeholder="(___) ___-____"
                            className="form-input"
                            value={values.phone}
                            onValueChange={(value: any) => {
                                form.setFieldValue('phone', value.value);
                            }}
                        />
                    )}
                </Field>
            </FormItem>
        </>
    )
}
