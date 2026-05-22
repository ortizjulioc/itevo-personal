'use client';
import React from 'react';
import { ViewTitle } from "@/components/common";
import { useFetchProductsById } from "../../lib/use-fetch-products";
import { formatCurrency } from "@/utils";
import { MovementType, InventoryMovement, Product } from '@/generated/prisma/client';
import Skeleton from "@/components/common/Skeleton";

interface ProductWithMovements extends Product {
    movements?: InventoryMovement[];
}

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { loading, product, error } = useFetchProductsById(id, true);

    const productWithMovements = product as ProductWithMovements | null;

    if (loading) return <Skeleton rows={7} columns={['FECHA', 'TIPO', 'CANTIDAD', 'STOCK ANTERIOR', 'NUEVO STOCK', 'NOTA']} />;
    if (error) return <div className="p-5 text-danger">{error}</div>;
    if (!productWithMovements) return <div className="p-5">Producto no encontrado.</div>;

    const formatDate = (dateString: Date | string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-DO', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: true
        }).format(date);
    };

    return (
        <div>
            <ViewTitle className='mb-6' title="Detalle de Producto" showBackPage />

            <div className="flex flex-col xl:flex-row gap-6 mb-6">
                <div className="flex flex-col gap-6 w-full xl:w-1/3">
                    <div className="panel">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Información General</h5>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between">
                                <span className="font-semibold text-white-dark">Código:</span>
                                <span>{productWithMovements.code}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-white-dark">Nombre:</span>
                                <span>{productWithMovements.name}</span>
                            </div>
                            <div className="flex flex-col gap-1 mt-2">
                                <span className="font-semibold text-white-dark">Descripción:</span>
                                <span className="text-sm">{productWithMovements.description || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Inventario y Precios</h5>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between">
                                <span className="font-semibold text-white-dark">Costo:</span>
                                <span>{formatCurrency(productWithMovements.cost)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-white-dark">Precio:</span>
                                <span className="font-bold">{formatCurrency(productWithMovements.price)}</span>
                            </div>
                            <div className="flex justify-between mt-2 pt-2 border-t border-white-light dark:border-[#1b2e4b]">
                                <span className="font-semibold text-white-dark">Existencia Actual:</span>
                                <span className={`font-bold ${productWithMovements.stock <= 0 ? 'text-danger' : 'text-success'}`}>
                                    {productWithMovements.stock}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel flex-1">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Historial de Movimientos</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table-hover">
                            <thead>
                                <tr>
                                    <th>FECHA</th>
                                    <th>TIPO</th>
                                    <th>CANTIDAD</th>
                                    <th>STOCK ANTERIOR</th>
                                    <th>NUEVO STOCK</th>
                                    <th>NOTA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!productWithMovements.movements || productWithMovements.movements.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center italic text-gray-500">No hay movimientos registrados.</td>
                                    </tr>
                                ) : (
                                    productWithMovements.movements.map((movement) => (
                                        <tr key={movement.id}>
                                            <td className="whitespace-nowrap">{formatDate(movement.createdAt)}</td>
                                            <td>
                                                <span className={`badge ${movement.type === MovementType.IN ? 'bg-success' : movement.type === MovementType.OUT ? 'bg-danger' : 'bg-warning'}`}>
                                                    {movement.type === MovementType.IN ? 'ENTRADA' : movement.type === MovementType.OUT ? 'SALIDA' : 'AJUSTE'}
                                                </span>
                                            </td>
                                            <td className="font-bold">{movement.quantity}</td>
                                            <td>{movement.previousStock}</td>
                                            <td>{movement.newStock}</td>
                                            <td>{movement.note || '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
