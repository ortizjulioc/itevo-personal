'use client';
import { Button, Checkbox, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { updateValidationSchema } from '../form.config';
import { Setting } from '@prisma/client';
import { FormatPatterInput } from '@/components/common';
import { deleteLogo, updateSetting, uploadLogo } from '../../lib/request';
import ImageUploader from '@/components/common/ImageUploader';
import { Tab } from '@headlessui/react';
import dynamic from "next/dynamic";
// 🚀 Importa solo en cliente
const RichTextEditor = dynamic(() => import("@/components/common/rich-text-editor"), {
  ssr: false,
});

export default function UpdateSettingForm({ initialValues }: { initialValues: Setting }) {
    const route = useRouter();
    console.log('initialValues', initialValues);
    const handleSubmit = async (values: any) => {
        const data = { ...values };

        const resp = await updateSetting(initialValues.id, data);


        if (resp.success) {
            openNotification('success', 'Configuracion editada correctamente');
        } else {
            alert(resp.message);
        }
    }

    const handleUploadLogo = async (file: File, setFieldValue: (path: string, value: any) => void) => {
        const resp = await uploadLogo(file);
        if (resp.success) {
            openNotification('success', 'Logo actualizado correctamente');
            const url = (resp as any).data.url as string;
            if (!url) {
                openNotification('error', 'No se pudo obtener la URL del logo');
                return;
            }
            setFieldValue('logo', url);
        } else {
            openNotification('error', resp.message);
        }
    }

    const handleDeleteLogo = async (file: string) => {
        const fileName = file.split('/').pop();
        if (!fileName) {
            openNotification('error', 'No se pudo obtener el nombre del archivo');
            return;
        }

        const resp = await deleteLogo(fileName);
        if (resp.success) {
            openNotification('success', 'Logo eliminado correctamente');
        } else {
            openNotification('error', resp.message);
        }
    }

    return (
        <div>
            <Formik initialValues={initialValues} validationSchema={updateValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">
                        <Tab.Group>
                            <Tab.List className="flex flex-wrap">
                                <Tab
                                    as="button"
                                    className={({ selected }) =>
                                        `${
                                            selected ? 'text-secondary !outline-none before:!w-full' : ''
                                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`
                                    }
                                >
                                    Información general de la empresa
                                </Tab>
                                <Tab
                                    as="button"
                                    className={({ selected }) =>
                                        `${
                                            selected ? 'text-secondary !outline-none before:!w-full' : ''
                                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`
                                    }
                                >
                                    Logo
                                </Tab>
                                <Tab
                                    as="button"
                                    className={({ selected }) =>
                                        `${
                                            selected ? 'text-secondary !outline-none before:!w-full' : ''
                                        } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`
                                    }
                                >
                                    Normas
                                </Tab>
                            </Tab.List>

                            <Tab.Panels>
                                {/* Panel 1 - Información general */}
                                <Tab.Panel>
                                    <div className="mt-6">
                                        <FormItem name="rnc" label="RNC" invalid={Boolean(errors.rnc && touched.rnc)} errorMessage={errors.rnc}>
                                            <Field type="text" name="rnc" component={Input} placeholder="RNC" />
                                        </FormItem>

                                        <FormItem name="companyName" label="Nombre de la empresa" invalid={Boolean(errors.companyName && touched.companyName)} errorMessage={errors.companyName}>
                                            <Field type="text" name="companyName" component={Input} placeholder="Nombre de la empresa" />
                                        </FormItem>

                                        <FormItem name="address" label="Dirección" invalid={Boolean(errors.address && touched.address)} errorMessage={errors.address}>
                                            <Field type="text" name="address" component={Input} placeholder="Dirección" />
                                        </FormItem>

                                        <FormItem
                                            extra={<span className="text-sm text-gray-500">(Opcional)</span>}
                                            name="phone"
                                            label="Teléfono"
                                            invalid={Boolean(errors.phone && touched.phone)}
                                            errorMessage={errors.phone}
                                        >
                                            <Field name="phone">
                                                {({ form, setFieldValue }: any) => (
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

                                        <FormItem name="email" label="Correo" invalid={Boolean(errors.email && touched.email)} errorMessage={errors.email}>
                                            <Field type="email" name="email" component={Input} placeholder="Correo" />
                                        </FormItem>

                                        {/* <FormItem
                                            name="defaultPassword"
                                            label="Cambiar contraseña por defecto"
                                            invalid={Boolean(errors.defaultPassword && touched.defaultPassword)}
                                            errorMessage={errors.defaultPassword}
                                        >
                                            <Field type="text" name="defaultPassword" component={Input} placeholder="Contraseña" />
                                        </FormItem> */}
                                        <FormItem name="billingWithoutNcf" label="" invalid={Boolean(errors.billingWithoutNcf && touched.billingWithoutNcf)} errorMessage={errors.billingWithoutNcf}>
                                            <Field type="checkbox" name="billingWithoutNcf" component={Checkbox}>
                                                Permitir facturar sin NCF
                                            </Field>
                                        </FormItem>

                                        <FormItem name="billingWithoutStock" label="" invalid={Boolean(errors.billingWithoutStock && touched.billingWithoutStock)} errorMessage={errors.billingWithoutStock}>
                                            <Field type="checkbox" name="billingWithoutStock" component={Checkbox}>
                                                Permitir facturar sin existencia de inventario
                                            </Field>
                                        </FormItem>
                                    </div>
                                </Tab.Panel>

                                {/* Panel 2 - Logo */}
                                <Tab.Panel>
                                    <div className="mt-6">
                                        <FormItem name="logo" label="Logo" invalid={Boolean(errors.logo && touched.logo)} errorMessage={errors.logo}>
                                            <ImageUploader value={values.logo} onUpload={(file: File) => handleUploadLogo(file, setFieldValue)} onDelete={() => handleDeleteLogo(values.logo)} />
                                        </FormItem>
                                    </div>
                                </Tab.Panel>

                                {/* Panel 3 - Normas */}
                                <Tab.Panel>
                                    <RichTextEditor
                                        value={values.rules || ''}
                                        onChange={(value) => {
                                            setFieldValue('rules', value);
                                        }}
                                        placeholder="Escribe el las normas aquí..."
                                    />
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>

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
