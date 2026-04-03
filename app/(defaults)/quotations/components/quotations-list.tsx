'use client';
import { formatCurrency, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import Skeleton from "@/components/common/Skeleton";
import useFetchQuotations from "../lib/use-fetch-quotations";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import QuotationStatusField from "./quotation-status";
import { getFormattedDateTime } from "@/utils/date";
import OptionalInfo from "@/components/common/optional-info";

import { QuotationStatus } from "@/generated/prisma/client";
import type { QuotationWithItems } from "@/services/quotation-service";

interface Props {
    className?: string;
    query?: string;
}

export default function QuotationList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, quotations, totalQuotations } = useFetchQuotations(query);
    if (error) {
        openNotification('error', error);
    }

    if (loading) return <Skeleton rows={7} columns={['NO. DE COTIZACIÓN', 'ESTUDIANTE', 'CONCEPTO', 'TOTAL', 'FECHA DE CREACIÓN', 'ESTADO']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th className="text-left">NO. DE COTIZACIÓN</th>
                            <th>ESTUDIANTE</th>
                            <th className="text-left">CONCEPTO</th>
                            <th className="text-left">FECHA DE CREACIÓN</th>
                            <th className="text-left">TOTAL</th>
                            <th className="text-left">ESTADO</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {quotations?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron Cotizaciones registradas</td>
                            </tr>
                        )}
                        {quotations?.map((quotation: QuotationWithItems) => {
                            // Calculate total
                            const total = quotation.items?.reduce((acc: number, item: any) => acc + item.subtotal + item.itbis, 0) || 0;
                            
                            return (
                                <tr key={quotation.id}>
                                    <td className="text-left font-bold">{quotation.quotationNumber}</td>
                                    <td className="text-left"> {quotation.studentId ? <OptionalInfo content={`${quotation.student?.firstName} ${quotation.student?.lastName}`} message="No registrado" /> : <OptionalInfo content='' />}</td>
                                    <td className="text-left italic text-gray-500">{quotation.concept || '--'}</td>
                                    <td className="text-left">{getFormattedDateTime(new Date(quotation.createdAt))}</td>
                                    <td className="text-left font-semibold">{formatCurrency(total)}</td>
                                    <td className="text-left">
                                        <QuotationStatusField status={quotation.status} />
                                    </td>
                                    <td>
                                        <div className="flex justify-end gap-2">
                                            <Tooltip title="detalles">
                                                <Link href={`/quotations/${quotation.id}`}>
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
                    total={totalQuotations}
                    top={Number.parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
}
