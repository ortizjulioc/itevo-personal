import { Metadata } from 'next';
import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
export const metadata: Metadata = {
    title: 'Home',
};
import ViewTitle from "@/components/common/ViewTitle";

const Sales = async () => {
    const session = await getServerSession(authOptions);
    console.log(session);
    return <div>
        <ViewTitle title={`¡Bienvenido ${session?.user?.name} ${session?.user?.lastName} !` } />
    </div>;
};

export default Sales;
