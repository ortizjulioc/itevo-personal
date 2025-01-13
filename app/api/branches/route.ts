import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from "@/utils";
import { getBranches, createBranch } from '@/services/branch-service';
import { createLog } from '@/services/log-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Obtener todas las sucursales
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        console.log('GET BRANCHES: ', session);
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
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error obteniendo las sucursales', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}

// Crear una nueva sucursal

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('BODY: ', body);

        // Validate the request body
        const { isValid, message } = validateObject(body, ['name', 'address']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }

        const branch = await createBranch(body);
        // await createLog({
        //     action: 'POST',
        //     description: `Se creó la sucursal con la siguiente información: \n${JSON.stringify(branch, null, 2)}`,
        //     authorId: 'adsdsdsd',
        //     origin: 'branches',
        //     elementId: branch.id,
        //     success: true,
        // });
        return NextResponse.json(branch, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error creando la sucursal', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}

