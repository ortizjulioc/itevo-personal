import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import fs from "fs/promises";
import path from "path";

interface LogData {
    action: "POST" | "PUT" | "DELETE" | "GET" | "PATCH";
    description: string;
    origin: string;
    elementId?: string;
    success?: boolean;
}

const LOGS_DIR = path.join(process.cwd(), "logs");

/**
 * Registra un nuevo log en archivos JSON, organizados por año/mes/día.
 * @param logData - Datos del log a registrar.
 */
export const createLog = async (logData: LogData): Promise<void> => {
    try {
        const session = await getServerSession(authOptions);
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const day = now.getDate().toString().padStart(2, "0");
        const logFileName = logData.success ? `acciones-${year}-${month}-${day}.json` : `errores-${year}-${month}-${day}.json`;
        const logFilePath = path.join(LOGS_DIR, year, month, day, logFileName);
        const logEntry = {
            date: now.toISOString(),
            action: logData.action,
            description: logData.description,
            origin: logData.origin,
            elementId: logData.elementId,
            authorId: session?.user?.id || "anonymous",
        };

        await fs.mkdir(path.dirname(logFilePath), { recursive: true });

        let logs: object[] = [];
        try {
            const existingLogs = await fs.readFile(logFilePath, "utf-8");
            logs = JSON.parse(existingLogs);
        } catch (err) {
            console.error("Error leyendo el archivo de logs:", err);
            if (err instanceof Error && "code" in err && err.code === "ENOENT") {
                // Si el error tiene la propiedad 'code' y es "ENOENT", lo ignoramos
                logs = [];
            } else {
                // Si el error no es un 'ENOENT' o no tiene 'code', lo lanzamos
                throw err;
            }
        }

        logs.push(logEntry);
        console.log(logEntry);

        await fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), "utf-8");
    } catch (error) {
        console.error("Error creando el log:", error);
    }
};
