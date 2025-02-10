export function convertToAmPm(time: string): string {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(time)) {
        throw new Error("Formato de hora inválido. Debe ser 'HH:mm'.");
    }

    const [hourString, minute] = time.split(":");
    const hour = parseInt(hourString, 10);
    const period = hour < 12 ? "AM" : "PM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${period}`;
}

/**
 * Convierte una fecha en formato Date a una nueva fecha local (a las 00:00:00)
 * usando sus componentes (año, mes y día).
 */
function toLocalDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Calcula el número de sesiones (clases) que se impartirán entre startDate y endDate,
 * considerando los horarios y los días feriados.
 *
 * Para feriados:
 * - Si es no recurrente se compara la fecha completa.
 * - Si es recurrente se comparan sólo el mes y el día.
 *
 * Se asume que tanto startDate como endDate deben interpretarse en hora local.
 *
 * @param startDate Fecha de inicio del curso (se recomienda crearlas con new Date(año, mes-1, día))
 * @param endDate Fecha fin del curso.
 * @param schedules Array de objetos que contienen la propiedad `weekday` (0 = Domingo, 6 = Sábado).
 * @param holidays Array de feriados con propiedades `date` (Date) e `isRecurring` (boolean).
 * @returns Número de sesiones en las que se impartirá la clase.
 */
export function countClassSessions(
    startDate: Date,
    endDate: Date,
    schedules: { weekday: number; startTime: string; endTime: string }[],
    holidays: { date: Date; isRecurring: boolean }[]
): number {
    let sessionCount = 0;

    // Convertimos startDate y endDate a fechas locales (a medianoche)
    let currentDate = toLocalDate(startDate);
    const finalDate = toLocalDate(endDate);

    // Iteramos día a día desde startDate hasta endDate (inclusive)
    while (currentDate <= finalDate) {
        // Para cada día, revisamos cada horario definido
        for (const schedule of schedules) {
            if (currentDate.getDay() === schedule.weekday) {
                // Verificamos si este día es feriado
                const isHoliday = holidays.some((holiday) => {
                    // Convertimos el feriado a fecha local (ignorando la hora)
                    const holidayLocal = toLocalDate(holiday.date);
                    if (holiday.isRecurring) {
                        // Para feriados recurrentes comparamos mes y día
                        return (
                            currentDate.getMonth() === holidayLocal.getMonth() &&
                            currentDate.getDate() === holidayLocal.getDate()
                        );
                    } else {
                        // Para feriados no recurrentes comparamos la fecha completa
                        return currentDate.getTime() === holidayLocal.getTime();
                    }
                });

                if (!isHoliday) {
                    sessionCount++;
                }
            }
        }
        // Avanzamos al día siguiente
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return sessionCount;
}
