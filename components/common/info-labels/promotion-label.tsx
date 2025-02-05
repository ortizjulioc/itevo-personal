import { Promotion } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import apiRequest from '@/utils/lib/api-request/request';

export default function PromotionLabel({ promotionId }: { promotionId: string }) {
    const [promotion, setPromotion] = useState<Promotion | null>(null);

    const fetchPromotionById = async () => {
        try {
            const response = await apiRequest.get<Promotion>(`/promotions/${promotionId}`);
            console.log('response:', response)
            if (response.success && response.data) {
                setPromotion(response.data);
            }
        } catch (error) {
            console.error('Error fetching single promotion:', error);
        }
    };

    useEffect(() => {
        fetchPromotionById();
    }, []);

    return (
        <span >{promotion ?  promotion?.description  : '...'}</span>
    )
}
