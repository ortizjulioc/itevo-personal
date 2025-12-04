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
  courseBranchId: string;
  children?: React.ReactNode
}
export default function PrintEnrollment({ enrollmentId, courseBranchId, children }: PrintEnrollmentProps) {
  const { enrollment, loading: loadingEnrollment } = useFetchEnrollmentById(enrollmentId);
  const { setting, loading: loadingSettings } = useFetchSetting();
  const { courseBranchRule, loading: loadingRules } = useFetchCourseBranchRulesById(courseBranchId);
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
    if (setting.logoReport) {
      blobLogo = await fetchImageAsBase64(setting.logoReport);
    }

    console.log({ enrollment, courseBranchRule });
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
    setLoading(loadingEnrollment || loadingSettings || loadingRules);
  }, [loadingEnrollment, loadingSettings, loadingRules]);


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
