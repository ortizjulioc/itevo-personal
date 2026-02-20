
import type { Metadata } from "next";
import { objectToQueryString } from "@/utils";
import CashRegisterList from "./components/cash-register/cash-register-list";

export const metadata: Metadata = {
    title: 'Registros de caja',
};

interface CashRegisterProps {
    searchParams: Promise<{
        search?: string;
        page?: string;
        userId: string;
    }>;
}

export default async function CashRegister({ searchParams }: CashRegisterProps) {
    const params = await searchParams;
    const query = objectToQueryString(params || {});

    return (
        <div>

            <CashRegisterList query={query} />
        </div>
    );
}
