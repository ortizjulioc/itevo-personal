import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getSettings, createSetting } from "@/services/settings-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";


export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);

        const { settings } = await getSettings(search, page, top);

        return NextResponse.json({
            settings,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('BODY: ',body);

        // Validate the request body
        const {isValid, message} = validateObject(body, ['rnc', 'companyName', 'address', 'email', 'logo', 'phone']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }
        const setting = await createSetting(body);

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Se creó un setting con los siguientes datos: ${JSON.stringify(setting, null, 2)}`,
            origin: "settings",
            elementId: setting.id,
            success: true,
        });

        return NextResponse.json(setting, { status: 201 });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Error al crear un setting: ${formatErrorMessage(error)}`,
            origin: "settings",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
