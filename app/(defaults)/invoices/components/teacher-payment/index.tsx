import SelectTeacher from '@/components/common/selects/select-teacher'
import { Button, Input } from '@/components/ui'
import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import useFetchAccountsPayable from '../../lib/accounts-payable/use-fetch-accounts-payable'
import { formatCurrency, openNotification } from '@/utils'
import TeacherLabel from '@/components/common/info-labels/teacher-label'
import { PayAccount } from '../../lib/accounts-payable/request'
import { useParams } from 'next/navigation'
import CourseBranchLabel from '@/components/common/info-labels/course-branch-label'
import { useRouter } from 'next/navigation'
import { GenericSkeleton } from '@/components/common/Skeleton'
interface SelectTeacherType {
    value: string
    label: string
}
export default function TeacherPayment({ setOpenModal, openModal }: { setOpenModal: (open: boolean) => void, openModal: boolean }) {
    const { id: cashRegisterId } = useParams()

    const [teacher, setTeacher] = useState('')
    const [loadingPayment, setLoadingPayment] = useState(false)
    const router = useRouter();
    const { accountsPayable, fetchAccountsPayableData, loading } = useFetchAccountsPayable('')

    const useFetchpayment = async (id: string) => {
        const data = await fetchAccountsPayableData(`teacherId=${id}&top=1000`);
        console.log(data)
        return data

    };





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
                            <Dialog.Panel className="panel w-1/2 max-w-5xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold">Desembolso a Profesor</h5>
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
                                {/* Profesor debajo del selector */}
                                <div className="px-5 mb-2">
                                    {teacher &&
                                        <TeacherLabel
                                            teacherId={teacher}
                                            className="text-2xl font-bold text-gray-800 dark:text-white mb-4"
                                        />
                                    }
                                </div>

                                {/* Tarjetas de pagos */}
                                <div className="px-5">
                                    {teacher && loading && (<GenericSkeleton lines={2} withHeader className="mb-4" />)}

                                    {!loading && teacher && accountsPayable.map((item) => {
                                        const paidAmount = item.amountDisbursed;
                                        const pendingAmount = item.amount - item.amountDisbursed;

                                        return (
                                            <div
                                                key={item.id}
                                                className="mb-5 w-full rounded-md border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-[#1E1E2D]"
                                            >
                                                <div className="mb-4 text-sm font-semibold text-gray-800 dark:text-white">
                                                    <CourseBranchLabel CourseBranchId={item.courseBranchId} showTeacher={false} />
                                                </div>

                                                <div className="flex flex-wrap gap-6 justify-between">
                                                    {/* Adeudado */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="mt-1 h-2 w-2 rounded-full bg-red-500" />
                                                        <div>
                                                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                                                                {formatCurrency(item.amount)}
                                                            </div>
                                                            <div className="text-sm text-gray-500">Total</div>
                                                        </div>
                                                    </div>

                                                    {/* Abonado */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                                                        <div>
                                                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                                                                {formatCurrency(paidAmount)}
                                                            </div>
                                                            <div className="text-sm text-gray-500">Total Abonado</div>
                                                        </div>
                                                    </div>

                                                    {/* Pendiente */}
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
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="p-5">
                                    <div className="mt-2 flex items-center justify-end gap-3">
                                        <Button onClick={() => setOpenModal(false)} variant="outline" color="danger">
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                setLoadingPayment(true);
                                                await new Promise((res) => setTimeout(res, 500)); // opcional, solo para mostrar loading
                                                router.push(`/teacher-payments/${cashRegisterId}/teacher/${teacher}`);
                                            }}
                                            disabled={!teacher || loadingPayment}
                                            color="primary"
                                            className="flex items-center gap-2 justify-center min-w-[120px]"
                                        >
                                            {loadingPayment && (
                                                <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                                            )}
                                            <span>{loadingPayment ? 'Redirigiendo...' : 'Desembolsar'}</span>
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
