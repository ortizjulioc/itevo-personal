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
import { getFormattedDate } from '@/utils/date';
import { IoMdPrint } from 'react-icons/io';
import PrintDisbursement from '@/components/common/print/disbursement';
import useFetchSetting from '@/app/(defaults)/settings/lib/use-fetch-settings';
import { AccountPayableWithRelations } from '@/@types/accounts-payables';

interface PayableEarning {
    id: string;
    date: string;
    amount: number;
}

interface PayablePayment {
    id: string;
    paymentDate: string;
    amount: number;
    accountPayableId: string;
}

export interface EarningsResponse {
    earnings: PayableEarning[];
}

export interface PaymentsResponse {
    payments: PayablePayment[];
}

// ----------------------
// Sub-Components
// ----------------------

const SummaryDashboard = ({ accounts }: { accounts: AccountPayableWithRelations[] }) => {
    const totalAmount = accounts.reduce((sum, item) => sum + item.amount, 0);
    const totalDisbursed = accounts.reduce((sum, item) => sum + item.amountDisbursed, 0);
    const totalPending = totalAmount - totalDisbursed;

    const summaryCards = [
        {
            title: 'Total Adeudado Global',
            amount: totalAmount,
            colorClass: 'text-primary dark:text-primary-light',
            bgClass: 'bg-primary/10',
        },
        {
            title: 'Total Desembolsado Global',
            amount: totalDisbursed,
            colorClass: 'text-success',
            bgClass: 'bg-success/10',
        },
        {
            title: 'Balance Pendiente Global',
            amount: totalPending,
            colorClass: 'text-danger',
            bgClass: 'bg-danger/10',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8 px-5">
            {summaryCards.map((card, idx) => (
                <div key={idx} className={`rounded-xl p-5 ${card.bgClass} flex flex-col items-center justify-center text-center shadow-sm`}>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{card.title}</p>
                    <p className={`text-3xl font-bold mt-2 ${card.colorClass}`}>{formatCurrency(card.amount)}</p>
                </div>
            ))}
        </div>
    );
};

// ----------------------
// Main Page Component
// ----------------------

export default function TeacherPayments() {
    const { id: cashRegisterId, teacherid } = useParams();
    const teacherId = (Array.isArray(teacherid) ? teacherid[0] : teacherid) ?? '';
    const { accountsPayable, loading, fetchAccountsPayableData } = useFetchAccountsPayable(`teacherId=${teacherId}&top=1000`);
    const { setting } = useFetchSetting();
    const [loadingPayment, setLoadingPayment] = useState(false)
    const [earningsMap, setEarningsMap] = useState<Record<string, PayableEarning[]>>({});
    const [paymentsMap, setPaymentsMap] = useState<Record<string, PayablePayment[]>>({});
    const [activeTabMap, setActiveTabMap] = useState<Record<string, 'earnings' | 'payments' | null>>({});

    const toggleTab = (id: string, tab: 'earnings' | 'payments') => {
        setActiveTabMap(prev => ({
            ...prev,
            [id]: prev[id] === tab ? null : tab
        }));
    };


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


    const handlePayAccount = async (id: string, amount: number) => {
        const data = {
            amount,
            cashRegisterId,
            description: 'Desembolso a profesor',
        }
        try {
            setLoadingPayment(true)

            const resp = await PayAccount(id, data)
            if (resp.success) {
                openNotification('success', 'Desembolso exitoso')
                fetchAccountsPayableData(`teacherId=${teacherId}`)
            }

        } catch (error) {
            console.log(error)
            openNotification('error', 'Ocurrió un error al desembolsar')
        } finally {
            setLoadingPayment(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-transparent pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-6 gap-4">
                <TeacherLabel
                    teacherId={teacherId}
                    className="text-2xl font-bold"
                />
            </div>

            {loading ? (
                <div className="px-5">
                    <GenericSkeleton lines={10} />
                </div>
            ) : accountsPayable && accountsPayable.length > 0 ? (
                <>
                    <SummaryDashboard accounts={accountsPayable} />

                    <div className="px-5 space-y-6">
                        {accountsPayable.map((item) => {
                            const paidAmount = item.amountDisbursed;
                            const pendingAmount = item.amount - item.amountDisbursed;
                            const earnings = earningsMap[item.id] || [];
                            const payments = paymentsMap[item.id] || [];
                            const isPaid = item.amount === item.amountDisbursed;
                            const progressPercentage = item.amount > 0 ? (paidAmount / item.amount) * 100 : 0;
                            const inputId = `amount-${item.id}`;
                            const activeTab = activeTabMap[item.id];

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-[#1E1E2D] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md"
                                >
                                    {/* Cabecera */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                            <CourseBranchLabel CourseBranchId={item.courseBranchId} showTeacher={false} />
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isPaid ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                                            {isPaid ? 'Completado' : 'Pendiente'}
                                        </span>
                                    </div>

                                    {/* Barra de Progreso */}
                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
                                            <span>Progreso de Pagos</span>
                                            <span>{progressPercentage.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                            <div
                                                className={`h-2.5 rounded-full ${progressPercentage === 100 ? 'bg-success' : 'bg-primary'}`}
                                                style={{ width: `${progressPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Métricas Internas */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Total a Pagar</p>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(item.amount)}</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                                            <p className="text-xs text-success uppercase font-semibold">Total Desembolsado</p>
                                            <p className="text-xl font-bold text-success mt-1">{formatCurrency(paidAmount)}</p>
                                        </div>
                                        <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl">
                                            <p className="text-xs text-orange-600 dark:text-orange-400 uppercase font-semibold">Pendiente</p>
                                            <p className="text-xl font-bold text-orange-600 dark:text-orange-400 mt-1">{formatCurrency(pendingAmount)}</p>
                                        </div>
                                    </div>

                                    {/* Acción Desembolsar */}
                                    {!isPaid && (
                                        <div className="flex flex-col sm:flex-row  gap-3 items-center justify-end p-4 bg-primary/5 dark:bg-primary/10 rounded-xl mb-6 border border-primary/20 dark:border-primary/20">
                                            <div className="text-sm font-semibold text-primary mr-auto self-start sm:self-center">
                                                Registrar Desembolso
                                            </div>
                                            <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center w-full sm:w-auto">
                                                <Button
                                                    size="sm"
                                                    color="info"
                                                    variant="outline"
                                                    className="w-full sm:w-auto"
                                                    onClick={() => {
                                                        const inputEl = document.getElementById(inputId) as HTMLInputElement;
                                                        if (inputEl) inputEl.value = pendingAmount.toString();
                                                    }}
                                                >
                                                    Pagar Totalidad
                                                </Button>
                                                <div className="relative w-full sm:w-32">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                                    <Input
                                                        id={inputId}
                                                        type="number"
                                                        placeholder="0.00"
                                                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                                        defaultValue={pendingAmount === 0 ? '' : pendingAmount}
                                                        max={pendingAmount}
                                                        min={0}
                                                        step="0.01"
                                                        className="w-full pl-7 bg-white dark:bg-gray-900"
                                                        disabled={loadingPayment}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value);
                                                            if (value > pendingAmount) {
                                                                e.target.value = pendingAmount.toString();
                                                                openNotification('warning', `El monto máximo a pagar es ${pendingAmount.toFixed(2)}`);
                                                            }
                                                            if (value < 0) e.target.value = '';
                                                        }}
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    className="w-full sm:w-auto min-w-[120px]"
                                                    loading={loadingPayment}
                                                    disabled={loadingPayment}
                                                    onClick={() => {
                                                        const inputEl = document.getElementById(inputId) as HTMLInputElement;
                                                        const value = parseFloat(inputEl?.value || '0');
                                                        if (value > 0 && value <= pendingAmount) {
                                                            handlePayAccount(item.id, value);
                                                        } else {
                                                            openNotification('warning', 'Por favor, ingrese un monto válido mayor a 0 y menor o igual al pendiente.');
                                                        }
                                                    }}
                                                >
                                                    Desembolsar
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Historial Tabs */}
                                    <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                                        <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                                            <button
                                                onClick={() => toggleTab(item.id, 'earnings')}
                                                className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'earnings' ? 'bg-white dark:bg-[#1E1E2D] text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                            >
                                                Ver Ganancias ({earnings.length})
                                            </button>
                                            <button
                                                onClick={() => toggleTab(item.id, 'payments')}
                                                className={`flex-1 py-3 text-sm font-semibold transition-colors border-l border-gray-100 dark:border-gray-800 ${activeTab === 'payments' ? 'bg-white dark:bg-[#1E1E2D] text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                            >
                                                Ver Desembolsos ({payments.length})
                                            </button>
                                        </div>

                                        {/* Tab Content: Earnings */}
                                        {activeTab === 'earnings' && (
                                            <div className="p-4 bg-white dark:bg-[#1E1E2D]">
                                                {earnings.length > 0 ? (
                                                    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                                                        {earnings.map((earning) => (
                                                            <li key={earning.id} className="flex justify-between py-3 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 px-3 rounded-lg transition-colors">
                                                                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{getFormattedDate(new Date(earning.date))}</span>
                                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(earning.amount)}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="text-center py-6 text-sm text-gray-400 italic">No hay ganancias registradas</div>
                                                )}
                                            </div>
                                        )}

                                        {/* Tab Content: Payments */}
                                        {activeTab === 'payments' && (
                                            <div className="p-4 bg-white dark:bg-[#1E1E2D]">
                                                {payments.length > 0 ? (
                                                    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                                                        {payments.map((payment) => (
                                                            <li key={payment.id} className="flex justify-between py-3 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 px-3 rounded-lg transition-colors">
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{getFormattedDate(new Date(payment.paymentDate))}</span>
                                                                    <span className="text-xs text-gray-400">ID: {payment.id.split('-')[0]}...</span>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <span className="text-sm font-bold text-success">{formatCurrency(payment.amount)}</span>
                                                                    <PrintDisbursement
                                                                        paymentId={payment.id}
                                                                        payableId={item.id}
                                                                        setting={setting}
                                                                    >
                                                                        {({ loading }) => (
                                                                            <Button
                                                                                loading={loading}
                                                                                type="button"
                                                                                size='sm'
                                                                                color="primary"
                                                                                variant="outline"
                                                                                icon={<IoMdPrint className='text-lg ' />}
                                                                                className="px-2"
                                                                            />
                                                                        )}
                                                                    </PrintDisbursement>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="text-center py-6 text-sm text-gray-400 italic">No hay desembolsos registrados</div>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="px-5 mt-10">
                    <div className="bg-white dark:bg-[#1E1E2D] rounded-2xl p-10 text-center border border-gray-100 dark:border-gray-800">
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No hay cuentas por pagar registradas para este profesor.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
