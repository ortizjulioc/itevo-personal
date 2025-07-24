import { getServerSession } from "next-auth";
import fs from "fs/promises";
import path from "path";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

interface LogData {
    action: "POST" | "PUT" | "DELETE" | "GET" | "PATCH";
    description: string;
    origin: string;
    elementId?: string;
    success?: boolean;
}

export interface LogEntry {
    date: string;
    action: "POST" | "PUT" | "DELETE" | "GET" | "PATCH";
    description: string;
    origin: string;
    elementId?: string;
    authorId: string;
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
            authorId: session?.user?.id || "system", // Usar "system" si no hay sesión
        };

        await fs.mkdir(path.dirname(logFilePath), { recursive: true });

        let logs: object[] = [];
        try {
            const existingLogs = await fs.readFile(logFilePath, "utf-8");
            logs = JSON.parse(existingLogs);
        } catch (err) {
            if (err instanceof Error && "code" in err && err.code === "ENOENT") {
                // Si el error tiene la propiedad 'code' y es "ENOENT", lo ignoramos
                logs = [];
            } else {
                // Si el error no es un 'ENOENT' o no tiene 'code', lo lanzamos
                throw err;
            }
        }

        logs.push(logEntry);

        await fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), "utf-8");
    } catch (error) {
        console.error("Error creando el log:", error);
    }
};

/**
 * Obtiene los logs de un día específico.
 * @param date - Fecha en formato "YYYY-MM-DD".
 * @returns Un array con los logs encontrados.
 */
export const getLogsByDate = async (date: string): Promise<LogEntry[]> => {
    try {
        const [year, month, day] = date.split("-");

        if (!year || !month || !day) {
            throw new Error("Formato de fecha inválido. Usa 'YYYY-MM-DD'.");
        }

        const logFileNames = [
            { file: `acciones-${year}-${month}-${day}.json`, success: true },
            { file: `errores-${year}-${month}-${day}.json`, success: false }
        ];

        let allLogs: LogEntry[] = [];

        for (const logFile of logFileNames) {
            const logFilePath = path.join(LOGS_DIR, year, month, day, logFile.file);

            try {
                const fileContent = await fs.readFile(logFilePath, "utf-8");
                const logs: LogEntry[] = JSON.parse(fileContent).map((log: LogEntry) => ({
                    ...log,
                    success: logFile.success, // Agregamos la propiedad success según el archivo
                }));
                allLogs = allLogs.concat(logs);
            } catch (err) {
                if (err instanceof Error && (err as NodeJS.ErrnoException).code === "ENOENT") {
                    console.warn(`Archivo no encontrado: ${logFilePath}`);
                    continue; // Si el archivo no existe, seguimos con el siguiente
                } else {
                    throw err; // Si es otro error, lo lanzamos
                }
            }
        }

        return allLogs;
    } catch (error) {
        console.error("Error obteniendo logs:", error);
        throw error;
    }
};
