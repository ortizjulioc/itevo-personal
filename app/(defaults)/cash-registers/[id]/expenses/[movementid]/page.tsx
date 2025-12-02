'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import useFetchCashMovementById from "../../../lib/use-fetch-cash-movement-by-id";
import ExpenseDetails from "../components/expense-details";
import { useSession } from "next-auth/react";
import { BILLING_ADMIN, GENERAL_ADMIN, SUPER_ADMIN } from "@/constants/role.constant";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";
import apiRequest from "@/utils/lib/api-request/request";
import { openNotification } from "@/utils";
import Swal from "sweetalert2";
import { HiOutlineTrash } from "react-icons/hi";

export default function ExpenseDetailsPage({ params }: { params: { id: string, movementid: string } }) {
    const { id, movementid } = params;
    const { loading, cashMovement } = useFetchCashMovementById(id, movementid);
    const { data: session } = useSession();
    const router = useRouter();

    const userRoles = (session?.user as any)?.roles || [];
    const canCancel = userRoles.some((role: any) =>
        [BILLING_ADMIN, GENERAL_ADMIN, SUPER_ADMIN].includes(role.normalizedName)
    );

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción anulará el movimiento de caja y no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, anular',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await apiRequest.remove(`/cash-register/${id}/cash-movements/${movementid}`);
                if (response.success) {
                    openNotification('success', 'Movimiento anulado correctamente');
                    router.push(`/cash-registers/${id}`);
                } else {
                    openNotification('error', response.message || 'Error al anular el movimiento');
                }
            } catch (error: any) {
                openNotification('error', error.message || 'Error al anular el movimiento');
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <ViewTitle title="Detalles del Egreso" showBackPage />
            </div>

            {loading && <FormSkeleton />}
            {cashMovement && (
                <ExpenseDetails
                    cashMovement={cashMovement}
                    actionButton={
                        canCancel && !loading ? (
                            <Button className="bg-red-600 hover:bg-red-700 text-white gap-2" onClick={handleDelete}>
                                <HiOutlineTrash className="text-lg" />
                                Anular Egreso
                            </Button>
                        ) : null
                    }
                />
            )}
            {!loading && !cashMovement && (
                <div className="panel p-4 text-center">
                    <p>No se encontró el movimiento de caja.</p>
                </div>
            )}
        </div>
    )
}
