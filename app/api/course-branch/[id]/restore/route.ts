import { NextRequest, NextResponse } from 'next/server';
import { restoreCourseBranchById, findCourseBranchById } from '@/services/course-branch-service';
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

        // Verificar si la oferta existe (incluyendo eliminadas)
        const courseBranch = await findCourseBranchById(id, true);
        if (!courseBranch) {
            return NextResponse.json({ code: 'E_COURSE_BRANCH_NOT_FOUND' }, { status: 404 });
        }

        // Restaurar
        await restoreCourseBranchById(id);

        // Enviar log de auditoría
        await createLog({
            action: 'PATCH',
            description: `Se restauró la oferta académica con ID ${id}. Curso: ${courseBranch.course?.name}`,
            origin: 'course-branch/[id]/restore',
            elementId: id,
            success: true,
        });

        return NextResponse.json({ message: 'Oferta académica restaurada correctamente' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
