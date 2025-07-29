'use client';
import useFetchAccountsPayable from '@/app/(defaults)/invoices/lib/accounts-payable/use-fetch-accounts-payable';
import CourseBranchLabel from '@/components/common/info-labels/course-branch-label';
import TeacherLabel from '@/components/common/info-labels/teacher-label';
import { GenericSkeleton } from '@/components/common/Skeleton';
import { formatCurrency, openNotification } from '@/utils';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import apiRequest from '@/utils/lib/api-request/request';
import { Button, Input } from '@/components/ui';
import { PayAccount } from '@/app/(defaults)/invoices/lib/accounts-payable/request';

interface PayableEarning {
    id: string;
    date: string;
    amount: number;
}

interface PayablePayment {
    id: string;
    paymentDate: string;
    amount: number;
}
export interface EarningsResponse {
    earnings: PayableEarning[];
}
export interface PaymentsResponse {
    payments: PayablePayment[];
}


export default function TeacherPayments() {
    const { id: cashRegisterId, teacherid } = useParams();
    const teacherId = Array.isArray(teacherid) ? teacherid[0] : teacherid;
    const { accountsPayable, loading, fetchAccountsPayableData} = useFetchAccountsPayable(`teacherId=${teacherid}`);
    const [loadingPayment, setLoadingPayment] = useState(false)

    const [earningsMap, setEarningsMap] = useState<Record<string, PayableEarning[]>>({});
    const [paymentsMap, setPaymentsMap] = useState<Record<string, PayablePayment[]>>({});

    useEffect(() => {
        const fetchAllEarningsAndPayments = async () => {
            if (!accountsPayable) return;

            const newEarningsMap: Record<string, PayableEarning[]> = {};
            const newPaymentsMap: Record<string, PayablePayment[]> = {};

            for (const account of accountsPayable) {
                try {
                    const earningsResp = await apiRequest.get<EarningsResponse>(`/account-payable/${account.id}/earnings`);
                    const paymentsResp = await apiRequest.get<PaymentsResponse>(`/account-payable/${account.id}/payments`);

                    newEarningsMap[account.id] =
                        earningsResp.success && earningsResp.data ? earningsResp.data.earnings : [];

                    newPaymentsMap[account.id] =
                        paymentsResp.success && paymentsResp.data ? paymentsResp.data.payments : [];
                } catch (error) {
                    console.error('Error al cargar earnings o payments:', error);
                    newEarningsMap[account.id] = [];
                    newPaymentsMap[account.id] = [];
                }
            }

            setEarningsMap(newEarningsMap);
            setPaymentsMap(newPaymentsMap);
        };

        fetchAllEarningsAndPayments();
    }, [accountsPayable]);


    const handlepayAccount = async (id: string, amount: number) => {
        const data = {
            amount,
            cashRegisterId
        }
        try {
            setLoadingPayment(true)

            const resp = await PayAccount(id, data)

            if (resp.success) {
                openNotification('success', 'Desembolso exitoso')
                const teacherId = Array.isArray(teacherid) ? teacherid[0] : teacherid;
                fetchAccountsPayableData(`teacherId=${teacherId}`)

            }

        } catch (error) {
            console.log(error)
            openNotification('error', 'Ocurrio un error al desembolsar')
        } finally {
            setLoadingPayment(false);
        }
    }

    function getInvoiceSummary(invoices: any[]) {
    const summary = {
        total: 0,
        efectivo: 0,
        tarjeta: 0,
        transferencia: 0,
        cheque: 0,
        credito: 0,
    };

    invoices.forEach((invoice) => {
        const method = invoice.paymentMethod;

        const amount = invoice.subtotal + invoice.itbis;
        summary.total += amount;

        switch (method) {
            case 'cash':
                summary.efectivo += amount;
                break;
            case 'credit_card':
                summary.tarjeta += amount;
                break;
            case 'bank_transfer':
                summary.transferencia += amount;
                break;
            case 'check':
                summary.cheque += amount;
                break;
            default:
                summary.credito += amount;
                break;
        }
    });

    return summary;
}




    return (
        <div>
            <TeacherLabel
                teacherId={teacherId}
                className="text-2xl font-bold ml-5 mb-5"
            />

            <div className="px-5">
                {loading && <GenericSkeleton lines={10} />}

                {!loading && accountsPayable && accountsPayable.map((item) => {
                    const paidAmount = item.amountDisbursed;
                    const pendingAmount = item.amount - item.amountDisbursed;

                    const earnings = earningsMap[item.id] || [];
                    const payments = paymentsMap[item.id] || [];
                    const isPaid = item.amount === item.amountDisbursed;
                    const inputId = `amount-${item.id}`;
                    console.log(isPaid)

                    return (
                        <div
                            key={item.id}
                            className="mb-5 w-full rounded-md border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-[#1E1E2D]"
                        >
                            {/* Nombre del curso */}
                            <div className="mb-4 text-sm font-semibold text-gray-800 dark:text-white">
                                <CourseBranchLabel CourseBranchId={item.courseBranchId} showTeacher={false} />
                            </div>

                            {/* Totales */}
                            <div className="flex flex-wrap justify-between gap-6 mt-5">
                                <div className="flex items-center gap-2">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-red-500" />
                                    <div>
                                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(item.amount)}
                                        </div>
                                        <div className="text-sm text-gray-500">Total</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                                    <div>
                                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(paidAmount)}
                                        </div>
                                        <div className="text-sm text-gray-500">Total Abonado</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                                    <div>
                                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(pendingAmount)}
                                        </div>
                                        <div className="text-sm text-gray-500">Pendiente de pago</div>
                                    </div>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                {/* Lista de Aplicaciones */}
                                {earnings.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="mb-2 text-sm font-bold ">Ganancias</h4>
                                        <ul className="space-y-1 text-sm text-gray-800 dark:text-gray-100">
                                            {earnings.map((earning) => (
                                                <li
                                                    key={earning.id}
                                                    className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-1"
                                                >
                                                    <span>{new Date(earning.date).toLocaleDateString('es-DO')}</span>
                                                    <span>{formatCurrency(earning.amount)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Lista de Desembolsos */}
                                {payments.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="mb-2 text-sm font-bold">Desembolsos</h4>
                                        <ul className="space-y-1 text-sm text-gray-800 dark:text-gray-100">
                                            {payments.map((payment) => (
                                                <li
                                                    key={payment.id}
                                                    className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-1"
                                                >
                                                    <span>{new Date(payment.paymentDate).toLocaleDateString('es-DO')}</span>
                                                    <span>{formatCurrency(payment.amount)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                            </div>
                            <div className="mt-6 flex justify-end items-center gap-4 flex-nowrap">
                                <Input
                                    id={inputId}
                                    type="number"
                                    defaultValue={pendingAmount}
                                    max={pendingAmount}
                                    min={0}
                                    step="0.01"
                                    className="w-32"
                                    disabled={loadingPayment || isPaid}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (value > pendingAmount) {
                                            e.target.value = pendingAmount.toString();
                                            openNotification('warning', `El monto máximo a pagar es ${pendingAmount.toFixed(2)}`);
                                        }
                                        if (value < 0) e.target.value = '0';
                                    }}
                                />

                                <Button
                                    type="button"
                                   
                                    className="min-w-[100px]"
                                    loading={loadingPayment}
                                    disabled={loadingPayment || isPaid}
                                    onClick={() => {
                                        const inputEl = document.getElementById(inputId) as HTMLInputElement;
                                        const value = parseFloat(inputEl?.value || '0');
                                        if (value > 0 && value <= pendingAmount) {
                                            handlepayAccount(item.id, value);
                                        } else {
                                            alert('Por favor, ingrese un monto válido.');
                                        }
                                    }}
                                >
                                    {isPaid ? 'Pagado' : 'Agregar'}
                                </Button>
                            </div>


                        </div>
                    );
                })}
            </div>
        </div>
    );
}