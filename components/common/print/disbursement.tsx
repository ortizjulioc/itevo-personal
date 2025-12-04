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
    courseBranch: {
      id: string;
      branch: {
        id: string;
        name: string;
        address: string;
        phone: string;
        email: string;
      };
    };
  };
}


export default function PrintDisbursement({ paymentId, payableId, children }: PrintDisbursementProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const { setting, loading: loadingSettings } = useFetchSetting();
  const { printPDF } = usePrintPDF();


  const onPrint = () => {
    handlePrintPDF(setting);
  };

  const handlePrintPDF = async (setting: any) => {
    setLoading(true);
    if (!setting) return openNotification('error', 'No se encontró la configuración de la empresa para imprimir.');
    const disbursement = await getDisbursementData();
    if (!disbursement) return openNotification('error', 'No se encontró el desembolso para imprimir.');

    let blobLogo = null;
    if (setting.logo) {
      blobLogo = await fetchImageAsBase64(setting.logo);
    }

    const companyInfo = {
      companyName: setting.companyName,
      rnc: setting.rnc,
      address: disbursement.accountPayable.courseBranch.branch.address || setting.address,
      email: disbursement.accountPayable.courseBranch.branch.email || setting.email,
      phone: disbursement.accountPayable.courseBranch.branch.phone || setting.phone,
    };

    await printPDF(
      <DisbursementPDF disbursement={disbursement} companyInfo={companyInfo} logo={blobLogo} />, { cleanUpMilliseconds: 600000 }
    );
    setLoading(false);
  };

  const getDisbursementData = async (): Promise<DisbursementData | null> => {
    setLoading(true);
    const resp = await apiRequest.get<PayablePaymentWithRelations>(`/account-payable/${payableId}/payments/${paymentId}`);
    console.log({ resp });
    setLoading(false);
    if (resp.success && resp.data) {
      // Handle successful response
      const data = resp.data;
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
          courseBranch: {
            id: data.accountPayable.courseBranch.id,
            branch: {
              id: data.accountPayable.courseBranch.branch.id,
              name: data.accountPayable.courseBranch.branch.name,
              address: data.accountPayable.courseBranch.branch.address,
              phone: data.accountPayable.courseBranch.branch.phone || '',
              email: data.accountPayable.courseBranch.branch.email || '',
            },
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
