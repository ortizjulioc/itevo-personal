import { Metadata } from 'next';
import React from 'react';
import { getServerSession } from "next-auth/next";
import ViewTitle from "@/components/common/ViewTitle";
import { authOptions } from '../api/auth/[...nextauth]/auth-options';
import DashboardClient from '@/components/dashboard/DashboardClient';

export const metadata: Metadata = {
    title: 'Dashboard de Inicio',
};

const Sales = async () => {
    const session = await getServerSession(authOptions);

    return (
        <div className="space-y-6">
            <ViewTitle title={`¡Bienvenido ${session?.user?.name} ${session?.user?.lastName}!`} />
            <DashboardClient />
        </div>
    );
};

export default Sales;