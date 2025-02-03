'use client';
import { Button, FormItem, Input,Checkbox } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';

import { createValidationSchema, initialValues } from '../form.config';
import SelectPromotion from '@/components/common/selects/select-promotion';
import SelectBranch from '@/components/common/selects/select-branch';
import { createCourseBranch } from '../../../lib/request';



interface OptionSelect {
    value: string;
    label: string;
  }


export default function CreateCourseBranchForm() {
  const route = useRouter();
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    const data = { ...values };
    delete data.confirmPassword;

    const resp = await createCourseBranch(data);

    if (resp.success) {
      openNotification('success','Curso creado correctamente');
      route.push('/courses');
    } else {
      openNotification('error', resp.message);
    }
    setSubmitting(false);
  };


  return (
    <div className="panel">
      <h4 className="mb-4 text-xl font-semibold dark:text-white-light">Formulario de gestion academica</h4>
      <Formik initialValues={initialValues} validationSchema={createValidationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting, values, errors, touched,setFieldValue }) => (
          <Form className="form">
            <FormItem name="promotionId" label="Promocion" invalid={Boolean(errors.promotionId && touched.promotionId)} errorMessage={errors.promotionId}>
                <SelectPromotion 
                    value={values.promotionId} 
                    onChange= {(option: OptionSelect | null) => {
                         setFieldValue('promotionId', option?.value || ''); 
                    }}
                />    
            </FormItem>
            <FormItem name="branchId" label="Sucursal" invalid={Boolean(errors.branchId && touched.branchId)} errorMessage={errors.branchId}>
                <SelectBranch 
                    value={values.branchId} 
                    onChange= {(option: OptionSelect | null) => {
                         setFieldValue('branchId', option?.value || ''); 
                    }}
                />
            </FormItem>


            <FormItem name="capacity" label="Capacidad" invalid={Boolean(errors.capacity && touched.capacity)} errorMessage={errors.capacity}>
              <Field type="number" name="capacity" component={Input} />
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
