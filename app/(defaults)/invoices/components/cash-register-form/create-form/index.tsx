'use client';
import { Button, Checkbox, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';
import { createCashRegister } from '../../../lib/cash-register-request';
import { useSession } from 'next-auth/react';


export default function CreateCashRegisterForm() {
    const route = useRouter();
    const { data: session, status } = useSession();
    const user = session?.user as {
        id: string;
        name?: string | null;
        email?: string | null;
        username?: string;
        phone?: string;
        lastName?: string;
        roles?: any[];
        branches?: any[];
      };
      
 
    console.log(session, status);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);

        if (!user?.branches || user.branches.length === 0) {
            openNotification('error', 'No se encontró una sucursal asociada al usuario');
            setSubmitting(false);
            return;
        }
        
        const valuesToSend = {
            name: values.name,
            branchId: user.branches[0].id,
            userId: user.id,
            initialBalance: Number(values.initialBalance),

        };
        const resp = await createCashRegister(valuesToSend);

        if (resp.success) {
            openNotification('success', 'CashRegistero creado correctamente');
            route.push(`/invoices/${resp.data}`);
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Registro de caja</h4>
            <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">

                        <FormItem name="name" label="Nombre" invalid={Boolean(errors.name && touched.name)} errorMessage={errors.name}>
                            <Field type="text" name="name" component={Input}  />
                        </FormItem>
                        <FormItem name="initialBalance" label="Saldo Inicial" invalid={Boolean(errors.initialBalance && touched.initialBalance)} errorMessage={errors.initialBalance}>
                            <Field type="number" name="initialBalance" component={Input} placeholder="Ingrese el saldo inicial" />
                        </FormItem>

                        <div className="mt-6 flex justify-end gap-2">
                            <Button type="button" color="danger" onClick={() => route.back()}>
                                Cancelar
                            </Button>
                            <Button loading={isSubmitting} type="submit">
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
