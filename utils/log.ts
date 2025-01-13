import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient, Log } from "@prisma/client";
import { getServerSession } from "next-auth";
import { formatErrorMessage } from "./error-to-string";

const prisma = new PrismaClient();

/**
 * Registra un nuevo log en la base de datos.
 * @param logData - Datos del log a registrar.
 * @returns El log creado o un error si falla la operación.
 */
export const createLog = async (logData: {
    action: "POST" | "PUT" | "DELETE" | "GET" | "PATCH";
    description: string;
    origin: string;
    elementId?: string;
    success: boolean;
}): Promise<Log | null> => {
    try {

        const session = await getServerSession(authOptions);
        const log = await prisma.log.create({
            data: {
                action: logData.action,
                description: logData.description,
                origin: logData.origin,
                elementId: logData.elementId,
                success: logData.success,
                authorId: session?.user?.id,
            },
        });
        return log;

    } catch (error) {
        console.error("Error creando el log:", formatErrorMessage(error));
        return null; // Retornar `null` en caso de error en lugar del objeto `error`
    }
};
