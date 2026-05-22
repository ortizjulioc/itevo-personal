import { Metadata } from 'next';
import React from 'react';
import { getServerSession } from "next-auth/next";
import ViewTitle from "@/components/common/ViewTitle";
import { authOptions } from '../api/auth/[...nextauth]/auth-options';
import DashboardClient from '@/components/dashboard/DashboardClient';
import AcademicDashboardClient from '@/components/dashboard/AcademicDashboardClient';
import BillingDashboardClient from '@/components/dashboard/BillingDashboardClient';
import CashierDashboardClient from '@/components/dashboard/CashierDashboardClient';
import AssistantDashboardClient from '@/components/dashboard/AssistantDashboardClient';
import { SUPER_ADMIN, GENERAL_ADMIN, ROOT, ACADEMIC_ADMIN, BILLING_ADMIN, CASHIER, ASSISTANT } from '@/constants/role.constant';
import { CompactNumber } from '@/components/common/CompactNumber';

export const metadata: Metadata = {
    title: 'Dashboard de Inicio',
};

const Sales = async () => {
    const session = await getServerSession(authOptions);

    // Determinar qué dashboard mostrar basado en los roles del usuario
    const userRoles = session?.user?.roles || [];
    const roleNames = userRoles.map((r: any) => r.role?.normalizedName || r.normalizedName || r.name);

    let DashboardComponent = DashboardClient; // Default (super_admin, general_admin, root)

    if (roleNames.some((r: string) => [SUPER_ADMIN, GENERAL_ADMIN, ROOT].includes(r))) {
        DashboardComponent = DashboardClient;
    } else if (roleNames.includes(ACADEMIC_ADMIN)) {
        DashboardComponent = AcademicDashboardClient;
    } else if (roleNames.includes(BILLING_ADMIN)) {
        DashboardComponent = BillingDashboardClient;
    } else if (roleNames.includes(CASHIER)) {
        DashboardComponent = CashierDashboardClient;
    } else if (roleNames.includes(ASSISTANT)) {
        DashboardComponent = AssistantDashboardClient;
    }

    return (
        <div className="space-y-6">
            <ViewTitle title={`¡Bienvenido ${session?.user?.name || ''} ${session?.user?.lastName || ''}!`} />

            <DashboardComponent />
        </div>
    );
};

export default Sales;