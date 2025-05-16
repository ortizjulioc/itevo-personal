import apiRequest from "@/utils/lib/api-request/request";
import type { Product } from "@prisma/client";

export interface ProductResponse {
    products: Product[];
    totalProducts: number;
}

export const createProduct = async (product: Product) => {
    return await apiRequest.post<Product>('/products', product);
}

export const updateProduct = async (id: string, product: Product) => {
    return await apiRequest.put<Product>(`/products/${id}`, product);
}

export const deleteProduct = async (id: string) => {
    return await apiRequest.remove<string>(`/products/${id}`);
}
