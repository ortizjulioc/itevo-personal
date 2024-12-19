import { NextRequest, NextResponse } from 'next/server';
import { findCourseBranchById, updateCourseBranchById, deleteCourseBranchById } from '@/services/course-branch-service';
import { validateObject } from '@/utils';

// Obtener courseBranch por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const courseBranch = await findCourseBranchById(id);

        if (!courseBranch) {
            return NextResponse.json({ code: 'E_COURSE_BRANCH_NOT_FOUND', message: 'Course branch no encontrado' }, { status: 404 });
        }

        return NextResponse.json(courseBranch, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error buscando el curso', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}

// Actualizar courseBranch por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validar el cuerpo de la solicitud (usando la validación existente)
        const { isValid, message } = validateObject(body, ['promotionId', 'branchId', 'teacherId', 'courseId']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        // Verificar si el course existe
        const courseBranch = await findCourseBranchById(id);
        if (!courseBranch) {
            return NextResponse.json({ code: 'E_COURSE_NOT_FOUND', message: 'Course branch no encontrado' }, { status: 404 });
        }

        // Actualizar el course
        const updatedCourseBranch = await updateCourseBranchById(id, body);

        return NextResponse.json(updatedCourseBranch, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error actualizando el course branch', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}

// Eliminar course por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Verificar si el rol existe
        const courseBranch = await findCourseBranchById(id);
        if (!courseBranch) {
            return NextResponse.json({ code: 'E_COURSE_NOT_FOUND', message: 'courseBranch no encontrado' }, { status: 404 });
        }

        // Eliminar el courseBranch
        await deleteCourseBranchById(id);

        return NextResponse.json({ message: 'courseBranch eliminado correctamente' });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error eliminando el courseBranch', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
