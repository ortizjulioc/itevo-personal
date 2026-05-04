import 'server-only';
import { Prisma as PrismaTypes, MovementType } from '@/generated/prisma/client';

export const recordInventoryMovement = async ({
    productId,
    quantity,
    previousStock,
    newStock,
    type,
    reference,
    note,
    branchId,
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
    tx: PrismaTypes.TransactionClient;
}) => {
    await tx.inventoryMovement.create({
        data: {
            productId,
            type,
            quantity,
            previousStock,
            newStock,
            reference,
            note,
            branchId,
        }
    });
};
