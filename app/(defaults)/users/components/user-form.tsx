'use client';
import React from 'react';
import {
    Formik,
    Form,
    Field,
    ErrorMessage,
  } from 'formik';
import UserFormConfig from '@/config/form.config/users.config';
const { defaultValues, validationSchema } = UserFormConfig;



const UserForm: React.FC = () => {
  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
    
        console.log(values);
      }}
    >
      <Form>
        <div>
          <label htmlFor="nombres">Nombres</label>
          <Field type="text" id="nombres" name="nombres" />
          <ErrorMessage name="nombres" component="div" />
        </div>
        
        <div>
          <label htmlFor="apellidos">Apellidos</label>
          <Field type="text" id="apellidos" name="apellidos" />
          <ErrorMessage name="apellidos" component="div" />
        </div>
        
        <div>
          <label htmlFor="correo">Correo electrónico</label>
          <Field type="email" id="correo" name="correo" />
          <ErrorMessage name="correo" component="div" />
        </div>
        
        <div>
          <label htmlFor="username">Nombre de usuario</label>
          <Field type="text" id="username" name="username" />
          <ErrorMessage name="username" component="div" />
        </div>
        
        <button type="submit">Enviar</button>
      </Form>
    </Formik>
  );
};

export default UserForm;
