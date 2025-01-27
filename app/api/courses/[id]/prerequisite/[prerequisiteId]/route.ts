import { NextRequest, NextResponse } from 'next/server';
import { deletePrerequisite, findPrerequisiteById } from '@/services/course-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';

// Eliminar prerequisito por ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string, prerequisiteId: string } }) {
    try {
        const { id } = params;
        const { prerequisiteId } = params;

        // Verificar si el prerequisito existe en el curso

        const prerequisite = await findPrerequisiteById(id, prerequisiteId);
        if (!prerequisite) {
            return NextResponse.json({ code: 'E_PREREQUISITE_NOT_FOUND', message: 'Prerequisito no encontrado' }, { status: 404 });
        }

        // Eliminar prerequisito de un curso
        await deletePrerequisite(id, prerequisiteId);

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Se eliminó un prerequisito del curso con los siguientes datos: ${JSON.stringify(prerequisite, null, 2)}`,
            origin: "courses/[id]/prerequisite/[prerequisiteId]",
            elementId: id,
            success: true,
        });



        return NextResponse.json({ message: 'Prerequisito eliminado correctamente' });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Error al eliminar un prerequisito: ${formatErrorMessage(error)}`,
            origin: "courses/[id]/prerequisite/[prerequisiteId]",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
