import { CashRegisterClosureResponse } from "@/@types/cash-register";
import useFetchSetting from "@/app/(defaults)/settings/lib/use-fetch-settings";
import { ClosurePDF } from "@/components/pdf/closure";
import Button from "@/components/ui/button";
import { openNotification } from "@/utils";
import { usePrintPDF } from "@/utils/hooks/use-print-pdf";
import { fetchImageAsBase64 } from "@/utils/image";
import apiRequest from "@/utils/lib/api-request/request";
import { useState } from "react";
import { IoMdPrint } from "react-icons/io";

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
        console.log('Closure Data:', data);

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

        await printPDF(
            <ClosurePDF
                closure={closureDataMaped}
                companyInfo={setting}
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
