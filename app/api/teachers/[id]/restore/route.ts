import { NextRequest, NextResponse } from 'next/server';
import { restoreTeacherById, findTeacherById } from '@/services/teacher-service';
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

        // Verificar si el maestro existe (incluyendo eliminados)
        const teacher = await findTeacherById(id, true);
        if (!teacher) {
            return NextResponse.json({ code: 'E_TEACHER_NOT_FOUND' }, { status: 404 });
        }

        // Restaurar el maestro
        await restoreTeacherById(id);

        // Enviar log de auditoría
        await createLog({
            action: 'PATCH',
            description: `Se restauró el maestro con ID ${id}. Nombre: ${teacher.firstName} ${teacher.lastName}`,
            origin: 'teachers/[id]/restore',
            elementId: id,
            success: true,
        });

        return NextResponse.json({ message: 'Maestro restaurado correctamente' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
