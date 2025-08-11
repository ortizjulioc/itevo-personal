import SelectTeacher from '@/components/common/selects/select-teacher'
import { Button, Input } from '@/components/ui'
import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import useFetchAccountsPayable from '../../lib/accounts-payable/use-fetch-accounts-payable'
import { formatCurrency } from '@/utils'
import TeacherLabel from '@/components/common/info-labels/teacher-label'
import { useParams } from 'next/navigation'
import CourseBranchLabel from '@/components/common/info-labels/course-branch-label'
import { useRouter } from 'next/navigation'
import { GenericSkeleton } from '@/components/common/Skeleton'
import { Teacher } from '@prisma/client'
import { HiX } from 'react-icons/hi'
interface SelectTeacherType {
    value: string
    label: string
}
export default function TeacherPayment({ setOpenModal, openModal }: { setOpenModal: (open: boolean) => void, openModal: boolean }) {
    const { id: cashRegisterId } = useParams()

    const [teacher, setTeacher] = useState<Teacher | null>(null)
    const [teacherId, setTeacherId] = useState<string | null>(null)
    const [loadingPayment, setLoadingPayment] = useState(false)
    const router = useRouter();
    const { accountsPayable, fetchAccountsPayableData, loading, setAccountsPayable } = useFetchAccountsPayable('')

    const onChangeTeacher = async (option: SelectTeacherType | null) => {
        if (option) {
            console.log('Selected teacher:', option);
            setTeacherId(option.value);
            await fetchAccountsPayableData(`teacherId=${option.value}&top=1000`);
        } else {
            setTeacherId(null);
            setTeacher(null);
            setAccountsPayable([]);
        }
    }

    const onCloseModal = () => {
        setTeacher(null);
        setTeacherId(null);
        setAccountsPayable([]);
        setOpenModal(false);
        console.log('Modal closed');
    }

    useEffect(() => {
        if (accountsPayable.length > 0) {
            setTeacher(accountsPayable[0]?.teacher);
        } else {
            setTeacher(null);
        }
    }, [accountsPayable]);


    return (
        <Transition appear show={openModal} as={Fragment}>
            <Dialog as="div" open={openModal} onClose={onCloseModal}>
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
                            <Dialog.Panel className="panel my-8 md:min-w-[500px] max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold">Desembolso a Profesor</h5>
                                    <button type="button" className="text-white-dark hover:text-dark" onClick={onCloseModal}>
                                        <HiX className="h-6 w-6" />
                                    </button>
                                </div>
                                <div className="p-5">

                                    <SelectTeacher
                                        value={teacherId ? teacherId : undefined}
                                        isLoading={loading}
                                        isDisabled={loading}
                                        onChange={onChangeTeacher}
                                    />
                                </div>
                                {/* Profesor debajo del selector */}
                                <div className="px-5 mb-2">
                                    {teacher &&
                                        <span className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                                            {teacher.firstName} {teacher.lastName}
                                        </span>
                                    }
                                </div>

                                {teacherId && accountsPayable.length === 0 && !loading && (
                                    <div className="px-5 py-4 text-gray-500 text-center italic">
                                        No se encontraron cuentas por pagar para este profesor.
                                    </div>
                                )}

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
                                                    {/* { accountsPayable.length > 1 && accountsPayable[0].courseBranch && (
                                                        <CourseBranchLabel CourseBranchId={item.courseBranchId} courseBranch={accountsPayable[0].courseBranch} showTeacher={false} clickable={false} />
                                                    )} */}
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
                                                            <div className="text-sm text-gray-500">Total generado</div>
                                                        </div>
                                                    </div>

                                                    {/* Abonado */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                                                        <div>
                                                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                                                                {formatCurrency(paidAmount)}
                                                            </div>
                                                            <div className="text-sm text-gray-500">Total pagado</div>
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
                                        <Button onClick={onCloseModal} variant="outline" color="danger">
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                setLoadingPayment(true);
                                                await new Promise((res) => setTimeout(res, 500)); // opcional, solo para mostrar loading
                                                router.push(`/teacher-payments/${cashRegisterId}/teacher/${teacherId}`);
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
