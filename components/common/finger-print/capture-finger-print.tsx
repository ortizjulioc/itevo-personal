'use client';
import { Button } from '@/components/ui';
import useFingerprint from '@/utils/hooks/use-finger-print-scanner';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { IoIosFingerPrint } from 'react-icons/io';
import apiRequest from '@/utils/lib/api-request/request';
import { Fingerprint } from '@prisma/client';
import { openNotification } from '@/utils';
import Tooltip from '@/components/ui/tooltip';

interface Props {
    studentId: string,
    showTitle?: boolean
}

export default function CaptureFingerPrint({ studentId, showTitle = true }: Props) {
    const [openModal, setOpenModal] = useState(false);
    const [image, setImage] = useState('');
    const [fingerprintData, setFingerprintData] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [submitloading, setSubmitLoading] = useState(false)

    const addFingerPrint = async () => {

        setSubmitLoading(true)
        const data = {
            fingerprint: fingerprintData,
            sensorType: '2connect',
        };

        try {
            const resp = await apiRequest.post<any>(`/students/${studentId}/fingerprint`, data);

            if (resp.success) {
                openNotification('success', 'Huella registrada correctamente')
                setOpenModal(false)
            } else {
                openNotification('error', 'Hubo un problema al registrar la huella')
            }

        } catch (error) {
            console.log(error)
            openNotification('error', 'Hubo un problema al registrar la huella')

        } finally {
            setSubmitLoading(false)
        }


    }


    const { state, captureFingerprint, matchFingerprint } = useFingerprint();

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
                const score = await matchFingerprint(
                    captures[i].fingerprintData,
                    captures[i + 1].fingerprintData
                );
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

    const resetState = () => {
        setImage('');
        setFingerprintData('');
        setError(false);
        setLoading(false);
        setProgress(0);
        setOpenModal(false);
    };


    useEffect(() => {
        if (openModal) handleCapture();
    }, [openModal]);

    return (
        <div>
            <Tooltip title="Registrar Huella">
                <Button
                    type="button"
                    onClick={() => setOpenModal(true)}
                    icon={<IoIosFingerPrint className='text-lg' />}
                    size="md"
                    variant="outline"
                    
                >
                    {showTitle && 'Registrar Huella'}

                </Button>

            </Tooltip>
            <Transition appear show={openModal} as={Fragment}>
                <Dialog as="div" open={openModal} onClose={resetState}>
                    <div className="fixed inset-0 bg-black/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-sm my-8 text-black dark:text-white-dark bg-white dark:bg-[#1E1E2D]">
                                    <div className="flex items-center justify-between px-5 py-3 bg-[#fbfbfb] dark:bg-[#121c2c]">
                                        <h5 className="font-bold text-lg">Registro de Huella</h5>
                                    </div>
                                    <div className="p-5 text-center">


                                        <div className="flex justify-center">
                                            {image ? (
                                                <img src={image} alt="Huella" className="border w-32 h-32" />
                                            ) : (
                                                <IoIosFingerPrint className="text-7xl text-gray-400 animate-pulse" />
                                            )}
                                        </div>

                                        {loading && (
                                            <div className="w-full h-4 mt-4 bg-[#ebedf2] dark:bg-dark/40 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-primary h-4 rounded-full text-white flex justify-between items-center px-2 text-xs transition-all duration-300"
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

                                        <div className="flex justify-end items-center mt-8 gap-3">
                                            <Button variant="outline" color="danger" onClick={resetState}>
                                                Cancelar
                                            </Button>
                                            <Button onClick={addFingerPrint} disabled={!fingerprintData} loading={submitloading}>
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
