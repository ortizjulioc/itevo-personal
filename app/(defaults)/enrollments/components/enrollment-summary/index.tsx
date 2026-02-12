import React from 'react';
import { EnrollmentSummary } from '../../lib/use-fetch-enrollments';
import { IconUsers, IconLoader, IconCircleCheck, IconChecks, IconLayoutGrid, IconSquareRotated } from '@/components/icon';
import { TbPointFilled } from 'react-icons/tb';

interface EnrollmentSummaryCardsProps {
    summary: EnrollmentSummary | null;
    loading: boolean;
}

export default function EnrollmentSummaryCards({ summary, loading }: EnrollmentSummaryCardsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (!summary) return null;

    const cards = [
        {
            label: 'Total',
            count: summary.total,
            color: 'text-primary',
            bg: 'bg-primary-light',
            icon: <IconLayoutGrid className="size-6" />,
            topBorderColor: 'bg-primary'
        },
        {
            label: 'En espera',
            count: summary.waiting,
            color: 'text-warning',
            bg: 'bg-warning-light',
            icon: <IconLoader className="size-6" />,
            topBorderColor: 'bg-warning'
        },
        {
            label: 'Confirmadas',
            count: summary.confirmed,
            color: 'text-info',
            bg: 'bg-info-light',
            icon: <IconChecks className="size-6" />,
            topBorderColor: 'bg-info'
        },
        {
            label: 'Inscritas',
            count: summary.enrolled,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            icon: <IconUsers className="size-6" />,
            topBorderColor: 'bg-indigo-600'
        },
        {
            label: 'Completadas',
            count: summary.completed,
            color: 'text-success',
            bg: 'bg-success-light',
            icon: <IconCircleCheck className="size-6" />,
            topBorderColor: 'bg-success'
        },
        {
            label: 'Abandonadas',
            count: summary.abandoned,
            color: 'text-danger',
            bg: 'bg-danger-light',
            icon: <IconSquareRotated className="size-6" />,
            topBorderColor: 'bg-danger'
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {cards.map((card, index) => (
                <div key={index} className="panel bg-white p-4 rounded-xl border border-gray-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-full h-1 ${card.topBorderColor}`}></div>

                    <div className="flex justify-between items-start mb-2">
                        <div className={`p-2 rounded-lg ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                           {card.icon}
                        </div>
                    </div>

                    <div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                            {card.count}
                        </div>
                        <div className="text-sm text-gray-500 font-semibold tracking-wide uppercase">
                            {card.label}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
