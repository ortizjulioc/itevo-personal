'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import useFetchCashMovementById from "../../../lib/use-fetch-cash-movement-by-id";
import ExpenseDetails from "../components/expense-details";

export default function ExpenseDetailsPage({ params }: { params: { id: string, movementid: string } }) {
    const { id, movementid } = params;
    const { loading, cashMovement } = useFetchCashMovementById(id, movementid);

    return (
        <div>
            <ViewTitle className='mb-6' title="Detalles del Egreso" showBackPage />

            {loading && <FormSkeleton />}
            {cashMovement && <ExpenseDetails cashMovement={cashMovement} />}
            {!loading && !cashMovement && (
                <div className="panel p-4 text-center">
                    <p>No se encontró el movimiento de caja.</p>
                </div>
            )}
        </div>
    )
}
