'use client'
import useFetchCourseBranchRulesById from '@/app/(defaults)/course-branch/lib/use-fetch-rules';
import { useFetchEnrollmentById } from '@/app/(defaults)/enrollments/lib/use-fetch-enrollments';
import useFetchSetting from '@/app/(defaults)/settings/lib/use-fetch-settings';
import { EnrollmentPDF } from '@/components/pdf/enrollment';
import { Button } from '@/components/ui';
import { openNotification } from '@/utils';
import { usePrintPDF } from '@/utils/hooks/use-print-pdf';
import { fetchImageAsBase64 } from '@/utils/image';
import { useEffect, useState } from 'react'
import { IoMdPrint } from 'react-icons/io';

type PrintEnrollmentProps = {
  enrollmentId: string;
  children?: React.ReactNode
}
export default function PrintEnrollment({ enrollmentId, children }: PrintEnrollmentProps) {
  const { enrollment, loading: loadingEnrollment } = useFetchEnrollmentById(enrollmentId);
  const { setting, loading: loadingSettings } = useFetchSetting();
  const { courseBranchRule } = useFetchCourseBranchRulesById(enrollment?.courseBranchId || '');
  const [loading, setLoading] = useState<boolean>(true);
  const { printPDF } = usePrintPDF();

  const onPrint = () => {
    if (!enrollment) {
      openNotification('error','No se encontró la inscripción para imprimir.');
      return;
    }
    if (!setting) {
      openNotification('error','No se encontró la configuración de la empresa para imprimir.');
      return;
    }
    handlePrintPDF(enrollment, setting);
  };

  const handlePrintPDF = async (enrollment: any, setting: any) => {
    if (!enrollment) return openNotification('error', 'No se encontró la inscripción para imprimir.');
    if (!setting) return openNotification('error', 'No se encontró la configuración de la empresa para imprimir.');

    let blobLogo = null;
    if (setting.logo) {
      blobLogo = await fetchImageAsBase64(setting.logo);
    }

    await printPDF(
      <EnrollmentPDF
        enrollment={enrollment}
        companyInfo={{ ...setting, logo: blobLogo }}
        rules={courseBranchRule?.rules || setting.rules || []}
      />,
      { cleanUpMilliseconds: 600000 }
    );
  };

  useEffect(() => {
    setLoading(loadingEnrollment || loadingSettings);
  }, [loadingEnrollment, loadingSettings]);


  return (
    <>
      {children ? (
        <div onClick={onPrint} className='cursor-pointer'>
          {children}
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
