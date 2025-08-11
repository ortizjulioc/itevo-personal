'use client'
import useFetchSetting from '@/app/(defaults)/settings/lib/use-fetch-settings';
import { Button } from '@/components/ui';
import { formatCurrency, openNotification } from '@/utils';
import { usePrintPDF } from '@/utils/hooks/use-print-pdf';
import { fetchImageAsBase64 } from '@/utils/image';
import { useEffect, useState } from 'react'
import { IoMdPrint } from 'react-icons/io';
import apiRequest from '@/utils/lib/api-request/request';
import { PayablePaymentWithRelations } from '@/@types/accounts-payables';
import { DisbursementPDF } from '@/components/pdf/disbursements';
import { getFormattedDateTime } from '@/utils/date';

type PrintDisbursementProps = {
  paymentId: string;
  payableId?: string;
  children?: (props: { loading: boolean; onPrint: () => void }) => React.ReactNode;
}

type DisbursementData = {
  id: string;
  amount: string;
  date: string;
  description: string;
  user: {
    name: string;
    lastName: string;
  };
  accountPayable: {
    teacher: {
      name: string;
      lastName: string;
    };
  };
}


export default function PrintDisbursement({ paymentId, payableId, children }: PrintDisbursementProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const { setting, loading: loadingSettings } = useFetchSetting();
  const { printPDF } = usePrintPDF();
  console.log('setting', setting);

  const onPrint = () => {
    handlePrintPDF(setting);
  };

  const handlePrintPDF = async (setting: any) => {
    if (!setting) return openNotification('error', 'No se encontró la configuración de la empresa para imprimir.');
    const disbursement = await getDisbursementData();
    if (!disbursement) return openNotification('error', 'No se encontró el desembolso para imprimir.');

    let blobLogo = null;
    if (setting.logo) {
      blobLogo = await fetchImageAsBase64(setting.logo);
    }

    await printPDF(
      <DisbursementPDF disbursement={disbursement} companyInfo={{ ...setting }} logo={blobLogo} />, { cleanUpMilliseconds: 600000 }
    );
  };

  const getDisbursementData = async (): Promise<DisbursementData | null> => {
    setLoading(true);
    const resp = await apiRequest.get<PayablePaymentWithRelations>(`/account-payable/${payableId}/payments/${paymentId}`);
    console.log('resp', resp);
    if (resp.success && resp.data) {
      // Handle successful response
      const data = resp.data;
      console.log('Resp.data:', data);
      setLoading(false);
      return {
        id: data.id,
        amount: formatCurrency((data.amount)),
        date: getFormattedDateTime(new Date(data.paymentDate), { hour12: true }),
        description: data.cashMovement?.description || `Pago de cuenta por pagar al profesor ${data.accountPayable.teacher.firstName} ${data.accountPayable.teacher.lastName}`,
        user: {
            name: data.cashMovement.user.name,
            lastName: data.cashMovement.user.lastName,
        },
        accountPayable: {
            teacher: {
                name: data.accountPayable.teacher.firstName,
                lastName: data.accountPayable.teacher.lastName,
            },
        },
      };
    } else {
      openNotification('error', resp.message || 'Error al obtener los datos del desembolso');
    }
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
