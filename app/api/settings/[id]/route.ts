import { NextRequest, NextResponse } from 'next/server';
import { updateSettingById } from '@/services/settings-service';
import { validateObject } from '@/utils';


// Actualizar la configuracion de empresa por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validar el cuerpo de la solicitud (usando la validación existente)
        const { isValid, message } = validateObject(body, ['rnc', 'companyName', 'address', 'email', 'logo', 'phone']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        // Actualizar la configuracion de empresa
        const updatedSetting = await updateSettingById(id, body);

        return NextResponse.json(updatedSetting);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error actualizando la configuracion de empresa', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
