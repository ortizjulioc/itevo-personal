'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import IconCaretDown from '../icon/icon-caret-down';
import PrintDisbursement from './print/disbursement';
interface ViewTitleProps {
    title: string;
    showBackPage?: boolean;
    rightComponent?: React.ReactNode;
    className?: string;
}

const ViewTitle: React.FC<ViewTitleProps> = ({ title, showBackPage = false, rightComponent, className = '' }) => {
    const router = useRouter();
    const handleBackClick = () => {
        router.back();
    };

    return (
        <>
            <div className={`flex items-center justify-between flex-wrap gap-4 ${className}`}>
                <h2 className="text-2xl font-semibold flex items-center">
                    {showBackPage && (
                        <button onClick={handleBackClick}>
                            <IconCaretDown className='rotate-90 size-5 cursor-pointer' />
                        </button>
                    )}
                    {title}
                </h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    {rightComponent}
                </div>
            </div>
            <PrintDisbursement paymentId={'fa756aa1-36b2-47e6-b601-6912cba49d33'} payableId={'5dad2454-66fc-421e-bf58-0acd35fa29b3'} />
        </>
    );
};

export default ViewTitle;
