'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import IconCaretDown from '../icon/icon-caret-down';
import apiRequest from '@/utils/lib/api-request/request';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { getFormattedDateTime } from '@/utils/date';
import { InvoicePDF } from '../pdf/invoice';
import PrintInvoice from './print/invoice';
import { Button } from '../ui';
interface ViewTitleProps {
    title: string;
    showBackPage?: boolean;
    rightComponent?: React.ReactNode;
    className?: string;
}

const invoiceInicialData = {
    "id": "20ed8694-2689-4fbe-ad3a-e8a0424921ef",
    "invoiceNumber": "255N-0001",
    "ncf": "B0200000002",
    "type": "FACTURA_CONSUMO",
    "studentId": null,
    "cashRegisterId": "d41d6a5c-e69b-467e-9317-e76bc3624f9e",
    "date": "2025-05-23T15:14:33.575Z",
    "subtotal": 14.23728813559322,
    "itbis": 2.562711864406779,
    "paymentDate": "2025-05-23T17:04:27.411Z",
    "paymentMethod": "cash",
    "paymentDetails": {
        "receivedAmount": "200"
    },
    "status": "PAID",
    "createdBy": "c0647356-fbec-4421-96ff-354e2d8b87c0",
    "createdAt": "2025-05-23T15:14:33.575Z",
    "updatedAt": "2025-05-23T17:04:27.414Z",
    "items": [
        {
            "id": "8a238745-976e-48da-b3c6-ff0c0cf24c20",
            "invoiceId": "20ed8694-2689-4fbe-ad3a-e8a0424921ef",
            "type": "PRODUCT",
            "productId": "550e8400-e29b-41d4-a716-446655440005",
            "accountReceivableId": null,
            "quantity": 1,
            "unitPrice": 10,
            "subtotal": 10,
            "itbis": 1.8,
            "createdAt": "2025-05-23T15:15:52.938Z",
            "updatedAt": "2025-05-23T15:15:52.938Z",
            "concept": "Libro de Matemáticas"
        },
        {
            "id": "dbcb1376-36a2-42fd-b4c7-ccc9d29fe252",
            "invoiceId": "20ed8694-2689-4fbe-ad3a-e8a0424921ef",
            "type": "PRODUCT",
            "productId": "550e8400-e29b-41d4-a716-446655440006",
            "accountReceivableId": null,
            "quantity": 1,
            "unitPrice": 5,
            "subtotal": 4.237288135593221,
            "itbis": 0.7627118644067794,
            "createdAt": "2025-05-23T15:16:46.129Z",
            "updatedAt": "2025-05-23T15:16:46.129Z",
            "concept": "Cuaderno"
        }
    ],
    "user": {
        "id": "c0647356-fbec-4421-96ff-354e2d8b87c0",
        "name": "Super",
        "email": "admin@example.com",
        "lastName": "Admin"
    }
};

const ViewTitle: React.FC<ViewTitleProps> = ({ title, showBackPage = false, rightComponent, className = '' }) => {
    const router = useRouter();
    const getEmpresaInfo = async () => {
        const resp = await apiRequest.get<string>(`/settings`);
        console.log(resp);
    };

    // const getInvoiceInfo = async () => {
    //     const resp = await apiRequest.get<string>(`/invoices/20ed8694-2689-4fbe-ad3a-e8a0424921ef`);
    //     console.log('Invoice info: ', resp);
    // }

    // getInvoiceInfo();

    const handleBackClick = () => {
        router.back();
    };

    const getDateForName = () => {
        const [date, time] = new Date().toISOString().split('T');
        return `${date}_${time}`;
    }
    console.log('date', getFormattedDateTime(new Date(invoiceInicialData.date)));

    getEmpresaInfo()

    return (
        <>
            <div className={`flex items-center justify-between flex-wrap gap-4 ${className}`}>
                <h2 className="text-2xl font-semibold flex items-center">
                    {showBackPage && (
                        <button onClick={handleBackClick}>
                            <IconCaretDown className='rotate-90 size-5 cursor-pointer' />
                        </button>
                    )}
                    {title}
                </h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    {rightComponent}
                </div>
            </div>

            {/* <PDFDownloadLink
                document={<InvoicePDF invoice={invoiceInicialData} />}
                fileName={`Factura_${invoiceInicialData.invoiceNumber}_${getDateForName()}.pdf`}
            >
                {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF')}
            </PDFDownloadLink> */}
            {/* <PrintInvoice invoiceId='20ed8694-2689-4fbe-ad3a-e8a0424921ef'>
                {({ loading, onPrint }) => <Button onClick={onPrint} loading={loading}>{loading ? 'Generando factura ....' : 'Imprimir'}</Button>}
            </PrintInvoice> */}
            <PrintInvoice invoiceId='20ed8694-2689-4fbe-ad3a-e8a0424921ef' />
        </>
    );
};

export default ViewTitle;
