import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog, getLogsByDate, LogEntry } from '@/utils/log';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Obtener y preparar los filtros
        const date = searchParams.get("date");
        if (!date) {
            return NextResponse.json({ error: "El parámetro 'date' es obligatorio." }, { status: 400 });
        }

        const actionFilter = new Set(
            searchParams.getAll("action") as ('POST' | 'PUT' | 'DELETE' | 'GET' | 'PATCH')[]
        );
        const descriptionFilter = searchParams.get("description");
        const originFilter = searchParams.get("origin");
        const elementIdFilter = searchParams.get("elementId");
        const successFilter = searchParams.get("success") ? searchParams.get("success") === "true" : undefined;
        const authorIdFilter = searchParams.get("authorId");

        // Obtener los logs por fecha
        const logs = await getLogsByDate(date);

        // Aplicar filtros optimizados
        const filteredLogs = logs.reduce<LogEntry[]>((result, log) => {
            if (
                (actionFilter.size > 0 && !actionFilter.has(log.action)) ||
                (descriptionFilter && !log.description.includes(descriptionFilter)) ||
                (originFilter && log.origin !== originFilter) ||
                (elementIdFilter && log.elementId !== elementIdFilter) ||
                (successFilter !== undefined && (log.success ?? false) !== successFilter) ||
                (authorIdFilter && log.authorId !== authorIdFilter)
            ) {
                return result; // Si no coincide con algún filtro, se omite el log
            }
            result.push(log);
            return result;
        }, []);

        return NextResponse.json({
            logs: filteredLogs,
            totalLogs: filteredLogs.length,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// TODO: Eliminar antes de publicar, es solo para pruebas
// export async function POST(request: Request) {
//     try {
//         const body = await request.json();
//         // throw new Error('No se ha implementado la creación de logs');
//         await createLog({
//             action: 'POST',
//             description: `Se creó un nuevo log con la siguiente información: \n${JSON.stringify(body, null, 2)}`,
//             origin: 'logs',
//             elementId: 'new-log',
//             success: true,
//         });
//         return NextResponse.json(body, { status: 201 });
//     } catch (error) {
//         await createLog({
//             action: 'POST',
//             description: formatErrorMessage(error),
//             origin: 'logs',
//             success: false,
//         });
//         return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
//     }
// }
