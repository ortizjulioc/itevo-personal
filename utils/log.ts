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
    branchId: string;
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
            authorId: session?.user?.id || "unknown",
            branchId: session?.user?.activeBranchId || session?.user?.mainBranch?.id || session?.user?.branches?.[0]?.id || "unknown"
        };

        await fs.mkdir(path.dirname(logFilePath), { recursive: true });

        // Usamos appendFile para que sea atómico y eficiente
        // Cada entrada es una línea JSON independiente (JSONL)
        await fs.appendFile(logFilePath, JSON.stringify(logEntry) + "\n", "utf-8");
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
                if (!fileContent.trim()) continue;

                let logs: LogEntry[] = [];

                // Lector Híbrido: Detectar si es un Array JSON antiguo o JSONL nuevo
                if (fileContent.trim().startsWith("[")) {
                    try {
                        logs = JSON.parse(fileContent);
                    } catch (parseError) {
                        // Si falla el parseo (corrupción), intentamos rescatar objetos línea por línea
                        console.warn(`Archivo corrupto detectado, intentando rescate: ${logFilePath}`);
                        logs = rescueLogsFromCorruptedFile(fileContent);
                    }
                } else {
                    // Formato JSONL (una línea por objeto)
                    logs = fileContent.split("\n")
                        .map(line => line.trim())
                        .filter(line => line.length > 0)
                        .map(line => {
                            try { return JSON.parse(line); } 
                            catch { return null; }
                        })
                        .filter(l => l !== null);
                }

                const mappedLogs = logs.map((log: LogEntry) => ({
                    ...log,
                    success: logFile.success,
                }));

                allLogs = allLogs.concat(mappedLogs);
            } catch (err) {
                if (err instanceof Error && (err as NodeJS.ErrnoException).code === "ENOENT") {
                    continue; 
                } else {
                    throw err;
                }
            }
        }

        return allLogs;
    } catch (error) {
        console.error("Error obteniendo logs:", error);
        throw error;
    }
};

/**
 * Intenta rescatar objetos JSON de un archivo que ya no es un JSON válido 
 * (ej. múltiples arrays concatenados o texto extra)
 */
function rescueLogsFromCorruptedFile(content: string): LogEntry[] {
    const rescued: LogEntry[] = [];
    // Buscamos patrones que parezcan objetos JSON de log
    // Una forma simple es buscar por líneas que empiecen con '{' y terminen con '},' o '}'
    // O usar un regex más agresivo
    const lines = content.split("\n");
    let currentObject = "";
    
    for (let line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("{") || currentObject !== "") {
            currentObject += line;
            if (trimmed.endsWith("}") || trimmed.endsWith("},")) {
                try {
                    const cleanObj = currentObject.trim().replace(/,$/, "");
                    const obj = JSON.parse(cleanObj);
                    if (obj.date && obj.action) {
                        rescued.push(obj);
                    }
                    currentObject = "";
                } catch {
                    // No es un objeto completo aún, seguimos acumulando
                }
            }
        }
    }
    return rescued;
}
