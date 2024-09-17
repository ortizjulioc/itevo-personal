'use client'
import { Suspense } from 'react';
import { Metadata } from 'next';
import ViewTitle from '@/components/common/ViewTitle';
import IconUserPlus from '@/components/icon/icon-user-plus';
import Button from '@/components/ui/button';
import Link from 'next/link';
import UserForm from '../components/user-form';


export default async function NewUser() {
    return (
        <div className="flex flex-col gap-4">
             <ViewTitle title="Crear Nuevo Usuario" showBackPage={true} />
            <Suspense fallback={<div>Loading...</div>}>
                <UserForm />
            </Suspense>
        </div>
    );
}
