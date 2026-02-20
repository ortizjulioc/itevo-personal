// src/hooks/use-print-pdf.ts
import { useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { openNotification } from '../open-notification';

type UsePrintPDFOptions = {
  kioskMode?: boolean;
  onAfterPrint?: () => void;
  cleanUpMilliseconds?: number;
};

export function usePrintPDF() {
  const printPDF = useCallback(async (doc: React.ReactElement<any>, options: UsePrintPDFOptions = {}) => {
    try {
      const { kioskMode, onAfterPrint, cleanUpMilliseconds = 30000 } = options;

      const blob = await pdf(doc).toBlob();
      const blobUrl = URL.createObjectURL(blob);
      const isKiosk = kioskMode ?? (
        navigator.userAgent.includes('Chrome') &&
        window.location.search.includes('kiosk-printing')
      );

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        try {
          iframe.contentWindow?.focus();

          const cleanUp = () => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(blobUrl);
            onAfterPrint?.();
          };

          if (isKiosk) {
            iframe.contentWindow?.print();
            setTimeout(cleanUp, 1000);
          } else {
            iframe.contentWindow?.print();
            window.addEventListener('afterprint', cleanUp, { once: true });
            setTimeout(() => {
              if (document.body.contains(iframe)) {
                cleanUp();
              }
            }, cleanUpMilliseconds);
          }
        } catch (error) {
          console.error('Error al imprimir:', error);
          openNotification('error', 'Error al imprimir el PDF. Verifica la configuración de la impresora.');
          document.body.removeChild(iframe);
          URL.revokeObjectURL(blobUrl);
        }
      };

      iframe.onerror = () => {
        openNotification('error', 'Error al cargar el PDF para impresión.');
        document.body.removeChild(iframe);
        URL.revokeObjectURL(blobUrl);
      };
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      openNotification('error', 'Error al generar el PDF. Intenta de nuevo.');
    }
  }, []);

  return { printPDF };
}
