import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import type { Product } from "@prisma/client";

export interface ProductsResponse {
    products: Product[];
    totalProducts: number;
}

const useFetchProducts = (query: string) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductsData = async (query: string) => {
            try {
                const response = await apiRequest.get<ProductsResponse>(`/products?${query}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setProducts(response.data?.products || []);
                setTotalProducts(response.data?.totalProducts || 0);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener los productos');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProductsData(query);
    }, [query]);

    return { products, setTotalProducts, loading, error, setProducts, totalProducts };
};

export const useFetchProductsById = (id: string) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductData = async (id: string) => {
            try {
                const response = await apiRequest.get<Product>(`/products/${id}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setProduct(response.data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener el producto');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProductData(id);
    }, [id]);

    return { product, loading, error, setProduct };
}

export default useFetchProducts;
