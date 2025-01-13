import { Prisma } from "@prisma/client";

/**
 * Formatea y devuelve un mensaje de error detallado.
 * @param error - El error a formatear.
 * @returns Un string con los detalles del error.
 */
export const formatErrorMessage = (error: unknown): string => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return `Error de base de datos: ${error.message} (Código: ${error.code})`;
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        return `Error de validación en la base de datos: ${error.message}`;
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
        return `Error al inicializar Prisma: ${error.message}`;
    }

    if (error instanceof Prisma.PrismaClientRustPanicError) {
        return "Error crítico en Prisma: se produjo un fallo interno.";
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        return "Error desconocido en Prisma.";
    }

    if (error instanceof SyntaxError) {
        return `Error de sintaxis: ${error.message}`;
    }

    if (error instanceof TypeError) {
        return `Error de tipo: ${error.message}`;
    }

    if (error instanceof ReferenceError) {
        return `Error de referencia: ${error.message}`;
    }

    if (error instanceof EvalError) {
        return `Error de evaluación: ${error.message}`;
    }

    if (error instanceof RangeError) {
        return `Error de rango: ${error.message}`;
    }

    if (error instanceof Error) {
        return `Error general: ${error.message}`;
    }

    // Si el error no es una instancia de Error, lo convertimos en JSON string
    try {
        return `Error desconocido: ${JSON.stringify(error, null, 2)}`;
    } catch {
        return "Error desconocido y no serializable.";
    }
};
