'use client';
import { Button } from '@/components/ui';
import useFingerprint from '@/utils/hooks/use-finger-print-scanner';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { IoIosFingerPrint } from 'react-icons/io';
import apiRequest from '@/utils/lib/api-request/request';
import { openNotification } from '@/utils';
import Tooltip from '@/components/ui/tooltip';
import Swal from 'sweetalert2';
import { deteleFingerPrintById, getFingerPrintById } from '@/app/(defaults)/attendances/lib/request';

interface Props {
    studentId?: string;
    showTitle?: boolean;
    blackStyle?: boolean;
    onChange?: (val: string) => void;
}

export default function CaptureFingerPrint({ studentId, showTitle = true, onChange, blackStyle = false }: Props) {
    const [openModal, setOpenModal] = useState(false);
    const [image, setImage] = useState('');
    const [fingerprintData, setFingerprintData] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [submitloading, setSubmitLoading] = useState(false);
    const [existingFingerprint, setExistingFingerprint] = useState<boolean>(false);
    const [deleting, setDeleting] = useState(false);
    const { state, captureFingerprint, matchFingerprint } = useFingerprint();

    const fetchExistingFingerprint = async () => {
        if (!studentId) return;

        try {
            const response = await getFingerPrintById(studentId || '');
            const template = response.data?.template;

            let asString = '';

            if (template && typeof template === 'object') {
                const byteArray = Object.values(template);
                const uint8 = Uint8Array.from(byteArray);
                asString = Buffer.from(uint8).toString('base64');
            }

            setExistingFingerprint(!!asString);
        } catch (e) {
            setExistingFingerprint(false);
        }
    };

    const handleCapture = async () => {
        setError(false);
        setImage('');
        setFingerprintData('');
        setLoading(true);
        setProgress(0);

        try {
            const attempts = 3;
            const captures: { image: string; fingerprintData: string }[] = [];

            for (let i = 0; i < attempts; i++) {
                const result = await captureFingerprint();
                captures.push(result);
                setProgress(Math.round(((i + 1) / attempts) * 100));
            }

            for (let i = 0; i < captures.length - 1; i++) {
                const score = await matchFingerprint(captures[i].fingerprintData, captures[i + 1].fingerprintData);
                if (score < 70) throw new Error('Las muestras no coincidieron');
            }

            setImage(captures[0].image);
            setFingerprintData(captures[0].fingerprintData);
        } catch (e) {
            setError(true);
            setImage('');
            setFingerprintData('');
        } finally {
            setLoading(false);
        }
    };

    const addFingerPrint = async () => {
        setSubmitLoading(true);
        const data = {
            fingerprint: fingerprintData,
            sensorType: '2connect',
        };

        try {
            const resp = await apiRequest.post<any>(`/students/${studentId}/fingerprint`, data);

            if (resp.success) {
                openNotification('success', 'Huella registrada correctamente');
                setOpenModal(false);
                setExistingFingerprint(true);
            } else {
                openNotification('error', 'Hubo un problema al registrar la huella');
            }
        } catch (error) {
            console.log(error);
            openNotification('error', 'Hubo un problema al registrar la huella');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleButtonClick = async () => {
        if (existingFingerprint && studentId) {
            const result = await Swal.fire({
                title: 'Huella ya registrada',
                text: 'Este estudiante ya tiene una huella registrada. ¿Desea reemplazarla?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, reemplazar',
                cancelButtonText: 'Cancelar',
            });

            if (!result.isConfirmed) return;

            try {
                setDeleting(true); // 🟡 inicia loading
                await deteleFingerPrintById(studentId);
                openNotification('success', 'Huella anterior eliminada');
                setExistingFingerprint(false);
            } catch (error) {
                openNotification('error', 'Error al eliminar la huella anterior');
                return;
            } finally {
                setDeleting(false); // 🟢 termina loading
            }
        }

        setOpenModal(true);
    };

    const handleSave = async () => {
        if (existingFingerprint) {
            const confirm = await Swal.fire({
                title: 'Ya existe una huella registrada',
                text: '¿Desea eliminar la anterior y registrar una nueva?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, reemplazar',
                cancelButtonText: 'Cancelar',
            });

            if (!confirm.isConfirmed) return;
        }

        if (onChange) {
            setSubmitLoading(true);
            try {
                onChange(fingerprintData);
                openNotification('success', 'Huella registrada correctamente');
                setOpenModal(false);
                setExistingFingerprint(true);
            } finally {
                setSubmitLoading(false);
            }
        } else {
            addFingerPrint();
        }
    };

    const resetState = () => {
        setImage('');
        setFingerprintData('');
        setError(false);
        setLoading(false);
        setProgress(0);
        setOpenModal(false);
    };

    useEffect(() => {
        if (openModal) {
            handleCapture();
        }
    }, [openModal]);

    useEffect(() => {
        fetchExistingFingerprint();
    }, []);
    return (
        <div>
            <Tooltip title="Registrar Huella">
                <Button
                    type="button"
                    onClick={handleButtonClick}
                    icon={<IoIosFingerPrint className="text-lg" />}
                    size="md"
                    variant="outline"
                    className={`whitespace-nowrap ${blackStyle ? 'border-none text-black hover:bg-white hover:text-black' : ''}`}
                >
                    {existingFingerprint ? 'Huella registrada' : showTitle && 'Registrar Huella'}
                </Button>
            </Tooltip>

            <Transition appear show={openModal} as={Fragment}>
                <Dialog as="div" open={openModal} onClose={resetState}>
                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-black/60">
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
                                <Dialog.Panel className="panel my-8 w-full max-w-sm overflow-hidden rounded-lg border-0 bg-white p-0 text-black dark:bg-[#1E1E2D] dark:text-white-dark">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Registro de Huella</h5>
                                    </div>
                                    <div className="p-5 text-center">
                                        <div className="flex justify-center">
                                            {image ? <img src={image} alt="Huella" className="h-32 w-32 border" /> : <IoIosFingerPrint className="animate-pulse text-7xl text-gray-400" />}
                                        </div>

                                        {loading && (
                                            <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                                <div
                                                    className="flex h-4 items-center justify-between rounded-full bg-primary px-2 text-xs text-white transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                >
                                                    <span>Capturando</span>
                                                    <span>{progress}%</span>
                                                </div>
                                            </div>
                                        )}

                                        {error && !loading && (
                                            <Button className="mt-6 w-full" onClick={handleCapture}>
                                                Intentar de nuevo
                                            </Button>
                                        )}

                                        <div className="mt-8 flex items-center justify-end gap-3">
                                            <Button variant="outline" color="danger" onClick={resetState}>
                                                Cancelar
                                            </Button>
                                            <Button onClick={handleSave} disabled={!fingerprintData} loading={submitloading}>
                                                Guardar
                                            </Button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
