'use client';

import ViewTitle from "@/components/common/ViewTitle";
import { objectToQueryString } from "@/utils";
import InvoiceList from "./components/invoice-list";
import SearchInvoice from "./components/invoice-search";
import { useActiveBranch } from "@/utils/hooks/use-active-branch";
import { useSession } from "next-auth/react";
import { CASHIER } from "@/constants/role.constant";
import { useEffect, useState } from "react";
import apiRequest from "@/utils/lib/api-request/request";

export default function BillsClient({ searchParams }: { searchParams?: { search?: string; page?: string } }) {
    const { activeBranchId } = useActiveBranch();
    const { data: session } = useSession();
    const [cashRegisterIds, setCashRegisterIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Check if user is a cashier
    const isCashier = session?.user?.roles?.some((role: any) => role.normalizedName === CASHIER);

    // Fetch cash registers owned by the current user if they are a cashier
    useEffect(() => {
        const fetchUserCashRegisters = async () => {
            if (isCashier && session?.user?.id) {
                try {
                    const response = await apiRequest.get<any>(`/cash-register?userId=${session.user.id}`);
                    if (response.success && response.data?.cashRegisters) {
                        const ids = response.data.cashRegisters.map((cr: any) => cr.id);
                        setCashRegisterIds(ids);
                    }
                } catch (error) {
                    console.error('Error fetching cash registers:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUserCashRegisters();
    }, [isCashier, session?.user?.id]);

    // Build query parameters
    const paramsWithBranch = {
        ...searchParams,
        ...(activeBranchId && { branchId: activeBranchId }),
    };

    // If user is a cashier, add cashRegisterId filter
    // Only show invoices from their cash registers
    const finalParams = isCashier && cashRegisterIds.length > 0
        ? { ...paramsWithBranch, cashRegisterIds: cashRegisterIds.join(',') }
        : paramsWithBranch;

    const query = objectToQueryString(finalParams || {});

    return (
        <div>
            <ViewTitle className='mb-6' title="Facturas" />
            <div>
                <SearchInvoice />
            </div>
            {loading && isCashier ? (
                <div className="text-center py-8">Cargando facturas...</div>
            ) : (
                <InvoiceList query={query} />
            )}
        </div>
    );
}

