'use client';
import { Button, Input } from '@/components/ui';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { HiX } from 'react-icons/hi';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { createDisbursement, deleteDisbursement } from '../../lib/cash-register/disbursement-request';
import { openNotification, formatCurrency, confirmDialog } from '@/utils';
import { getFormattedDateTime } from '@/utils/date';
import { GenericSkeleton } from '@/components/common/Skeleton';
import useFetchCashMovements from '@/app/(defaults)/cash-registers/lib/use-fetch-cash-movements';
import { CashMovementReferenceType } from '@prisma/client';
import { TbTrash } from 'react-icons/tb';
import apiRequest from '@/utils/lib/api-request/request';

export default function DisbursementModal({ 
    setOpenModal, 
    openModal 
}: { 
    setOpenModal: (open: boolean) => void; 
    openModal: boolean;
}) {
    const { id: cashRegisterId } = useParams();
    const { data: session } = useSession();
    const userId = (session?.user as any)?.id;

    const [amount, setAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<{ amount?: string }>({});
    const [refreshKey, setRefreshKey] = useState(0);

    const queryParam = `referenceType=${CashMovementReferenceType.DISBURSEMENT}`;
    
    // Obtener solo desembolsos (movimientos con referenceType: DISBURSEMENT)
    // const { cashMovements, loading: movementsLoading, setCashMovements } = useFetchCashMovements(
    //     cashRegisterId as string,
    //     `${queryParam}&refresh=${refreshKey}`
    // );

    // // Filtrar solo los que no están eliminados
    // const activeDisbursements = cashMovements.filter(m => !m.deleted);

    const onCloseModal = () => {
        setAmount('');
        setDescription('');
        setFormErrors({});
        setOpenModal(false);
    };

    const validateForm = (): boolean => {
        const errors: { amount?: string } = {};
        
        if (!amount || parseFloat(amount) <= 0) {
            errors.amount = 'El monto debe ser mayor a 0';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // const refreshDisbursements = useCallback(async () => {
    //     try {
    //         const response = await apiRequest.get<any[]>(`/cash-register/${cashRegisterId}/cash-movements?${queryParam}`);
    //         if (response.success && response.data) {
    //             setCashMovements(response.data);
    //         }
    //     } catch (error) {
    //         console.error('Error refreshing disbursements:', error);
    //     }
    // }, [cashRegisterId, queryParam, setCashMovements]);

    const handleSubmit = async () => {
        if (!validateForm() || !userId) {
            return;
        }

        setLoading(true);
        try {
            const response = await createDisbursement(cashRegisterId as string, {
                amount: parseFloat(amount),
                description: description || undefined,
                createdBy: userId,
                referenceType: 'DISBURSEMENT',
                type: 'EXPENSE',
            });

            if (response.success) {
                openNotification('success', 'Desembolso creado correctamente');
                setAmount('');
                setDescription('');
                setFormErrors({});
                // Forzar recarga de la lista
                setRefreshKey(prev => prev + 1);
                // await refreshDisbursements();
            } else {
                openNotification('error', response.message || 'Error al crear el desembolso');
            }
        } catch (error) {
            console.error('Error creating disbursement:', error);
            openNotification('error', 'Error al crear el desembolso');
        } finally {
            setLoading(false);
        }
    };

    // const handleDelete = async (movementId: string) => {
    //     confirmDialog({
    //         title: 'Anular Desembolso',
    //         text: '¿Está seguro que desea anular este desembolso?',
    //         confirmButtonText: 'Sí, anular',
    //         icon: 'warning',
    //     }, async () => {
    //         try {
    //             const response = await deleteDisbursement(cashRegisterId as string, movementId);
    //             if (response.success) {
    //                 openNotification('success', 'Desembolso anulado correctamente');
    //                 // Forzar recarga de la lista
    //                 setRefreshKey(prev => prev + 1);
    //                 await refreshDisbursements();
    //             } else {
    //                 openNotification('error', response.message || 'Error al anular el desembolso');
    //             }
    //         } catch (error) {
    //             console.error('Error deleting disbursement:', error);
    //             openNotification('error', 'Error al anular el desembolso');
    //         }
    //     });
    // };

    return (
        <Transition appear show={openModal} as={Fragment}>
            <Dialog as="div" open={openModal} onClose={onCloseModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
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
                            <Dialog.Panel className="panel my-8 md:min-w-[600px] max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold">Desembolsos</h5>
                                    <button type="button" className="text-white-dark hover:text-dark" onClick={onCloseModal}>
                                        <HiX className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="p-5">
                                    {/* Formulario para crear desembolso */}
                                    <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-[#1E1E2D]">
                                        <h6 className="mb-4 text-base font-semibold">Nuevo Desembolso</h6>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    Monto <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    value={amount === '0' || parseFloat(amount) === 0 ? '' : amount}
                                                    onChange={(e) => {
                                                        setAmount(e.target.value);
                                                        if (formErrors.amount) {
                                                            setFormErrors({});
                                                        }
                                                    }}
                                                    className={formErrors.amount ? 'border-red-500' : ''}
                                                />
                                                {formErrors.amount && (
                                                    <p className="mt-1 text-sm text-red-500">{formErrors.amount}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Descripción</label>
                                                <textarea
                                                    rows={3}
                                                    placeholder="Descripción del desembolso..."
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    className="form-input"
                                                />
                                            </div>

                                            <div className="flex justify-end">
                                                <Button
                                                    onClick={handleSubmit}
                                                    disabled={loading || !amount}
                                                    color="primary"
                                                    loading={loading}
                                                >
                                                    Crear Desembolso
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lista de desembolsos
                                    <div>
                                        <h6 className="mb-4 text-base font-semibold">Desembolsos Registrados</h6>
                                        
                                        {movementsLoading ? (
                                            <GenericSkeleton lines={5} withHeader={false} />
                                        ) : activeDisbursements.length === 0 ? (
                                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-[#1E1E2D]">
                                                <p className="text-gray-500 italic">No hay desembolsos registrados</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {activeDisbursements.map((disbursement) => (
                                                    <div
                                                        key={disbursement.id}
                                                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-[#1E1E2D]"
                                                    >
                                                        <div className="flex-1">
                                                            <div className="mb-1 flex items-center gap-2">
                                                                <span className="text-sm font-semibold text-red-600">
                                                                    {formatCurrency(disbursement.amount)}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {getFormattedDateTime(new Date(disbursement.createdAt), { hour12: true })}
                                                                </span>
                                                            </div>
                                                            {disbursement.description && (
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {disbursement.description}
                                                                </p>
                                                            )}
                                                            {disbursement.user && (
                                                                <p className="text-xs text-gray-500">
                                                                    Por: {disbursement.user.name} {disbursement.user.lastName}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            color="danger"
                                                            size="sm"
                                                            onClick={() => handleDelete(disbursement.id)}
                                                            icon={<TbTrash className="h-4 w-4" />}
                                                        >
                                                            Anular
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>*/}
                                </div> 

                                <div className="border-t border-gray-200 bg-[#fbfbfb] px-5 py-3 dark:border-gray-700 dark:bg-[#121c2c]">
                                    <div className="flex justify-end">
                                        <Button onClick={onCloseModal} variant="outline">
                                            Cerrar
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

