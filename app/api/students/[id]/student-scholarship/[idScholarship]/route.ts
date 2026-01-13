import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from '@/utils';

import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';

import { findStudentScholarshipById, updateStudentScholarshipById, deleteStudentScholarshipById } from '@/services/studentScholarship-service';

export async function DELETE(request: NextRequest, { params }: { params: { id: string; idScholarship: string } }) {
    try {
        const { idScholarship } = params;
        console.log("......................wwwwwwwwwwwwww",params);

        const deletedStudentScholarship = await deleteStudentScholarshipById(idScholarship);
        console.log(idScholarship);
        await createLog({
            action: 'DELETE',
            description: `Se eliminó la beca asignada al estudiante con la siguiente información: \n${JSON.stringify(deletedStudentScholarship, null, 2)}`,
            origin: 'student-scholarships',
            elementId: deletedStudentScholarship.id,
            success: true,
        });
        return NextResponse.json(deletedStudentScholarship, { status: 200 });
    } catch (error) {
        console.log(error);
        await createLog({
            action: 'DELETE',
            description: formatErrorMessage(error),
            origin: 'student-scholarships',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
