
import type { Metadata } from "next";
import { objectToQueryString } from "@/utils";
import CashRegisterList from "./components/cash-register/cash-register-list";

export const metadata: Metadata = {
    title: 'Registros de caja',
};

interface CashRegisterProps {
    searchParams?: {
        search?: string;
        page?: string;
        userId: string;
    };
}

export default function CashRegister({ searchParams }: CashRegisterProps) {


    const query = objectToQueryString(searchParams || {});

    return (
        <div>

            <CashRegisterList query={query} />
        </div>
    );
}
