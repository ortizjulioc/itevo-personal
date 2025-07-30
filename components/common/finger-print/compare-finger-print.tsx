// ✅ Componente optimizado CompareFingerPrint.tsx con reconexión por timeout
'use client';
import { Button } from '@/components/ui';
import useFingerprint from '@/utils/hooks/use-finger-print-scanner';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { IoIosFingerPrint } from 'react-icons/io';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Tooltip from '@/components/ui/tooltip';

interface CompareFingerPrintProps {
    previousFingerprint?: string;
    onSuccess?: (score: number) => void;
    showTitle?: boolean;
    blackStyle?: boolean
}

export default function CompareFingerPrint({ previousFingerprint, onSuccess, blackStyle = false, showTitle = true }: CompareFingerPrintProps) {
    const [openModal, setOpenModal] = useState(false);
    const [image, setImage] = useState('');
    const [valid, setValid] = useState<boolean | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [score, setScore] = useState<number | null>(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timeoutError, setTimeoutError] = useState(false);

    const { state, captureFingerprint, matchFingerprint } = useFingerprint();

    const handleCompare = async () => {
        setLoading(true);
        setError(false);
        setValid(null);
        setSuccess(false);
        setImage('');
        setScore(null);
        setTimeoutError(false);

        try {
            const result = await captureFingerprint();
            setImage(result.image);

            const matchScore = await matchFingerprint(previousFingerprint || '', result.fingerprintData);
            setScore(matchScore);

            const isValid = matchScore >= 70;
            setValid(isValid);
            setSuccess(isValid);
            if (isValid && onSuccess) onSuccess(matchScore);
        } catch (err: any) {
            console.error(err);
            if (typeof err === 'string' && err.includes('Timeout')) {
                setTimeoutError(true);
            } else {
                setError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setOpenModal(false);
        setImage('');
        setValid(null);
        setScore(null);
        //setSuccess(false);
        setError(false);
        setLoading(false);
        setTimeoutError(false);
    };

    useEffect(() => {
        if (openModal) handleCompare();
    }, [openModal]);

    useEffect(() => {
        setSuccess(false);
    }, [previousFingerprint]);

    return (
        <div>
            {success ? (
                <span className="inline-flex items-center text-green-600 font-medium text-sm gap-1">
                    <FaCheckCircle className="text-lg" /> Huella validada
                </span>
            ) : (
                <Tooltip title="Validar Huella">
                    <Button
                        type="button"
                        onClick={() => setOpenModal(true)}
                        icon={<IoIosFingerPrint className="text-lg" />}
                        size="md"
                        variant="outline"
                        disabled={!previousFingerprint}
                        className={`whitespace-nowrap ${blackStyle ? 'border-none text-black hover:bg-white hover:text-black' : ''
                            }`}
                    >
                        {loading ? 'Cargando...' : showTitle && 'Validar Huella'}
                    </Button>
                </Tooltip>
            )}
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
                                        <h5 className="font-bold text-lg">Verificación de Huella</h5>
                                    </div>
                                    <div className="p-5 text-center">
                                        <p className="text-base mb-4 text-gray-600 dark:text-gray-300">
                                            Estado del dispositivo: <span className="font-semibold">{state}</span>
                                        </p>

                                        <div className="flex justify-center mb-4">
                                            {loading ? (
                                                <div className="animate-pulse w-32 h-32 border rounded-md flex items-center justify-center">
                                                    <IoIosFingerPrint className="text-6xl text-gray-300" />
                                                </div>
                                            ) : image ? (
                                                <img src={image} alt="Huella capturada" className="border w-32 h-32" />
                                            ) : (
                                                <IoIosFingerPrint className="text-7xl text-gray-400 animate-pulse" />
                                            )}
                                        </div>

                                        {!loading && score !== null && (
                                            <div className={`flex items-center justify-center gap-2 mb-4 text-base font-semibold ${valid ? 'text-green-600' : 'text-red-600'}`}>
                                                {valid ? <FaCheckCircle /> : <FaTimesCircle />}
                                                <span>
                                                    {valid ? 'Huella válida' : 'Huella no válida'} (Score: {score})
                                                </span>

                                            </div>
                                        )}

                                        {timeoutError && !loading && (
                                            <div className="text-sm text-yellow-500 mb-4">Tiempo de espera superado.</div>
                                        )}

                                        {(error || timeoutError || !valid) && !loading && (
                                            <Button className="w-full mb-2" onClick={handleCompare}>
                                                Reintentar
                                            </Button>
                                        )}

                                        <div className="flex justify-end items-center mt-4 gap-3">
                                            <Button variant="outline" color="danger" onClick={resetState}>
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
        </div>
    );
}
