'use client';

import React from 'react';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { useFetchPromotionsById } from "../../lib/use-fetch-promotions";
import PromotionEnrollments from "../../components/promotion-enrollments";
import { getFormattedDate } from '@/utils/date';

export default function ViewPromotion({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { loading, promotion } = useFetchPromotionsById(id);

    return (
        <div>
            <ViewTitle className='mb-6' title="Detalles de Promoción" showBackPage />

            {loading && <FormSkeleton />}
            {promotion && (
                <>
                    <div className="panel mb-8">
                        <h5 className="text-lg font-semibold dark:text-white-light mb-4">{promotion.description}</h5>
                        <div className="flex gap-4">
                            <div>
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Desde: </span>
                                <span>{promotion.startDate ? getFormattedDate(new Date(promotion.startDate)) : 'N/A'}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Hasta: </span>
                                <span>{promotion.endDate ? getFormattedDate(new Date(promotion.endDate)) : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <PromotionEnrollments promotionId={id} />
                </>
            )}
        </div>
    )
}
