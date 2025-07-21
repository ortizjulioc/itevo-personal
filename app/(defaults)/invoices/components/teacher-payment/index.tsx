import SelectTeacher from '@/components/common/selects/select-teacher'
import { Button, Input } from '@/components/ui'
import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import useFetchAccountsPayable from '../../lib/accounts-payable/use-fetch-accounts-payable'
import { formatCurrency, openNotification } from '@/utils'
import TeacherLabel from '@/components/common/info-labels/teacher-label'
import apiRequest from "@/utils/lib/api-request/request";
import { AccountPayable } from '@prisma/client'
import { PayAccount } from '../../lib/accounts-payable/request'
import CashRegister from '../../page'
import { useParams } from 'next/navigation'
interface SelectTeacherType {
    value: string
    label: string
}
export default function TeacherPayment({ setOpenModal, openModal }: { setOpenModal: (open: boolean) => void, openModal: boolean }) {
    const { id: cashRegisterId } = useParams()

    const [teacher, setTeacher] = useState('')
    const [loadingPayment, setLoadingPayment] = useState(false)
    const { accountsPayable, fetchAccountsPayableData, loading } = useFetchAccountsPayable('')

    const useFetchpayment = async (id: string) => {
        const data = await fetchAccountsPayableData(`teacherId=${id}`);
        console.log(data)
        return data

    };

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

            }

        } catch (error) {
            console.log(error)
            openNotification('error', 'Ocurrio un error al desembolsar')
        } finally {
            setLoadingPayment(false);
        }
    }



    return (
        <Transition appear show={openModal} as={Fragment}>
            <Dialog as="div" open={openModal} onClose={() => setOpenModal(false)}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0" />
                </Transition.Child>
                <div className="fixed inset-0 z-[999] bg-[black]/60">
                    <div className="flex min-h-screen items-start justify-center px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="panel w-screen max-w-5xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold">Desembolso de Profesor</h5>
                                </div>
                                <div className="p-5">
                                    <SelectTeacher
                                        value={teacher}
                                        isLoading={loading}
                                        isDisabled={loading}
                                        onChange={(option: SelectTeacherType | null) => {
                                            setTeacher(option?.value || '');
                                            useFetchpayment(option?.value || '');
                                        }}
                                    />
                                </div>
                                <div className='w-full flex justify-center'>
                                    <table className="table-hover border-collapse border border-gray-300 w-full mx-1 ">
                                        <thead>
                                            <tr>
                                                <th className="text-center px-4 py-2">PROFESOR</th>
                                                <th className="text-center px-4 py-2">TOTAL</th>
                                                <th className="text-center px-4 py-2">PENDIENTE</th>
                                                <th className="text-center px-4 py-2"> A PAGAR</th>
                                                <th className="text-center px-4 py-2">ACCION</th>

                                            </tr>
                                        </thead>

                                        <tbody>
                                            {!loading && teacher && accountsPayable.map((account) => {
                                                const item = account; // Asigna `account` a `item` si prefieres trabajar con `item`
                                                const inputId = `input-${item.id}`;
                                                const isPaid = item.amountDisbursed >= item.amount;
                                                const maxAmount = item.amount - item.amountDisbursed;
                                                const isLoading = false; // Aquí puedes colocar tu lógica real

                                                return (
                                                    <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700">
                                                        <td className="px-4 py-2 text-center text-sm text-gray-800 dark:text-gray-100">
                                                            <TeacherLabel teacherId={item.teacherId} />
                                                        </td>
                                                        <td className="px-4 py-2 text-center text-sm font-medium">{formatCurrency(item.amount)}</td>

                                                        <td className="px-4 py-2 text-center text-sm font-medium">
                                                            {isPaid ? (
                                                                <span className="font-semibold text-green-600 dark:text-green-400">Pagado</span>
                                                            ) : (
                                                                <span className="text-red-600 dark:text-red-400">{formatCurrency(maxAmount)}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2 text-center">
                                                            <Input
                                                                id={inputId}
                                                                type="number"
                                                                defaultValue={maxAmount}
                                                                max={maxAmount}
                                                                min={0}
                                                                step="0.01"
                                                                className="w-32"
                                                                disabled={isLoading || isPaid}
                                                                onChange={(e) => {
                                                                    const value = parseFloat(e.target.value);
                                                                    if (value > maxAmount) {
                                                                        e.target.value = maxAmount.toString();
                                                                        openNotification('warning', `El monto máximo a pagar es ${maxAmount.toFixed(2)}`);
                                                                    }
                                                                    if (value < 0) e.target.value = '0';
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2 text-center align-middle">
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                className="mx-auto"
                                                                loading={loadingPayment}
                                                                disabled={loadingPayment || isPaid}
                                                                onClick={() => {
                                                                    const inputEl = document.getElementById(inputId) as HTMLInputElement;
                                                                    const value = parseFloat(inputEl?.value || '0');
                                                                    if (value > 0 && value <= maxAmount) {
                                                                        handlepayAccount(account.id, account.amount);
                                                                    } else {
                                                                        alert('Por favor, ingrese un monto válido.');
                                                                    }
                                                                }}
                                                            >
                                                                {isPaid ? 'Pagado' : 'Desembolsar'}
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>

                                    </table>
                                </div>
                                <div className="p-5">
                                    <div className="mt-2 flex items-center justify-end gap-3">
                                        <Button onClick={() => setOpenModal(false)} variant="outline" color="danger">
                                            Cancelar
                                        </Button>

                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
