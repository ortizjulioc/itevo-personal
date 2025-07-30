'use client';
import { Button, Checkbox, FormItem, Input, Select } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { updateValidationSchema } from '../form.config';
import type { NcfRange } from '@prisma/client';
import { updateNcfRange } from '../../../libs/request';
import { NCF_TYPES } from '@/constants/ncfType.constant';
import DatePicker from '@/components/ui/date-picker';

 


export default function UpdateNcfRangeForm({ initialValues }: { initialValues: NcfRange }) {

    const route = useRouter();

    const NCF_TYPES_OPTIONS = Object.values(NCF_TYPES).map((type) => ({
        value: type.code,
        label: type.label,
    }));
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleSubmit = async (values: any) => {


        const resp = await updateNcfRange(initialValues.id, values);


        if (resp.success) {
            openNotification('success', 'rango ncf editado correctamente');
            route.push('/ncfranges');
        } else {
            alert(resp.message);
        }
    }



    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de promociones</h4>
            <Formik initialValues={initialValues} validationSchema={updateValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">

                        <FormItem name='authorizationNumber' label="Numero de autorizacion" invalid={Boolean(errors.authorizationNumber && touched.authorizationNumber)} errorMessage={errors.authorizationNumber}>
                            <Field type="text" name="authorizationNumber" component={Input} placeholder="Numero de autorizacion" />
                        </FormItem>

                        <FormItem name="prefix" label="Prefijo" invalid={Boolean(errors.prefix && touched.prefix)} errorMessage={errors.prefix}>
                            <Field type="text" name="prefix" component={Input} disabled />
                        </FormItem>

                        <FormItem name='type' label='Tipo de comprobante' invalid={Boolean(errors.type && touched.type)} errorMessage={errors.type}>
                            <Field name='type'>
                                {({ field, form }: any) => (
                                    <Select
                                        {...field}
                                        options={NCF_TYPES_OPTIONS}
                                        value={NCF_TYPES_OPTIONS.find((ncfType) => ncfType.value === String(values.type))}
                                        onChange={(option: { value: string, label: string } | null) => {
                                            form.setFieldValue('type', option?.value ?? null);
                                        }}
                                        isSearchable={false}
                                        placeholder="Selecciona una modalidad"
                                    />
                                )}
                            </Field>
                        </FormItem>

                        <FormItem name="startSequence" label="Secuencia inicial" invalid={Boolean(errors.startSequence && touched.startSequence)} errorMessage={errors.startSequence}>
                            <Field type="number" name="startSequence" component={Input} placeholder="Secuencia inicial" onWheel={(e: React.WheelEvent<HTMLInputElement>) => (e.target as HTMLInputElement).blur()} />
                        </FormItem>

                        <FormItem name="endSequence" label="Secuencia final" invalid={Boolean(errors.endSequence && touched.endSequence)} errorMessage={errors.endSequence}>
                            <Field type="number" name="endSequence" component={Input} placeholder="Secuencia final" onWheel={(e: React.WheelEvent<HTMLInputElement>) => (e.target as HTMLInputElement).blur()} />
                        </FormItem>

                        <FormItem name='dueDate' label='Fecha de vencimiento' invalid={Boolean(errors.dueDate && touched.dueDate)}    errorMessage={typeof errors.dueDate === 'string' ? errors.dueDate : undefined}>
                            <Field name='dueDate'>
                                {({ form, field }: any) => (
                                    <DatePicker
                                        field={field}
                                        form={form}
                                        placeholder='Selecciona una fecha'
                                        value={values.dueDate ? new Date(values.dueDate) : undefined}
                                        onChange={(date: Date | Date[]) => {
                                            const selectedDate = Array.isArray(date) ? date[0] : date; // Garantizamos que sea un único Date
                                            form.setFieldValue('dueDate', selectedDate);
                                        }}
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
