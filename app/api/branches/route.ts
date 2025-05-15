import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from "@/utils";
import { getBranches, createBranch } from '@/services/branch-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';

// Obtener todas las sucursales
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);

        const { branches, totalBranches } = await getBranches(search, page, top);

        return NextResponse.json({
            branches,
            totalBranches,
        } , { status: 200 });
    } catch (error) {
        await createLog({
            action: 'GET',
            description: formatErrorMessage(error),
            origin: 'branches',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

// Crear una nueva sucursal

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate the request body
        const { isValid, message } = validateObject(body, ['name', 'address']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        const branch = await createBranch(body);
        await createLog({
            action: 'POST',
            description: `Se creó la sucursal con la siguiente información: \n${JSON.stringify(branch, null, 2)}`,
            origin: 'branches',
            elementId: branch.id,
            success: true,
        });
        return NextResponse.json(branch, { status: 201 });
    } catch (error) {
        await createLog({
            action: 'POST',
            description: formatErrorMessage(error),
            origin: 'branches',
            success: false,
        });
        return NextResponse.json({  error: formatErrorMessage(error) }, { status: 500 });
    }
}

