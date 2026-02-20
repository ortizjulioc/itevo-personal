'use client';
import React from 'react';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { useFetchProductsById } from "../lib/use-fetch-products";
import UpdateProductForm from "../components/product-forms/update-form";



export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { loading, product } = useFetchProductsById(id);
    return (
        <div>
            <ViewTitle className='mb-6' title="Editar Producto" showBackPage />

            {loading && <FormSkeleton />}
            {product && <UpdateProductForm initialValues={product} />}
        </div>
    )
}
