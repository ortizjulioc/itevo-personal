'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { objectToQueryString } from '@/utils';
import EnrollmentList from '../../enrollments/components/enrollment-list';
import SearchEnrollments from '../../enrollments/components/search-enrollment';
import EnrollmentSummaryCards from '../../enrollments/components/enrollment-summary';
import useFetchPromotionEnrollments from '../lib/use-fetch-promotion-enrollments';
import { ViewTitle } from '@/components/common';
import { Button } from '@/components/ui';
import { HiOutlineFilter, HiX } from 'react-icons/hi';
import React, { useState } from 'react';

export default function PromotionEnrollments({ promotionId }: { promotionId: string }) {
    const params = useSearchParams();
    const router = useRouter();
    const [showFilters, setShowFilters] = useState(false);

    // Filter using URL parameters (managed by SearchEnrollments)
    const query = objectToQueryString(Object.fromEntries(params.entries()));

    const { enrollments, totalEnrollments, summary, loading, error, setEnrollments } = useFetchPromotionEnrollments(promotionId, query);

    return (
        <div className="mt-10">
            <ViewTitle
                className="mb-6"
                title="Inscripciones de la Promoción"
                rightComponent={
                    <Button
                        icon={showFilters ? <HiX /> : <HiOutlineFilter />}
                        color={showFilters ? 'danger' : 'success'}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                    </Button>
                }
            />

            <EnrollmentSummaryCards summary={summary} loading={loading} />

            {showFilters && (
                <div className="mt-4">
                    <SearchEnrollments />
                </div>
            )}
            
            <EnrollmentList
                query={query}
                enrollments={enrollments}
                totalEnrollments={totalEnrollments}
                loading={loading}
                error={error}
                setEnrollments={setEnrollments}
            />
        </div>
    );
}
