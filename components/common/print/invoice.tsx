'use client'
import { useFetchInvoiceById } from '@/app/(defaults)/bills/lib/use-fetch-invoices';
import useFetchSetting from '@/app/(defaults)/settings/lib/use-fetch-settings';
import { InvoicePDF } from '@/components/pdf/invoice';
import { Button } from '@/components/ui';
import { pdf } from '@react-pdf/renderer';
import React, { useEffect } from 'react'
import { IoMdPrint } from 'react-icons/io';

type PrintInvoiceProps = {
  invoiceId: string;
}
export default function PrintInvoice({ invoiceId }: PrintInvoiceProps) {
  const { invoice, loading: loadingInvoice } = useFetchInvoiceById(invoiceId);
  const { setting, loading: loadingSettings } = useFetchSetting();
  const [loading, setLoading] = React.useState<boolean>(true);

  const onPrint = () => {
    if (!invoice) {
      alert('No se encontró la factura para imprimir.');
      return;
    }
    if (!setting) {
      alert('No se encontró la configuración de la empresa para imprimir.');
      return;
    }
    handlePrintPDF(invoice);
  }

  const handlePrintPDF = async (invoice: any) => {
    try {
      const blob = await pdf(<InvoicePDF invoice={invoice} companyInfo={setting} />).toBlob();
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
    setLoading(loadingInvoice || loadingSettings);
  }, [loadingInvoice, loadingSettings]);

  return (
    <>
      <Button 
        onClick={onPrint} 
        loading={loading}
        icon={<IoMdPrint className='text-lg ' />}
        >

        {loading ? 'Generando factura ...' : 'Imprimir'}
      </Button>
    </>
  )
}
