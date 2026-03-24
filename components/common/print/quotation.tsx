'use client'

import React, { useEffect } from 'react';
import useFetchSetting from '@/app/(defaults)/settings/lib/use-fetch-settings';
import { QuotationPDF } from '@/components/pdf/quotation';
import { Button } from '@/components/ui';
import { fetchImageAsBase64 } from '@/utils/image';
import { pdf } from '@react-pdf/renderer';
import { IoMdPrint } from 'react-icons/io';
import apiRequest from '@/utils/lib/api-request/request';

export default function PrintQuotation({ quotation }: { quotation: any }) {
  const { setting, loading: loadingSettings } = useFetchSetting();
  const [loading, setLoading] = React.useState<boolean>(false);

  const onPrint = () => {
    if (!quotation) {
      alert('No se encontró la cotización para imprimir.');
      return;
    }
    if (!setting) {
      alert('No se encontró la configuración de la empresa para imprimir.');
      return;
    }
    handlePrintPDF(quotation);
  }

  const handlePrintPDF = async (quote: any) => {
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

      const blob = await pdf(<QuotationPDF quotation={quote} companyInfo={companyInfo} logo={blobLogo} />).toBlob();
      const blobUrl = URL.createObjectURL(blob);

      const isKioskMode = navigator.userAgent.includes('Chrome') && window.location.search.includes('kiosk-printing');
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      iframe.src = blobUrl;

      iframe.onload = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();

          // Cambiar estado de la cotización
          apiRequest.put(`quotations/${quote.id}`, { status: 'ACCEPTED' })
            .catch(err => console.error('Error auto-updating status:', err));

          const cleanup = () => {
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
            }
            URL.revokeObjectURL(blobUrl);
          };

          if (isKioskMode) {
            setTimeout(cleanup, 1000);
          } else {
            window.addEventListener('afterprint', cleanup, { once: true });
            setTimeout(cleanup, 3 * 60 * 1000);
          }
        } catch (error) {
          console.error(error);
          alert('Error al imprimir el PDF.');
        }
      };
    } catch (error) {
      console.error(error);
      alert('Error al generar el PDF.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(loadingSettings);
  }, [loadingSettings]);

  return (
    <Button
      onClick={onPrint}
      loading={loading}
      icon={<IoMdPrint className='text-lg' />}
      color="success"
    >
      {loading ? 'Generando...' : 'Imprimir'}
    </Button>
  )
}
