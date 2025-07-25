'use client';
import useFetchAccountsPayable from '@/app/(defaults)/invoices/lib/accounts-payable/use-fetch-accounts-payable';
import CourseBranchLabel from '@/components/common/info-labels/course-branch-label';
import TeacherLabel from '@/components/common/info-labels/teacher-label';
import TableSkeleton, { GenericSkeleton } from '@/components/common/Skeleton';
import { formatCurrency } from '@/utils';
import { useParams } from 'next/navigation';
import React from 'react'

export default function Teacherpayments() {
    const { id, teacherid } = useParams();
    const { accountsPayable, fetchAccountsPayableData, loading } = useFetchAccountsPayable(Array.isArray(teacherid) ? teacherid[0] : teacherid)
    return (
        <div>
            <TeacherLabel 
                teacherId={Array.isArray(teacherid) ? teacherid[0] : teacherid} 
                className="text-2xl font-bold  ml-5 mb-5" />

            <div className="px-5">
                {loading && <GenericSkeleton lines={10} />}

                {!loading &&
                    teacherid &&
                    accountsPayable.map((item) => {
                        const paidAmount = item.amountDisbursed;
                        const pendingAmount = item.amount - item.amountDisbursed;

                        return (
                            <div key={item.id} className="mb-5 w-full rounded-md border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-[#1E1E2D]">
                                {/* Nombre del curso */}
                               

                                {/* Totales */}
                                <div className="flex flex-wrap justify-between gap-6 mt-5">
                                     <div className="mb-4 text-sm font-semibold text-gray-800 dark:text-white">
                                    <CourseBranchLabel CourseBranchId={item.courseBranchId} showTeacher={false} />
                                </div>
                                    {/* Adeudado */}
                                    <div className="flex items-center gap-2">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-red-500" />
                                        <div>
                                            <div className="text-base font-semibold text-gray-900 dark:text-white">{formatCurrency(item.amount)}</div>
                                            <div className="text-sm text-gray-500">Total </div>
                                        </div>
                                    </div>

                                    {/* Abonado */}
                                    <div className="flex items-center gap-2">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                                        <div>
                                            <div className="text-base font-semibold text-gray-900 dark:text-white">{formatCurrency(paidAmount)}</div>
                                            <div className="text-sm text-gray-500">Total Abonado</div>
                                        </div>
                                    </div>

                                    {/* Pendiente */}
                                    <div className="flex items-center gap-2">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                                        <div>
                                            <div className="text-base font-semibold text-gray-900 dark:text-white">{formatCurrency(pendingAmount)}</div>
                                            <div className="text-sm text-gray-500">Pendiente de pago</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
