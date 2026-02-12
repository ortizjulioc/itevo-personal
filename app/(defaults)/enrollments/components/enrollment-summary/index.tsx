import React from 'react';
import { EnrollmentSummary } from '../../lib/use-fetch-enrollments';
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
                    <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (!summary) return null;

    const cards = [
        { label: 'Total', count: summary.total, color: 'text-gray-600', bg: 'bg-white' },
        { label: 'En espera', count: summary.waiting, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Confirmadas', count: summary.confirmed, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Inscritas', count: summary.enrolled, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Completadas', count: summary.completed, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Abandonadas', count: summary.abandoned, color: 'text-red-600', bg: 'bg-red-50' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {cards.map((card, index) => (
                <div key={index} className={`p-4 rounded-lg shadow-sm border border-gray-100 ${card.bg} flex flex-col items-center justify-center`}>
                    <span className={`text-2xl font-bold ${card.color}`}>{card.count}</span>
                    <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                        {index > 0 && <TbPointFilled className={card.color} />}
                        {card.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
