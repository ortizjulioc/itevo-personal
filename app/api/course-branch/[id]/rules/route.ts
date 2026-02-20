import { addRulesToCourseBranch, findCourseBranchById, getRulesByCourseBranchId, updateRulesByCourseBranchId } from "@/services/course-branch-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const rules = await getRulesByCourseBranchId(id);
        if (!rules) {
            return NextResponse.json({
                code: "E_RULES_NOT_FOUND",
                message: "No se encontraron normas para la oferta académica."
            }, { status: 404 });
        }

        return NextResponse.json(rules, { status: 200 });
    } catch (error) {
        await createLog({
            action: "GET",
            description: `Error al obtener el reglamento de la oferta academica: ${formatErrorMessage(error)}`,
            origin: "course-branch/[id]/rules",
            elementId: request.headers.get("origin") || "",
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const courseBranch = await findCourseBranchById(id);
        if (!courseBranch) {
            return NextResponse.json({ code: "E_COURSE_BRANCH_NOT_FOUND", message: "No se encontró la oferta académica." }, { status: 404 });
        }

        const rules = await getRulesByCourseBranchId(id);
        if (rules) {
            const updatedCourseBranch = await updateRulesByCourseBranchId(id, {
                rules: body.rules,
            });

            await createLog({
                action: "PUT",
                description: `Se actualizó el reglamento de la oferta academica con los siguientes datos: ${JSON.stringify(body.rules, null, 2)}`,
                origin: "course-branch/[id]/rules",
                elementId: id,
                success: true,
            });
            return NextResponse.json(updatedCourseBranch, { status: 200 });
        }

        if (!rules) {
            const newRules = await addRulesToCourseBranch({
                courseBranch: { connect: { id } },
                rules: body.rules,
            });

            await createLog({
                action: "POST",
                description: `Se agregó el reglamento de la oferta academica con los siguientes datos: ${JSON.stringify(body.rules, null, 2)}`,
                origin: "course-branch/[id]/rules",
                elementId: id,
                success: true,
            });

            return NextResponse.json(newRules, { status: 201 });
        }

        throw new Error("No se pudo procesar la solicitud de normas para la oferta academica.");
    } catch (error) {
        // Enviar log de auditoría

        await createLog({
            action: "PUT",
            description: `Error al actualizar el reglamento de la oferta academica: ${formatErrorMessage(error)}`,
            origin: "course-branch/[id]/rules",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
