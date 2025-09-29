'use client';
import { Button, FormItem, Input, } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { updateValidationSchema } from '../form.config';
import type { CashBox } from '@prisma/client';
import { updateCashBox } from '../../../lib/request';




export default function UpdateCashBoxForm({ initialValues }: { initialValues: CashBox }) {

    const route = useRouter();


    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleSubmit = async (values: any) => {
        // excluir branch de values
        const { branch, ...restValues } = values;

        const resp = await updateCashBox(initialValues.id, restValues);

        if (resp.success) {
            openNotification('success', 'Caja física editada correctamente');
            route.push('/cash-boxes');
        } else {
            openNotification('error', resp.message);
        }
    };


    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Cajas fisicas</h4>
            <Formik initialValues={initialValues} validationSchema={updateValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched }) => (
                    <Form className="form">

                        <FormItem name='name' label="Nombre" invalid={Boolean(errors.name && touched.name)} errorMessage={errors.name}>
                            <Field type="text" name="name" component={Input} />
                        </FormItem>

                        <FormItem name="location" label="Prefijo" invalid={Boolean(errors.location && touched.location)} errorMessage={errors.location}>
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
