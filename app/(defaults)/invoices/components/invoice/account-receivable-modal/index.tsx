import { AccountReceivable, InvoiceItem } from '@prisma/client';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import StudentLabel from '@/components/common/info-labels/student-label';
import { Button, Input } from '@/components/ui';
import { formatCurrency, openNotification } from '@/utils';
import { TbX } from 'react-icons/tb';

export default function AccountReceivableModal({
    studentId,
    accountReceivables,
    handleAddItemsInvoice,
    setItem,
    setAccountsReceivables,
    openModal,
    setOpenModal,
}: {
    studentId: string;
    accountReceivables: any[];
    handleAddItemsInvoice: (item: any) => Promise<boolean>;
    setItem: React.Dispatch<React.SetStateAction<InvoiceItem | null>>;
    setAccountsReceivables: React.Dispatch<React.SetStateAction<AccountReceivable[] | null>>;
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
}) {
    const [loadingId, setLoadingId] = React.useState<string | null>(null);

    const { groupedByCourse, others } = React.useMemo(() => {
        const groupedByCourse: Record<string, any[]> = {};
        const others: any[] = [];

        for (const curr of accountReceivables) {
            if (curr.courseBranchId && curr.courseBranch) {
                if (!groupedByCourse[curr.courseBranchId]) {
                    groupedByCourse[curr.courseBranchId] = [];
                }
                groupedByCourse[curr.courseBranchId].push(curr);
            } else {
                others.push(curr);
            }
        }

        return { groupedByCourse, others };
    }, [accountReceivables]);

    const handleAddItem = async (item: any, value: number) => {
        try {
            setLoadingId(item.id);
            const newItem: any = {
                quantity: 1,
                accountReceivableId: item.id,
                unitPrice: value,
                subtotal: value,
                itbis: 0,
                concept: `Cuota curso: ${item.courseBranch?.course?.name ?? 'Otro'}`,
            };

            setItem(newItem);
            const resp = await handleAddItemsInvoice(newItem);

            if (resp){
            setAccountsReceivables(prev => {
                if (!prev) return [];
                return prev.map(ar =>
                    ar.id === item.id
                        ? {
                              ...ar,
                              amountPaid: ar.amountPaid + value,
                              uiStatus: 'ADDED',
                          }
                        : ar
                );
            });
            }

        } catch (error) {
            console.error('Error setting item:', error);
            openNotification('error', 'Error al agregar el ítem');
        } finally {
            setLoadingId(null);
        }
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

    const renderTable = (items: any[]) => (
        <table className="min-w-full table-auto bg-white dark:bg-gray-800 rounded shadow">
            <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    <th className="px-4 py-2 text-center">Fecha de Vencimiento</th>
                    <th className="px-4 py-2 text-center">Precio</th>
                    <th className="px-4 py-2 text-center">Abonado</th>
                    <th className="px-4 py-2 text-center">Pendiente</th>
                    <th className="px-4 py-2 text-center">Cantidad a Pagar</th>
                    <th className="px-4 py-2 text-center">Acción</th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => {
                    const maxAmount = item.amount - item.amountPaid;
                    const isPaid = maxAmount <= 0;
                    const inputId = `amount-${item.id}`;
                    const isLoading = loadingId === item.id;

                    return (
                        <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700">
                            <td className="px-4 py-2 text-sm text-center">{formatDate(item.dueDate)}</td>
                            <td className="px-4 py-2 text-sm text-center">{formatCurrency(item.amount)}</td>
                            <td className="px-4 py-2 text-sm text-center">{formatCurrency(item.amountPaid)}</td>
                            <td className="px-4 py-2 text-sm text-center">
                                {item.uiStatus === 'ADDED' ? (
                                    <span className="text-blue-600 font-semibold">Agregado</span>
                                ) : isPaid ? (
                                    <span className="text-green-600 font-semibold">Pagado</span>
                                ) : (
                                    <span className="text-red-600">{formatCurrency(maxAmount)}</span>
                                )}
                            </td>
                            <td className="px-4 py-2 text-center">
                                <Input
                                    id={inputId}
                                    type="number"
                                    defaultValue={maxAmount === 0 ? '' : maxAmount}
                                    max={maxAmount}
                                    min={0}
                                    step="0.01"
                                    className="w-32"
                                    disabled={isLoading || isPaid}
                                    onWheel={e => (e.target as HTMLInputElement).blur()}
                                    onChange={e => {
                                        const value = parseFloat(e.target.value);
                                        if (value > maxAmount) {
                                            e.target.value = maxAmount.toString();
                                            openNotification('warning', `El monto máximo a pagar es ${maxAmount.toFixed(2)}`);
                                        }
                                        if (value < 0) e.target.value = '';
                                    }}
                                />
                            </td>
                            <td className="px-4 py-2 text-center">
                                <Button
                                    type="button"
                                    size="sm"
                                    className="mx-auto"
                                    loading={isLoading}
                                    disabled={isLoading || isPaid}
                                    onClick={() => {
                                        const inputEl = document.getElementById(inputId) as HTMLInputElement;
                                        const value = parseFloat(inputEl?.value || '0');
                                        if (value > 0 && value <= maxAmount) {
                                            handleAddItem(item, value);
                                        } else {
                                            openNotification('error', 'Por favor, ingrese un monto válido.');
                                        }
                                    }}
                                >
                                    {isPaid ? 'Pagado' : 'Agregar'}
                                </Button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    return (
        <Transition appear show={openModal} as={Fragment}>
            <Dialog as="div" className="relative z-[999]" onClose={() => setOpenModal(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-start justify-center px-4 py-12">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setOpenModal(false)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition"
                                    color="danger"
                                    icon={<TbX className="text-lg text-black" />}
                                />

                                <Dialog.Title className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Cuentas por cobrar del estudiante: <StudentLabel studentId={studentId} />
                                </Dialog.Title>

                                <div className="space-y-6">
                                    {accountReceivables.length === 0 ? (
                                        <div className="text-center text-gray-500 dark:text-gray-300 py-8">
                                            No se encontraron cuentas por cobrar para este estudiante.
                                        </div>
                                    ) : (
                                        <>
                                            {Object.entries(groupedByCourse).map(([courseBranchId, items]) => {
                                                const courseName = items[0].courseBranch.course.name;
                                                const pendingItems = items.filter(item => item.amount > item.amountPaid).length;

                                                const sortedItems = [...items].sort((a, b) => {
                                                    const getStatusPriority = (item: any) => {
                                                        if (item.status === 'PAID') return 2;
                                                        if (item.uiStatus === 'ADDED') return 1;
                                                        return 0;
                                                    };
                                                    return getStatusPriority(a) - getStatusPriority(b);
                                                });

                                                return (
                                                    <div key={courseBranchId} className="border p-4 rounded-lg">
                                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{courseName}</h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                                            Cuotas Pendientes: <strong>{pendingItems} / {items.length}</strong>
                                                        </p>
                                                        {renderTable(sortedItems)}
                                                    </div>
                                                );
                                            })}

                                            {others.length > 0 && (
                                                <div className="border p-4 rounded-lg">
                                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Otros</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                                        Cuotas pendientes: <strong>{others.filter(i => i.amount > i.amountPaid).length} / {others.length}</strong>
                                                    </p>
                                                    {renderTable(others)}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <Button type="button" onClick={() => setOpenModal(false)} variant="outline" color="danger">
                                        Cerrar
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}