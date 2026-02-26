'use client';
import { Button, Checkbox, FormItem, Input, Select } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';
import { createNcfRange } from '../../../libs/request';
import { NCF_TYPES } from '@/constants/ncfType.constant';
import DatePicker, { extractDate } from '@/components/ui/date-picker';
import { ncfTypeToCode } from '@/utils/ncf';
import { NcfType } from '@prisma/client';

export default function CreateNcfRangeForm() {
    const route = useRouter();

    const NCF_TYPES_OPTIONS = Object.values(NCF_TYPES).map((type) => ({
        value: type.code,
        label: type.label,
    }));


    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);

        const valuesToSend =
        {
            ...values,
            startSequence: Number(values.startSequence),
            endSequence: Number(values.endSequence),
            currentSequence: Number(values.startSequence) - 1,
        };


        const resp = await createNcfRange(valuesToSend);

        if (resp.success) {
            openNotification('success', 'Rango NCF creado correctamente');
            route.push('/ncfranges');
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Rangos NCF</h4>
            <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">

                        <FormItem name='authorizationNumber' label="Numero de autorizacion" invalid={Boolean(errors.authorizationNumber && touched.authorizationNumber)} errorMessage={errors.authorizationNumber}>
                            <Field type="text" name="authorizationNumber" component={Input} placeholder="Numero de autorizacion" />
                        </FormItem>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormItem name='type' label='Tipo de comprobante' invalid={Boolean(errors.type && touched.type)} errorMessage={errors.type}>
                                <Field name='type'>
                                    {({ field, form }: any) => (
                                        <Select
                                            {...field}
                                            options={NCF_TYPES_OPTIONS}
                                            value={NCF_TYPES_OPTIONS.find((ncfType) => ncfType.value === values.type)}
                                            onChange={(option: { value: string, label: string } | null) => {
                                                form.setFieldValue('type', option?.value ?? null);
                                            }}
                                            isSearchable={false}
                                            placeholder="Selecciona un tipo de comprobante"
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            <FormItem name="prefix" label="Prefijo" invalid={Boolean(errors.prefix && touched.prefix)} errorMessage={errors.prefix}>
                                <Input disabled value={`${values.prefix}${values.type ? (ncfTypeToCode[values.type as NcfType] || '') : ''}`} />
                            </FormItem>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormItem name="startSequence" label="Secuencia inicial" invalid={Boolean(errors.startSequence && touched.startSequence)} errorMessage={errors.startSequence}>
                                <Field type="text" name="startSequence" component={Input} placeholder="Secuencia inicial" />
                            </FormItem>

                            <FormItem name="endSequence" label="Secuencia final" invalid={Boolean(errors.endSequence && touched.endSequence)} errorMessage={errors.endSequence}>
                                <Field type="text" name="endSequence" component={Input} placeholder="Secuencia final" />
                            </FormItem>
                        </div>
                        {values.startSequence !== undefined && values.endSequence !== undefined && Number(values.endSequence) > 0 && (
                            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Cantidad de comprobantes a ingresar: {Math.max(0, Number(values.endSequence) - Number(values.startSequence))}
                            </div>
                        )}

                        <FormItem name='dueDate' label='Fecha de vencimiento' invalid={Boolean(errors.dueDate && touched.dueDate)} errorMessage={errors.dueDate}>
                            <Field name='dueDate'>
                                {({ form, field }: any) => (
                                    <DatePicker
                                        field={field}
                                        form={form}
                                        placeholder='Selecciona una fecha'
                                        value={values.dueDate ? new Date(values.dueDate) : undefined}
                                        onChange={(date) => form.setFieldValue('dueDate', extractDate(date))}
                                    />
                                )}
                            </Field>
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
