import 'server-only';
import { Prisma as PrismaTypes, MovementType } from '@/generated/prisma/client';
import { createLog } from '@/utils/log';

export const recordInventoryMovement = async ({
    productId,
    quantity,
    previousStock,
    newStock,
    type,
    reference,
    note,
    branchId,
    createdBy,
    tx
}: {
    productId: string;
    quantity: number;
    previousStock: number;
    newStock: number;
    type: MovementType;
    reference: string;
    note: string;
    branchId?: string | null;
    createdBy: string;
    tx: PrismaTypes.TransactionClient;
}) => {
    const movement = await tx.inventoryMovement.create({
        data: {
            productId,
            type,
            quantity,
            previousStock,
            newStock,
            reference,
            note,
            branchId,
            createdBy,
        }
    });

    await createLog({
        action: 'POST',
        description: `Movimiento de inventario: ${type === MovementType.IN ? 'ENTRADA' : type === MovementType.OUT ? 'SALIDA' : 'AJUSTE'}.\nProducto ID: ${productId}\nCant: ${quantity}\nNota: ${note}`,
        origin: 'inventory-movement',
        elementId: movement.id,
        success: true,
    });
};
