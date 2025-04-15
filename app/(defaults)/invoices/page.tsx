
import type { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import { SearchInput } from "@/components/common";
import { objectToQueryString } from "@/utils";
import CashRegisterModal from "./components/cash-register/cash-register-modal";
import CashRegisterList from "./components/cash-register/cash-register-list";



export const metadata: Metadata = {
    title: 'registros de caja',
};

interface CashRegisterProps {
    searchParams?: {
        search?: string;
        page?: string;
    };
}

export default function CashRegister({ searchParams }: CashRegisterProps) {
    const query = objectToQueryString(searchParams || {});
   
    return (
        <div>
            <ViewTitle className='mb-6' title="Facturacion" rightComponent={
                <>
                    <CashRegisterModal  />
                </>
            } />

            <CashRegisterList query={query} />
        </div>
    );
}
