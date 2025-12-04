import { CashRegisterClosureResponse } from "@/@types/cash-register";
import useFetchSetting from "@/app/(defaults)/settings/lib/use-fetch-settings";
import { ClosurePDF } from "@/components/pdf/closure";
import Button from "@/components/ui/button";
import { openNotification } from "@/utils";
import { usePrintPDF } from "@/utils/hooks/use-print-pdf";
import { fetchImageAsBase64 } from "@/utils/image";
import apiRequest from "@/utils/lib/api-request/request";
import { printPDFDirect } from "@/utils/print-pdf-direct";
import { useState } from "react";
import { IoMdPrint } from "react-icons/io";

export type PrintClosureParams = {
    closureId: string;
    cashRegisterId: string;
    setting: any;
};

async function fetchClosure(closureId: string, cashRegisterId: string) {
    const resp = await apiRequest.get<CashRegisterClosureResponse>(
        `/cash-register/${cashRegisterId}/closure/${closureId}`
    );
    if (resp.success && resp.data) return resp.data;

    openNotification("error", resp.message || "Error al obtener el cierre de caja");
    return null;
}

export async function printClosureDirect(params: PrintClosureParams) {
    const { setting, closureId, cashRegisterId } = params;

    if (!setting) {
        openNotification("error", "No se encontró la configuración de la empresa para imprimir.");
        return null;
    }

    const data = await fetchClosure(closureId, cashRegisterId);
    if (!data) return;

    let blobLogo = null;
    if (setting.logo) {
        blobLogo = await fetchImageAsBase64(setting.logo);
    }

    const closureMapped = {
        openingDate: data.cashRegister.openingDate,
        closureDate: data.closureDate,
        initialCash: data.cashRegister.initialBalance,
        expectedCash: data.expectedTotalCash,
        differenceCash: data.totalCash - data.expectedTotalCash,
        branch: data.cashRegister.cashBox.branch.name,
        user: `${data.user.name} ${data.user.lastName}`,
        cashBreakdown: data.cashBreakdown,
    };

    const companyInfo = {
        companyName: setting.companyName || '',
        rnc: setting.rnc || '',
        address: data.cashRegister.cashBox.branch.address || setting.address || '',
        phone: data.cashRegister.cashBox.branch.phone || setting.phone || '',
        email: data.cashRegister.cashBox.branch.email || setting.email || '',
    };

    await printPDFDirect(
        <ClosurePDF
            closure={closureMapped}
            companyInfo={companyInfo}
            logo={blobLogo}
        />,
        { cleanUpMilliseconds: 600000 }
    );

    return true;
}

export default function PrintClosure({ closureId, cashRegisterId }: { closureId: string, cashRegisterId: string }) {
    const { printPDF } = usePrintPDF();
    const { loading: loadingSettings, setting } = useFetchSetting();
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async ({ closureId, cashRegisterId }: { closureId: string, cashRegisterId: string }) => {
        try {
            setLoading(true);
            const response = await apiRequest.get<CashRegisterClosureResponse>(`/cash-register/${cashRegisterId}/closure/${closureId}`);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = async () => {
        if (!setting) openNotification('error', 'No se encontró la configuración de la empresa para imprimir.');
        const data = await fetchData({ closureId, cashRegisterId });
        if (!data) return openNotification('error', 'No se encontró el cierre de caja para imprimir.');

        let blobLogo = null;
        if (setting?.logo) {
            blobLogo = await fetchImageAsBase64(setting.logo);
        }

        const closureDataMaped = {
            openingDate: data.cashRegister.openingDate,
            closureDate: data.closureDate,

            initialCash: data.cashRegister.initialBalance,
            expectedCash: data.expectedTotalCash,
            differenceCash: data.totalCash - data.expectedTotalCash,

            branch: data.cashRegister.cashBox.branch.name,
            user: `${data.user.name} ${data.user.lastName}`,
            cashBreakdown: data.cashBreakdown,
        };

        const companyInfo = {
            companyName: setting?.companyName || '',
            rnc: setting?.rnc || '',
            address: data.cashRegister.cashBox.branch.address || setting?.address || '',
            phone: data.cashRegister.cashBox.branch.phone || setting?.phone || '',
            email: data.cashRegister.cashBox.branch.email || setting?.email || '',
        };

        await printPDF(
            <ClosurePDF
                closure={closureDataMaped}
                companyInfo={companyInfo}
                logo={blobLogo}
            />,
            { cleanUpMilliseconds: 600000 }
        );
    }
    return (
        <Button
            icon={<IoMdPrint className='text-lg ' />}
            onClick={handlePrint}
            loading={loadingSettings || loading}
        >
            Imprimir cierre de caja
        </Button>
    )
}
