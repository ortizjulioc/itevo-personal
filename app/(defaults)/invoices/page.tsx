
import type { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import { SearchInput } from "@/components/common";
import { objectToQueryString } from "@/utils";
import CashRegisterList from "./components/cash-register-list";
import CashRegisterModal from "./components/cash-register-modal";



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
                    <SearchInput 
                        placeholder="Buscar cajas"
                       
                         />

                   
                    <CashRegisterModal  />
                </>
            } />

            <CashRegisterList query={query} />
        </div>
    );
}
