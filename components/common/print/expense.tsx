'use client'
import useFetchSetting from '@/app/(defaults)/settings/lib/use-fetch-settings';
import { ExpensePDF } from '@/components/pdf/expense';
import { Button } from '@/components/ui';
import { fetchImageAsBase64 } from '@/utils/image';
import { pdf } from '@react-pdf/renderer';
import React, { useEffect } from 'react'
import { IoMdPrint } from 'react-icons/io';
import { CashMovement } from '@/app/(defaults)/cash-registers/lib/use-fetch-cash-movement-by-id';

type PrintExpenseProps = {
    cashMovement: CashMovement;
}
export default function PrintExpense({ cashMovement }: PrintExpenseProps) {
    const { setting, loading: loadingSettings } = useFetchSetting();
    const [loading, setLoading] = React.useState<boolean>(false);

    const onPrint = () => {
        if (!cashMovement) {
            alert('No se encontró el movimiento para imprimir.');
            return;
        }
        if (!setting) {
            alert('No se encontró la configuración de la empresa para imprimir.');
            return;
        }
        handlePrintPDF(cashMovement);
    }

    const handlePrintPDF = async (cashMovement: CashMovement) => {
        setLoading(true);
        try {
            let companyInfo = {
                companyName: setting?.companyName,
                address: setting?.address,
                phone: setting?.phone,
                email: setting?.email,
                logoUrl: setting?.logo,
                rnc: setting?.rnc,
            }

            let blobLogo = null;
            if (companyInfo.logoUrl) {
                blobLogo = await fetchImageAsBase64(companyInfo.logoUrl);
            }
            console.log('Generating PDF for expense:', cashMovement);
            const blob = await pdf(<ExpensePDF cashMovement={cashMovement} companyInfo={companyInfo} logo={blobLogo} />).toBlob();

            const blobUrl = URL.createObjectURL(blob);

            const isKioskMode = navigator.userAgent.includes('Chrome') && window.location.search.includes('kiosk-printing');
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            iframe.src = blobUrl;

            iframe.onload = () => {
                try {
                    iframe.contentWindow?.focus();

                    if (isKioskMode) {
                        iframe.contentWindow?.print();
                        setTimeout(() => {
                            document.body.removeChild(iframe);
                            URL.revokeObjectURL(blobUrl);
                        }, 1000);
                    } else {
                        iframe.contentWindow?.print();
                        const cleanup = () => {
                            document.body.removeChild(iframe);
                            URL.revokeObjectURL(blobUrl);
                        }
                        window.addEventListener('afterprint', cleanup, { once: true });
                        setTimeout(() => {
                            if (document.body.contains(iframe)) {
                                document.body.removeChild(iframe);
                                URL.revokeObjectURL(blobUrl);
                            }
                        }, 3 * 60 * 1000); // 3 minutes timeout
                    }
                } catch (error) {
                    console.error('Error al imprimir:', error);
                    alert('Error al imprimir el PDF. Verifica la configuración de la impresora.');
                    document.body.removeChild(iframe);
                    URL.revokeObjectURL(blobUrl);
                }
            };

            iframe.onerror = () => {
                alert('Error al cargar el PDF para impresión.');
                document.body.removeChild(iframe);
                URL.revokeObjectURL(blobUrl);
            };
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            alert('Error al generar el PDF. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(loadingSettings);
    }, [loadingSettings]);

    return (
        <>
            <Button
                onClick={onPrint}
                loading={loading}
                icon={<IoMdPrint className='text-lg ' />}
            >

                {loading ? 'Generando...' : 'Imprimir'}
            </Button>
        </>
    )
}
