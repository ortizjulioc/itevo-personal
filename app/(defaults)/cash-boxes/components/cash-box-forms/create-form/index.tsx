'use client';
import { Button, FormItem, Input, } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';

import { createCashBox } from '../../../lib/request';
import { useSession } from 'next-auth/react';
import { Branch, Role } from '@prisma/client';




export default function CreateCashBoxForm() {
    const route = useRouter();
    const { data: session, status } = useSession();

    const user = session?.user as {
        id: string;
        name?: string | null;
        email?: string | null;
        username?: string;
        phone?: string;
        lastName?: string;
        roles?: Role[];
        mainBranch: Branch;
        branches?: any[];
    };



    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);

        const valuesToSend =
        {
            ...values,
            branchId: user.mainBranch.id,
        };


        const resp = await createCashBox(valuesToSend);

        if (resp.success) {
            openNotification('success', 'Caja Fisica correctamente');
            route.push('/cash-boxes');
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Cajas fisicas</h4>
            <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, errors, touched }) => (
                    <Form className="form">

                        <FormItem name='name' label="Nombre" invalid={Boolean(errors.name && touched.name)} errorMessage={errors.name}>
                            <Field type="text" name="name" component={Input} />
                        </FormItem>

                        <FormItem name="location" label="Ubicacion" invalid={Boolean(errors.location && touched.location)} errorMessage={errors.location}>
                            <Field type="text" name="location" component={Input} />
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
