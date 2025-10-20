'use client';
import { Button, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';
import { useSession } from 'next-auth/react';
import { createCashRegister } from '@/app/(defaults)/invoices/lib/cash-register/cash-register-request';
import { useState } from 'react';
import SelectCashBox, { SelectCashBoxType } from '@/components/common/selects/select-cash-box';


export default function CreateCashRegisterForm() {
    const route = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async (values: any) => {
        setLoading(true);

        if (!user?.branches || user.branches.length === 0) {
            openNotification('error', 'No se encontró una sucursal asociada al usuario');
            setLoading(false);
            return;
        }

        if (!user.id) {
            openNotification('error', 'No se encontró el usuario asociado al registro de caja');
            setLoading(false);
            return;
        }

        const valuesToSend = {
            cashBoxId: values.cashBoxId,
            branchId: user.branches[0].id,
            userId: user.id,
            initialBalance: Number(values.initialBalance),
            openingDate: new Date(),
            closedAt: null,
        };

        try {
            const resp = await createCashRegister(valuesToSend);

            if (resp.success) {
                openNotification('success', 'Caja creada correctamente');
                const cashRegister = resp.data as any;

                if (cashRegister?.id) {
                    await route.push(`/invoices/${cashRegister.id}`);
                    return;
                } else {
                    openNotification('error', 'No se pudo obtener el ID de la caja creada');
                }
            } else {
                openNotification('error', resp.message);
            }
        } catch (error) {
            console.error(error);
            openNotification('error', 'Ocurrió un error inesperado');
        }

        setLoading(false);
    };

    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Registro de caja</h4>
            <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">
                        <FormItem
                            name="cashBoxId"
                            label="Caja"
                            invalid={Boolean(errors.cashBoxId && touched.cashBoxId)}
                            errorMessage={errors.cashBoxId}
                        >
                            <Field>
                                {({ form, field }: any) => (
                                    <SelectCashBox
                                        {...field}
                                        value={values.cashBoxId}
                                        onChange={(option: SelectCashBoxType | null) => {
                                            form.setFieldValue('cashBoxId', option?.value || '');
                                        }}
                                    />
                                )}
                            </Field>
                        </FormItem>
                        <FormItem
                            name="initialBalance"
                            label="Saldo Inicial"
                            invalid={Boolean(errors.initialBalance && touched.initialBalance)}
                            errorMessage={errors.initialBalance}
                        >
                            <Field
                                type="number"
                                onWheel={(e: React.WheelEvent<HTMLInputElement>) => (e.target as HTMLInputElement).blur()}
                                name="initialBalance"
                                component={Input}
                                placeholder="Ingrese el saldo inicial"
                            />
                        </FormItem>

                        <div className="mt-6 flex justify-end gap-2">
                            <Button type="button" color="danger" onClick={() => route.back()}>
                                Cancelar
                            </Button>
                            <Button loading={loading} type="submit">
                                {loading ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
