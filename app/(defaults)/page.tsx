import { Metadata } from 'next';
import React from 'react';
import { getServerSession } from "next-auth/next";
import ViewTitle from "@/components/common/ViewTitle";
import { authOptions } from '../api/auth/[...nextauth]/auth-options';

export const metadata: Metadata = {
    title: 'Inicio',
};

const Sales = async () => {
    const session = await getServerSession(authOptions);
    console.log(session);
    return (
        <div>
            <ViewTitle title={`¡Bienvenido ${session?.user?.name} ${session?.user?.lastName}!`} />
        </div>
    );
};

export default Sales;
