import { NextRequest, NextResponse } from 'next/server';
import { findPromotionById, updatePromotionById, deletePromotionById } from '@/services/promotion-service';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';

// Obtener promoción por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const promotion = await findPromotionById(id);

        if (!promotion) {
            return NextResponse.json({ code: 'E_PROMOTION_NOT_FOUND', message: 'Promoción no encontrada' }, { status: 404 });
        }

        return NextResponse.json(promotion, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// Actualizar promoción por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        const { isValid, message } = validateObject(body, ['description', 'startDate', 'endDate']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        const promotion = await findPromotionById(id);
        if (!promotion) {
            return NextResponse.json({ code: 'E_PROMOTION_NOT_FOUND', message: 'Promoción no encontrada' }, { status: 404 });
        }

        const updatedPromotion = await updatePromotionById(id, body);

        // Enviar log de auditoría

        await createLog({
            action: "PUT",
            description: `Se actualizó una promoción. Información anterior: ${JSON.stringify(promotion, null, 2)}. Información actualizada: ${JSON.stringify(updatedPromotion, null, 2)}`,
            origin: "promotions/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json(updatedPromotion, { status: 200 });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "PUT",
            description: `Error al actualizar una promoción: ${formatErrorMessage(error)}`,
            origin: "promotions/[id]",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// Eliminar promoción por ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const promotion = await findPromotionById(id);
        if (!promotion) {
            return NextResponse.json({ code: 'E_PROMOTION_NOT_FOUND', message: 'Promoción no encontrada' }, { status: 404 });
        }

        await deletePromotionById(id);

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Se eliminó una promoción con los siguientes datos: ${JSON.stringify(promotion, null, 2)}`,
            origin: "promotions/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json({ message: 'Promoción eliminada correctamente' });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Error al eliminar una promoción: ${formatErrorMessage(error)}`,
            origin: "promotions/[id]",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
