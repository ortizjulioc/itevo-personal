'use client';
import { formatCurrency, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import Skeleton from "@/components/common/Skeleton";
import useFetchInvoices from "../../lib/use-fetch-invoices";
import { NCF_TYPES } from "@/constants/ncfType.constant";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import InvoiceStatusField from "./invoice-status";
import { getFormattedDateTime } from "@/utils/date";
import OptionalInfo from "@/components/common/optional-info";

interface Props {
    className?: string;
    query?: string;
}

export default function InvoiceList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, invoices, totalInvoices, setInvoices } = useFetchInvoices(query);
    if (error) {
        openNotification('error', error);
    }



    if (loading) return <Skeleton rows={7} columns={['N. DE FACTURA', 'NCF', 'TIPO', 'TOTAL', 'FECHA', 'FECHA DE PAGO', 'TIPO', 'ESTADO']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th className="text-left">N. DE FACTURA</th>
                            <th className="text-left">NCF</th>
                            <th className="text-left">TIPO</th>
                            <th className="text-left">TOTAL</th>
                            <th className="text-left">FECHA</th>
                            <th className="text-left">FECHA DE PAGO</th>
                            <th className="text-left">TIPO</th>
                            <th className="text-left">ESTADO</th>

                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {invoices?.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron Facturas registradas</td>
                            </tr>
                        )}
                        {invoices?.map((invoice) => {
                            return (
                                <tr key={invoice.id}>
                                    <td className="text-left">{invoice.invoiceNumber}</td>
                                    <td className="text-left">
                                        <OptionalInfo content={invoice.ncf.includes('TEMP') ? '' : invoice.ncf} message="No disponible" />
                                    </td>
                                    <td className="text-left">{NCF_TYPES[invoice.type as keyof typeof NCF_TYPES].label}</td>
                                    <td className="text-left font-bold">{formatCurrency(invoice.subtotal + invoice.itbis)}</td>
                                    <td className="text-left">{getFormattedDateTime(new Date(invoice.createdAt))}</td>
                                    <td className="text-left">
                                        <OptionalInfo content={invoice.paymentDate ? getFormattedDateTime(new Date(invoice.paymentDate)) : ''} message="No pagado" />
                                    </td>
                                    <td
                                        className={`text-left font-medium ${invoice.isCredit ? 'text-blue-500' : 'text-green-500'
                                            }`}
                                    >
                                        {invoice.isCredit ? 'Crédito' : 'Contado'}
                                    </td>
                                    <td className="text-left">
                                        <InvoiceStatusField status={invoice.status} />
                                    </td>

                                    <td>
                                        <div className="flex justify-end gap-2">
                                            <Tooltip title="detalles">
                                                <Link href={`/bills/${invoice.id}`}>
                                                    <Button variant="outline" size="sm" icon={<HiOutlinePaperAirplane className="size-4 rotate-90" />} />
                                                </Link>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

            </div>
            <div className="">
                <Pagination
                    currentPage={Number.parseInt(params?.page || '1')}
                    total={totalInvoices}
                    top={Number.parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
