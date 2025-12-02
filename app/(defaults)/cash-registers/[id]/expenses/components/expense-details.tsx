'use client'
import React from 'react'
import { formatCurrency } from '@/utils'
import { getFormattedDateTime } from '@/utils/date'
import PrintExpense from '@/components/common/print/expense'
import { CashMovement } from '../../../lib/use-fetch-cash-movement-by-id'

export default function ExpenseDetails({ cashMovement, actionButton }: { cashMovement: CashMovement, actionButton?: React.ReactNode }) {

    return (
        <>
            <div className="panel">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                    <div className="text-lg md:col-span-8">
                        <h3 className="mb-2 text-xl font-bold">Detalles del Egreso</h3>
                        <p>
                            <strong>Fecha:</strong> {getFormattedDateTime(new Date(cashMovement.createdAt))}
                        </p>
                        <p>
                            <strong>Descripción:</strong> {cashMovement.description}
                        </p>
                        <p>
                            <strong>Monto:</strong> <span className="text-red-600 font-bold">{formatCurrency(cashMovement.amount)}</span>
                        </p>
                        <p>
                            <strong>Tipo:</strong> {cashMovement.type === 'EXPENSE' ? 'Egreso' : 'Ingreso'}
                        </p>
                        <p>
                            <strong>Realizado por:</strong> {cashMovement.user.name} {cashMovement.user.lastName}
                        </p>
                    </div>

                    {cashMovement.PayablePayment && cashMovement.PayablePayment.accountPayable && cashMovement.PayablePayment.accountPayable.teacher && (
                        <div className=" flex flex-col items-end text-lg  md:col-span-4">
                            <h3 className="mb-2 text-xl font-bold">Información del Profesor</h3>
                            <p>
                                <strong>Nombre:</strong> {cashMovement.PayablePayment.accountPayable.teacher.firstName} {cashMovement.PayablePayment.accountPayable.teacher.lastName}
                            </p>
                            <p>
                                <strong>Cédula:</strong> {cashMovement.PayablePayment.accountPayable.teacher.identification}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div className="panel sticky bottom-0 z-10 mt-5 bg-white p-4 shadow-md dark:bg-gray-900">
                <div className="flex justify-end gap-2">
                    {actionButton}
                    <PrintExpense cashMovement={cashMovement} />
                </div>
            </div>
        </>
    );
}
