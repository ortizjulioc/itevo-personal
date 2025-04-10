'use client';
import { confirmDialog, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import Skeleton from "@/components/common/Skeleton";
import useFetchProducts from "../../lib/use-fetch-products";
import { deleteProduct } from "../../lib/request";

interface Props {
    className?: string;
    query?: string;
}

export default function ProductList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, products, totalProducts, setProducts } = useFetchProducts(query);
    if (error) {
        openNotification('error', error);
    }

    const onDelete = async (id: string) => {

        confirmDialog({
            title: 'Eliminar producto',
            text: '¿Seguro que quieres eliminar este producto?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
            const resp = await deleteProduct(id);
            if (resp.success) {
                setProducts(products?.filter((product) => product.id !== id));
                openNotification('success', 'Producto eliminada correctamente');
                return;
            }
            openNotification('error', resp.message);
        });
    }

    if (loading) return <Skeleton rows={7} columns={['CODIGO', 'NOMBRE', 'DESCRIPCION', 'COSTO', 'PRECIO', 'STOCK']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th className="text-left">CODIGO</th>
                            <th className="text-left">Nombre</th>
                            <th className="text-left">NOMBRE</th>
                            <th className="text-left">DESCRIPCION</th>
                            <th className="text-left">COSTO</th>
                            <th className="text-left">PRECIO</th>
                            <th className="text-left">EXISTENCIA</th>

                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {products?.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron productos registrados</td>
                            </tr>
                        )}
                        {products?.map((product) => {
                            return (
                                <tr key={product.id}>
                                    <td>
                                        <div className="whitespace-nowrap">{product.code}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{product.name}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{product.description}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{product.cost}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{product.price}</div>
                                    </td>

                                    <td>
                                        <div className="whitespace-nowrap">
                                            {product.stock === 0 ? (
                                                <span className="text-red-500">Sin stock</span>
                                            ) : (
                                                <span className="text-green-500">{product.stock}</span>
                                            )}

                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            <Tooltip title="Eliminar">
                                                <Button onClick={() => onDelete(product.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/products/${product.id}`}>
                                                    <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} />
                                                </Link>
                                            </Tooltip>
                                            {/* ALTERNATIVA */}
                                            {/* <Button onClick={() => onDelete(Role.id)} variant="outline" size="sm" color="danger" >Eliminar</Button>
                                            <Link href={`/Roles/${Role.id}`}>
                                                <Button variant="outline" size="sm">Editar</Button>
                                            </Link> */}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

            </div>
            <div className="">
                <Pagination
                    currentPage={Number.parseInt(params?.page || '1')}
                    total={totalProducts}
                    top={Number.parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
