import { NcfType, PrismaClient, Prisma as PrismaTypes } from '@/generated/prisma/client';

// Mapeo de NcfType a sus códigos de dos dígitos
export const ncfTypeToCode: Record<NcfType, string> = {
    FACTURA_CREDITO_FISCAL: "01",
    FACTURA_CONSUMO: "02",
    NOTA_DEBITO: "03",
    NOTA_CREDITO: "04",
    COMPROBANTE_COMPRAS: "11",
    REGISTRO_UNICO_INGRESOS: "12",
    GASTOS_MENORES: "13",
    REGIMENES_ESPECIALES: "14",
    GUBERNAMENTAL: "15",
    EXPORTACION: "16",
    PAGO_EXTERIOR: "17",
};

/**
 * Genera un NCF único para un tipo y caja específicos, manejando colisiones.
 * @param tx Prisma Transaction Client
 * @param ncfType Tipo de NCF requerido
 * @returns NCF generado
 */
export async function generateNcf(tx: PrismaClient | PrismaTypes.TransactionClient, ncfType: NcfType, branchId?: string | null): Promise<string> {
    const maxRetries = 5;
    let attempt = 0;

    while (attempt < maxRetries) {
        const ncfRange = await tx.ncfRange.findFirst({
            where: {
                isActive: true,
                type: ncfType,
                ...(branchId ? { branchId } : {}),
            },
            orderBy: { startSequence: 'asc' },
            select: { id: true, prefix: true, currentSequence: true, endSequence: true, startSequence: true },
        });

        if (!ncfRange) throw new Error(`No hay rangos de NCF activos disponibles para el tipo ${ncfType}`);

        // Si el rango ya está agotado pero sigue activo, inactivarlo y buscar otro
        if (ncfRange.currentSequence >= ncfRange.endSequence) {
            await tx.ncfRange.update({
                where: { id: ncfRange.id },
                data: { isActive: false },
            });
            attempt++;
            continue;
        }

        const newSequence = Math.max(ncfRange.currentSequence + 1, ncfRange.startSequence);
        const typeCode = ncfTypeToCode[ncfType];
        const ncf = `${ncfRange.prefix}${typeCode}${newSequence.toString().padStart(8, '0')}`;

        const isLimitReached = newSequence >= ncfRange.endSequence;

        // Verificar si el NCF ya existe (colisión); si es así, avanzar la secuencia y reintentar
        const ncfExists = await tx.invoice.findUnique({ where: { ncf } });
        if (ncfExists) {
            await tx.ncfRange.update({
                where: { id: ncfRange.id },
                data: {
                    currentSequence: newSequence,
                    ...(isLimitReached && { isActive: false }),
                },
            });
            attempt++;
            continue;
        }

        await tx.ncfRange.update({
            where: { id: ncfRange.id },
            data: {
                currentSequence: newSequence,
                ...(isLimitReached && { isActive: false }),
            },
        });

        return ncf;
    }

    throw new Error(`No se pudo generar un NCF único para el tipo ${ncfType} tras ${maxRetries} intentos`);
}
