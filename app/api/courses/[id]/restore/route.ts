import { NextRequest, NextResponse } from 'next/server';
import { restoreCourseById, findCourseById } from '@/services/course-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/auth-options';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const isSuperAdmin = session?.user?.roles?.some((role: any) => role.normalizedName === 'super_admin');

        if (!isSuperAdmin) {
            return NextResponse.json({ error: 'No tienes permisos para realizar esta acción' }, { status: 403 });
        }

        const { id } = await params;

        // Verificar si el curso existe (incluyendo eliminados)
        const course = await findCourseById(id, true);
        if (!course) {
            return NextResponse.json({ code: 'E_COURSE_NOT_FOUND' }, { status: 404 });
        }

        // Restaurar el curso
        await restoreCourseById(id);

        // Enviar log de auditoría
        await createLog({
            action: 'PATCH',
            description: `Se restauró el curso con ID ${id}. Nombre: ${course.name}`,
            origin: 'courses/[id]/restore',
            elementId: id,
            success: true,
        });

        return NextResponse.json({ message: 'Curso restaurado correctamente' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
