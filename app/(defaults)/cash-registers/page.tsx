
import type { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import { SearchInput } from "@/components/common";
import { objectToQueryString } from "@/utils";
import CashRegisterList from "./components/cash-register-list";



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

export default function CashRegister({ searchParams }: CashRegisterProps) {

    
    const query = objectToQueryString(searchParams || {});
   
    return (
        <div>
            
            <CashRegisterList query={query} />
        </div>
    );
}
