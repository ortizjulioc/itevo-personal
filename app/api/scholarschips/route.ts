import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from '@/utils';
import { getScholarships, createScholarship } from '@/services/scholarship-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);

        const { scholarships, totalScholarships } = await getScholarships(search, page, top);

        return NextResponse.json(
            {
                data: scholarships,
                total: totalScholarships,
            },
            { status: 200 }
        );
    } catch (error) {
        await createLog({
            action: 'GET',
            description: formatErrorMessage(error),
            origin: 'scholarships',
        });
    }
}

//--------------------------------------------------------------------------------
// Crear una nueva beca
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validar el cuerpo de la solicitud
        const { isValid, message } = validateObject(body, ['name']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        const scholarship = await createScholarship(body);
        await createLog({
            action: 'POST',
            description: `Se creó la beca con la siguiente información: \n${JSON.stringify(scholarship, null, 2)}`,
            origin: 'scholarships',
            elementId: scholarship.id,
            success: true,
        });
        return NextResponse.json(scholarship, { status: 201 });
    } catch (error) {
        await createLog({
            action: 'POST',
            description: formatErrorMessage(error),
            origin: 'scholarships',
            success: false,
        });
        return NextResponse.json({ code: 'E_INTERNAL_SERVER', message: 'Error interno del servidor' }, { status: 500 });
    }
}
