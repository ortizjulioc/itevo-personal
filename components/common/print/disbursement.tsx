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
  setting?: any;
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


export default function PrintDisbursement({ paymentId, payableId, setting: propSetting, children }: PrintDisbursementProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { printPDF } = usePrintPDF();


  const onPrint = () => {
    handlePrintPDF();
  };

  const handlePrintPDF = async () => {
    setLoading(true);
    let activeSetting = propSetting;
    if (!activeSetting) {
      try {
        const response = await apiRequest.get<any>('/settings');
        if (response.success && response.data?.settings) {
          activeSetting = response.data.settings;
        }
      } catch (error) {
        console.error('Error fetching settings on print:', error);
      }
    }

    if (!activeSetting) {
      setLoading(false);
      return openNotification('error', 'No se encontró la configuración de la empresa para imprimir.');
    }
    const disbursement = await getDisbursementData();
    if (!disbursement) {
      setLoading(false);
      return openNotification('error', 'No se encontró el desembolso para imprimir.');
    }

    let blobLogo = null;
    if (activeSetting.logo) {
      blobLogo = await fetchImageAsBase64(activeSetting.logo);
    }

    const companyInfo = {
      companyName: activeSetting.companyName,
      rnc: activeSetting.rnc,
      address: disbursement.accountPayable.courseBranch.branch.address || activeSetting.address,
      email: disbursement.accountPayable.courseBranch.branch.email || activeSetting.email,
      phone: disbursement.accountPayable.courseBranch.branch.phone || activeSetting.phone,
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
