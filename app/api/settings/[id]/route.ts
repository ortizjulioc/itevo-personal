import { NextRequest, NextResponse } from 'next/server';
import { updateSettingById } from '@/services/settings-service';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';


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

        // Enviar log de auditoría

        await createLog({
            action: "PUT",
            description: `Se actualizó la configuración de empresa. Información anterior: ${JSON.stringify(body, null, 2)}. Información actualizada: ${JSON.stringify(updatedSetting, null, 2)}`,
            origin: "settings/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json(updatedSetting, { status: 200 });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "PUT",
            description: `Error al actualizar la configuración de empresa: ${formatErrorMessage(error)}`,
            origin: "settings/[id]",
            elementId: params.id,
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
