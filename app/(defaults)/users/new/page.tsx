import { Suspense } from 'react';

import { Metadata } from 'next';
import ViewTitle from '@/components/common/ViewTitle';
import IconUserPlus from '@/components/icon/icon-user-plus';
import Button from '@/components/ui/button';
import Link from 'next/link';
import UserForm from '../components/user-form';

export const metadata: Metadata = {
    title: 'Nuevo Usuario',
};

export default async function NewUser() {
    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl">Usuarios</h2>

                <Suspense fallback={<div>Loading...</div>}>
                   <UserForm />
                </Suspense>
            </div>
        </div>
    );
}
