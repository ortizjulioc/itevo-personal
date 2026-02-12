import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import useFetchCourseBranchRulesById from '@/app/(defaults)/course-branch/lib/use-fetch-rules';
import { useFetchEnrollmentById } from '@/app/(defaults)/enrollments/lib/use-fetch-enrollments';
import useFetchSetting from '@/app/(defaults)/settings/lib/use-fetch-settings';
import { EnrollmentPDF } from '@/components/pdf/enrollment';
import { usePrintPDF } from '@/utils/hooks/use-print-pdf';
import { fetchImageAsBase64 } from '@/utils/image';
import { IconLoader } from '@/components/icon';
import { openNotification } from '@/utils';

interface Props {
    modal: boolean;
    setModal: (value: boolean) => void;
    enrollmentId: string;
    courseBranchId: string;
}

export default function PrintEnrollmentModal({ modal, setModal, enrollmentId, courseBranchId }: Props) {
    const { enrollment, loading: loadingEnrollment } = useFetchEnrollmentById(enrollmentId);
    const { setting, loading: loadingSettings } = useFetchSetting();
    const { courseBranchRule, loading: loadingRules } = useFetchCourseBranchRulesById(courseBranchId);
    const [generating, setGenerating] = useState<boolean>(false);
    const { printPDF } = usePrintPDF();

    const isLoading = loadingEnrollment || loadingSettings || loadingRules;

    const handlePrint = async () => {
        if (!enrollment || !setting) return;

        setGenerating(true);
        try {
            let blobLogo = null;
            if (setting.logoReport) {
                blobLogo = await fetchImageAsBase64(setting.logoReport);
            }

            await printPDF(
                <EnrollmentPDF
                    enrollment={enrollment}
                    companyInfo={{ ...setting, logo: blobLogo }}
                    rules={courseBranchRule?.rules || setting.rules || []}
                />,
                { cleanUpMilliseconds: 600000 }
            );
            setModal(false);
        } catch (error) {
            console.error(error);
            openNotification('error', 'Error al generar el documento');
        } finally {
            setGenerating(false);
        }
    };

    // Auto-trigger print when data is ready
    useEffect(() => {
        if (!isLoading && enrollment && setting && modal && !generating) {
            handlePrint();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, enrollment, setting, modal]);

    return (
        <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" open={modal} onClose={() => {}}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-[black]/60 z-[999]" />
                </Transition.Child>

                <div className="fixed inset-0 z-[999] overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-[#1b2e4b]">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white text-center mb-4"
                                >
                                    Generando documento
                                </Dialog.Title>
                                <div className="mt-2 flex flex-col items-center justify-center gap-4">
                                    <IconLoader className="animate-spin w-10 h-10 text-primary" />
                                    <p className="text-sm text-gray-500 text-center">
                                        {isLoading ? 'Cargando información...' : 'Preparando PDF...'}
                                    </p>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
