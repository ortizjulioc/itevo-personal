import { NextRequest, NextResponse } from 'next/server';
import { deletePrerequisite, findPrerequisiteById } from '@/services/course-service';

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


        return NextResponse.json({ message: 'Prerequisito eliminado correctamente' });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error eliminando el prerequisito', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
