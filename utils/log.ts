/**
 * Registra un nuevo log en la base de datos.
 * @param logData - Datos del log a registrar.
 * @returns El log creado o un error si falla la operación.
 */
export const createLog = async (logData: {
    action: 'POST' | 'PUT' | 'DELETE' | 'GET' | 'PATCH';
    description: string;
    origin: string;
    elementId?: string;
    success: boolean;
    authorId?: string | null;
}) => {
    try {
        const log = await createLog({
            action: logData.action,
            description: logData.description,
            origin: logData.origin,
            elementId: logData.elementId,
            success: logData.success,
            authorId: logData.authorId,
        });

    return log;
} catch (error) {
    console.error("Error creando el log:", error);
    return error;
}
};
