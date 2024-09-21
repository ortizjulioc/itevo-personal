import { Field } from "formik";
import { FormItem, Input } from "@/components/ui";

export default function PasswordFields({ errors, touched }: any) {
    return (
        <>
            <FormItem
                name="password"
                label="Contraseña"
                invalid={Boolean(errors.password && touched.password)}
                errorMessage={errors.password}
            >
                <Field
                    type="password"
                    name="password"
                    component={Input}
                    placeholder="Ingrese su nueva contraseña"
                />
            </FormItem>

            <FormItem
                name="confirmPassword"
                label="Confirmar contraseña"
                invalid={Boolean(errors.confirmPassword && touched.confirmPassword)}
                errorMessage={errors.confirmPassword}
            >
                <Field
                    type="password"
                    name="confirmPassword"
                    component={Input}
                    placeholder="Confirme su nueva contraseña"
                />
            </FormItem>
        </>
    )
}
