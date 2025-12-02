'use client'
import useFetchSetting from '@/app/(defaults)/settings/lib/use-fetch-settings';
import { Button } from '@/components/ui';
import { openNotification } from '@/utils';
// import { usePrintPDF } from '@/utils/hooks/use-print-pdf';
import { fetchImageAsBase64 } from '@/utils/image';
import { useEffect, useState } from 'react'
import { IoMdPrint } from 'react-icons/io';
import apiRequest from '@/utils/lib/api-request/request';
import { CashMovementResponse } from '@/@types/cash-register';
import { CustomDisbursementPDF } from '@/components/pdf/custom-disbursements';
import { printPDFDirect } from '@/utils/print-pdf-direct';

type PrintDisbursementProps = {
  disbursementId: string;
  cashRegisterId: string;
  disbursementData?: CashMovementResponse | null;
  children?: (props: { loading: boolean; onPrint: () => void }) => React.ReactNode;
}


export type PrintCustomDisbursementParams = {
  disbursementId: string;
  cashRegisterId: string;
  setting: any;
  disbursementData?: CashMovementResponse | null;
};

export async function printCustomDisbursement(params: PrintCustomDisbursementParams) {
  const { setting, disbursementId, cashRegisterId, disbursementData } = params;

  if (!setting) {
    openNotification("error", "No se encontró la configuración de la empresa para imprimir.");
    return null;
  }

  const disbursement = disbursementData
    ? disbursementData
    : await fetchDisbursement(cashRegisterId, disbursementId);

  if (!disbursement) {
    openNotification("error", "No se encontró el desembolso para imprimir.");
    return null;
  }

  let blobLogo = null;
  if (setting.logo) {
    blobLogo = await fetchImageAsBase64(setting.logo);
  }

  const companyInfo = {
    companyName: setting.companyName,
    phone: disbursement.cashRegister.cashBox.branch.phone || setting.phone,
    address: disbursement.cashRegister.cashBox.branch.address || setting.address,
    email: setting.email,
    rnc: setting.rnc,
  };

  await printPDFDirect(
    <CustomDisbursementPDF
      disbursement={disbursement}
      companyInfo={companyInfo}
      logo={blobLogo}
    />,
    { cleanUpMilliseconds: 600000 }
  );

  return true;
}

async function fetchDisbursement(
  cashRegisterId: string,
  disbursementId: string
): Promise<CashMovementResponse | null> {
  const resp = await apiRequest.get<CashMovementResponse>(
    `/cash-register/${cashRegisterId}/cash-movements/${disbursementId}`
  );

  if (resp.success && resp.data) return resp.data;

  openNotification("error", resp.message || "Error al obtener los datos del desembolso");
  return null;
}

export default function PrintCustomDisbursement({ disbursementId, cashRegisterId, disbursementData, children }: PrintDisbursementProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const { setting, loading: loadingSettings } = useFetchSetting();
  // const { printPDF } = usePrintPDF();


  const onPrint = () => {
    handlePrintPDF(setting);
  };

  const handlePrintPDF = async (setting: any) => {
    await printCustomDisbursement({ disbursementId, cashRegisterId, setting, disbursementData });
    // if (!setting) return openNotification('error', 'No se encontró la configuración de la empresa para imprimir.');
    // const disbursement = await getDisbursementData();
    // if (!disbursement) return openNotification('error', 'No se encontró el desembolso para imprimir.');

    // let blobLogo = null;
    // if (setting.logo) {
    //   blobLogo = await fetchImageAsBase64(setting.logo);
    // }

    // await printPDF(
    //   <CustomDisbursementPDF disbursement={disbursement} companyInfo={{ ...setting }} logo={blobLogo} />, { cleanUpMilliseconds: 600000 }
    // );
  };

  const getDisbursementData = async (): Promise<CashMovementResponse | null> => {
    if (disbursementData) { return disbursementData; }
    setLoading(true);
    const resp = await apiRequest.get<CashMovementResponse>(`/cash-register/${cashRegisterId}/cash-movements/${disbursementId}`);
    if (resp.success && resp.data) {
      // Handle successful response
      const data = resp.data;
      return data;
    } else {
      openNotification('error', resp.message || 'Error al obtener los datos del desembolso');
    }
    setLoading(false);
    return null;
  }

  useEffect(() => {
    setLoading(loadingSettings);
  }, [loadingSettings]);


  return (
    <>
      {children ? (
        <div onClick={onPrint} className='cursor-pointer'>
          {children && children({ loading, onPrint })}
        </div>
     ) : (
        <Button
          onClick={onPrint}
          loading={loading}
          icon={<IoMdPrint className='text-lg ' />}
        >

          {loading ? 'Generando documento ...' : 'Imprimir'}
        </Button>
     )}
    </>
  )
}
