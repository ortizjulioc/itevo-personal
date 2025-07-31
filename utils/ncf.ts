import { NcfType, PrismaClient, Prisma as PrismaTypes } from "@prisma/client";

// Mapeo de NcfType a sus códigos de dos dígitos
const ncfTypeToCode: Record<NcfType, string> = {
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
export async function generateNcf(tx: PrismaClient | PrismaTypes.TransactionClient, ncfType: NcfType): Promise<string> {
    const maxRetries = 5; // Límite de reintentos para evitar bucles infinitos
    let attempt = 0;

    while (attempt < maxRetries) {
        // Buscar el primer rango activo disponible
        const ncfRange = await tx.ncfRange.findFirst({
            where: {
                isActive: true,
                type: ncfType,
            },
            orderBy: { currentSequence: 'asc' },
            select: { id: true, prefix: true, currentSequence: true, endSequence: true },
        });

        if (!ncfRange) throw new Error(`No hay rangos de NCF activos disponibles para el tipo ${ncfType}`);

        // Validar que hay secuencias disponibles
        if (ncfRange.currentSequence >= ncfRange.endSequence) throw new Error(`El rango de NCF ${ncfRange.prefix} para ${ncfType} ha alcanzado su límite (${ncfRange.endSequence})`);

        const newSequence = ncfRange.currentSequence + 1;
        const typeCode = ncfTypeToCode[ncfType];
        const ncf = `${ncfRange.prefix}${typeCode}${newSequence.toString().padStart(8, '0')}`;

        // Verificar si el NCF ya existe
        const ncfExists = await tx.invoice.findUnique({ where: { ncf } });
        if (ncfExists) {
            attempt++;
            continue; // Reintentar con el siguiente número
        }

        // Actualizar la secuencia en el rango
        await tx.ncfRange.update({
            where: { id: ncfRange.id },
            data: { currentSequence: newSequence },
        });

        return ncf; // NCF generado exitosamente
    }

    throw new Error(`No se pudo generar un NCF único para el tipo ${ncfType} tras ${maxRetries} intentos`);
}
