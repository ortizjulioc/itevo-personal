'use client';
import { Button, Checkbox, FormItem, Input } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import { createValidationSchema, initialValues } from '../form.config';
import { createProduct } from '../../../lib/request';


export default function CreateProductForm() {
    const route = useRouter();
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        setSubmitting(true);


        const resp = await createProduct(values);

        if (resp.success) {
            openNotification('success', 'Producto creado correctamente');
            route.push('/products');
        } else {
            openNotification('error', resp.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="panel">
            <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de Productos</h4>
            <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form className="form">

                        <FormItem name="code" label="Código" invalid={Boolean(errors.code && touched.code)} errorMessage={errors.code}>
                            <Field type="text" name="code" component={Input}  />
                        </FormItem>
                        <FormItem name="name" label="Nombre" invalid={Boolean(errors.name && touched.name)} errorMessage={errors.name}>
                            <Field type="text" name="name" component={Input}  />
                        </FormItem>
                        <FormItem name="description" label="Descripción" invalid={Boolean(errors.description && touched.description)} errorMessage={errors.description}>
                            <Field type="textarea" name="description" component={Input}/>
                        </FormItem>
                        <FormItem name="cost" label="Costo" invalid={Boolean(errors.cost && touched.cost)} errorMessage={errors.cost}>
                            <Field type="number" name="cost" component={Input} placeholder="Ingrese el costo de la promoción" />
                        </FormItem>
                        <FormItem name="price" label="Precio" invalid={Boolean(errors.price && touched.price)} errorMessage={errors.price}>
                            <Field type="number" name="price" component={Input} />
                        </FormItem>
                       
                        <FormItem name="stock" label="Stock" invalid={Boolean(errors.stock && touched.stock)} errorMessage={errors.stock}>
                            <Field type="number" name="stock" component={Input} placeholder="Ingrese el stock de la promoción" />
                        </FormItem>


                             <FormItem name="isTaxIncluded" label="" invalid={Boolean(errors.isTaxIncluded && touched.isTaxIncluded)} errorMessage={errors.isTaxIncluded}>
                               <Field type="checkbox" name="isTaxIncluded" component={Checkbox} >
                                 Tiene los impuestos incluidos
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
