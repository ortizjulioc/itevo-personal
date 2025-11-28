
import type { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import { SearchInput } from "@/components/common";
import { objectToQueryString } from "@/utils";
import CashRegisterList from "./components/cash-register-list";



import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export const metadata: Metadata = {
    title: 'Cajas',
};

interface CashRegisterProps {
    searchParams?: {
        search?: string;
        page?: string;
        userId: string;
    };
}

import { CASHIER } from "@/constants/role.constant";

export default async function CashRegister({ searchParams }: CashRegisterProps) {
    const session = await getServerSession(authOptions);
    const isCashier = session?.user?.roles.some((role: any) => role.normalizedName === CASHIER);

    const queryParams = { ...searchParams };

    if (isCashier && session?.user?.id) {
        queryParams.userId = session.user.id;
    }

    const query = objectToQueryString(queryParams);

    return (
        <div>

            <CashRegisterList query={query} />
        </div>
    );
}
