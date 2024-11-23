import { NextRequest, NextResponse } from 'next/server';
import { findPromotionById, updatePromotionById, deletePromotionById } from '@/services/promotion-service';
import { validateObject } from '@/utils';

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
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error obteniendo la promoción', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
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
        return NextResponse.json(updatedPromotion, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error actualizando la promoción', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
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
        return NextResponse.json({ message: 'Promoción eliminada correctamente' });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error eliminando la promoción', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
