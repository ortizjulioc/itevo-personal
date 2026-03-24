'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useFetchQuotationById } from '../lib/use-fetch-quotations';
import FormSkeleton from '@/components/common/form-skeleton';

const QuotationContext = createContext<any>(null);

export default function QuotationProvider({ children, quotationId }: { children: ReactNode, quotationId: string }) {
    const { quotation, loading, error, setQuotation, fetchQuotationData } = useFetchQuotationById(quotationId);

    if (loading) return <FormSkeleton />;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
    if (!quotation) return <div className="p-4">Cotización no encontrada</div>;

    return (
        <QuotationContext.Provider value={{ quotation, setQuotation, fetchQuotationData }}>
            {children}
        </QuotationContext.Provider>
    );
}

export const useQuotation = () => {
    const context = useContext(QuotationContext);
    if (!context) {
        throw new Error('useQuotation must be used within QuotationProvider');
    }
    return context;
};
