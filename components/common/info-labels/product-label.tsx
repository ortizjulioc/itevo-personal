import { Product } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import apiRequest from '@/utils/lib/api-request/request';



export default function ProductLabel({ ProductId }: { ProductId: string|null }) {
    const [product, setProduct] = useState<Product | null>(null);

    const fetchProductById = async () => {
        try {
            const response = await apiRequest.get<Product>(`/products/${ProductId}`);
            
            if (response.success && response.data) {
                setProduct(response.data);
            }
        } catch (error) {
            console.error('Error fetching single Product:', error);
        }
    };

    useEffect(() => {
        fetchProductById();
    }, []);

    return (
        <span >{product ?  product?.name  : '...'}</span>
    )
}
