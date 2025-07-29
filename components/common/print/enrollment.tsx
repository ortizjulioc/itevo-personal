'use client'
import { useFetchEnrollmentById } from '@/app/(defaults)/enrollments/lib/use-fetch-enrollments';
import useFetchSetting from '@/app/(defaults)/settings/lib/use-fetch-settings';
import { EnrollmentPDF } from '@/components/pdf/enrollment';
import { Button } from '@/components/ui';
import { fetchImageAsBase64 } from '@/utils/image';
import { pdf, PDFViewer } from '@react-pdf/renderer';
import { useEffect, useState } from 'react'
import { IoMdPrint } from 'react-icons/io';

type PrintEnrollmentProps = {
  enrollmentId: string;
}
export default function PrintEnrollment({ enrollmentId }: PrintEnrollmentProps) {
  const { enrollment, loading: loadingEnrollment } = useFetchEnrollmentById(enrollmentId);
  const { setting, loading: loadingSettings } = useFetchSetting();
  const [loading, setLoading] = useState<boolean>(true);
  console.log('PrintEnrollment', { enrollment, setting });

  const onPrint = () => {
    if (!enrollment) {
      alert('No se encontró la inscripción para imprimir.');
      return;
    }
    if (!setting) {
      alert('No se encontró la configuración de la empresa para imprimir.');
      return;
    }
    handlePrintPDF(enrollment, setting);
  }

  const handlePrintPDF = async (enrollment: any, setting: any) => {
    try {
      let blobLogo = null;
      console.log('handlePrintPDF', { enrollment, setting });
      if (setting?.logo) {
        blobLogo = await fetchImageAsBase64(setting.logo);
      }

      console.log('handlePrintPDF', { enrollment, companyInfo: {...setting, logo: blobLogo} });
      const blob = await pdf(<EnrollmentPDF enrollment={enrollment} companyInfo={{...setting, logo: blobLogo}} />).toBlob();
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
            }, 30000);
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
    }
  };

  useEffect(() => {
    setLoading(loadingEnrollment || loadingSettings);
  }, [loadingEnrollment, loadingSettings]);


  return (
    <>
      <Button
        onClick={onPrint}
        loading={loading}
        icon={<IoMdPrint className='text-lg ' />}
        >

        {loading ? 'Generando documento ...' : 'Imprimir'}
      </Button>


      {/* {!loading && enrollment && setting && (
        <PDFViewer width="100%" height="600">
          <EnrollmentPDF enrollment={enrollment} companyInfo={{...setting, logo: null}} />
        </PDFViewer>
      )} */}
    </>
  )
}
