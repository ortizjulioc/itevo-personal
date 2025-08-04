export function convertTimeFrom24To12Format(time: string): string {
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

export function getHoursDifference(startTime: string, endTime: string): number {
    // Convertir las horas a minutos para facilitar el cálculo
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    // Calcular total de minutos para cada hora
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    // Calcular la diferencia en minutos
    let diffMinutes = endTotalMinutes - startTotalMinutes;

    // Si la diferencia es negativa, asumimos que pasa al día siguiente
    if (diffMinutes < 0) {
        diffMinutes += 24 * 60; // Agregar 24 horas en minutos
    }

    // Convertir a horas con decimales
    const diffHours = diffMinutes / 60;

    return diffHours;
}

export function hoursToText(hours: number): string {
    // Obtener las horas enteras
    const fullHours = Math.floor(hours);
    // Obtener los minutos (parte decimal * 60)
    const minutes = Math.round((hours - fullHours) * 60);

    let result = '';

    // Construir la parte de las horas
    if (fullHours > 0) {
        result += `${fullHours} ${fullHours === 1 ? 'hora' : 'horas'}`;
    }

    // Agregar la parte de los minutos si existen
    if (minutes > 0) {
        if (fullHours > 0) {
            result += ' y ';
        }
        result += `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }

    // Caso especial: si es 0 horas y 0 minutos
    if (fullHours === 0 && minutes === 0) {
        result = '0 horas';
    }

    return result;
}

export function getHoursDifferenceText(startTime: string, endTime: string): string {
    const hours = getHoursDifference(startTime, endTime);
    return hoursToText(hours);
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
 * También devuelve un array con las fechas exactas en las que se impartirán clases.
 *
 * Para feriados:
 * - Si es no recurrente, se compara la fecha completa.
 * - Si es recurrente, se comparan solo el mes y el día.
 *
 * Se asume que tanto startDate como endDate deben interpretarse en hora local.
 *
 * @param startDate Fecha de inicio del curso (se recomienda crearlas con new Date(año, mes-1, día)).
 * @param endDate Fecha fin del curso.
 * @param schedules Array de objetos que contienen la propiedad `weekday` (0 = Domingo, 6 = Sábado).
 * @param holidays Array de feriados con propiedades `date` (Date) e `isRecurring` (boolean).
 * @returns Un objeto con el número de sesiones y las fechas en que se impartirá la clase.
 */
export function getClassSessions(
    startDate: Date,
    endDate: Date,
    schedules: { weekday: number; startTime: string; endTime: string }[],
    holidays: { date: Date; isRecurring: boolean }[]
): { count: number; dates: Date[] } {
    let sessionCount = 0;
    let sessionDates: Date[] = [];

    // Convertimos startDate y endDate a fechas locales (a medianoche)
    let currentDate = toLocalDate(new Date(startDate));
    const finalDate = toLocalDate(new Date(endDate));

    // Iteramos día a día desde startDate hasta endDate (inclusive)
    while (currentDate <= finalDate) {
        for (const schedule of schedules) {
            // Verificamos si el día actual coincide con un día de clase
            if (currentDate.getDay() === schedule.weekday) {
                // Revisamos si la fecha actual es un feriado
                const isHoliday = holidays.some((holiday) => {
                    const holidayLocal = toLocalDate(new Date(holiday.date));
                    return holiday.isRecurring
                        ? currentDate.getMonth() === holidayLocal.getMonth() &&
                        currentDate.getDate() === holidayLocal.getDate()
                        : currentDate.getTime() === holidayLocal.getTime();
                });

                // Si no es feriado, contamos la sesión y almacenamos la fecha
                if (!isHoliday) {
                    sessionCount++; // Contamos la sesión
                    sessionDates.push(new Date(currentDate)); // Guardamos la fecha exacta
                }
            }
        }
        // Avanzamos al día siguiente
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return { count: sessionCount, dates: sessionDates };
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getDate() === b.getDate() &&
         a.getMonth() === b.getMonth() &&
         a.getFullYear() === b.getFullYear();
}

/**
 * Calcula la fecha de finalización de un curso, dado un número de sesiones,
 * una fecha de inicio, horarios semanales y días feriados.
 *
 * @param startDate Fecha de inicio del curso.
 * @param sessionCount Número total de clases a impartir.
 * @param schedules Array de objetos con la propiedad `weekday` (0 = Domingo, 6 = Sábado).
 * @param holidays Array de feriados con propiedades `date` (Date) e `isRecurring` (boolean).
 * @returns Fecha de finalización del curso.
 */
export function getCourseEndDate(
    startDate: Date,
    sessionCount: number,
    schedules: { weekday: number; startTime: string; endTime: string }[],
    holidays: { date: Date; isRecurring: boolean }[]
): Date {
  if (schedules.length === 0) {
    // si no hay horarios, devolvemos la fecha de inicio + el número de sesiones como semanas
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + sessionCount * 7); // Asumimos que cada sesión es semanal
    return endDate;
  }

  let currentDate = toLocalDate(new Date(startDate));
  let sessionsAdded = 0;

  while (sessionsAdded < sessionCount) {
    for (const schedule of schedules) {
      if (currentDate.getDay() === schedule.weekday) {
        const isHoliday = holidays.some((holiday) => {
          const holidayDate = toLocalDate(new Date(holiday.date));
          return holiday.isRecurring
            ? currentDate.getMonth() === holidayDate.getMonth() &&
              currentDate.getDate() === holidayDate.getDate()
            : isSameDay(currentDate, holidayDate);
        });

        if (!isHoliday) {
          sessionsAdded++;
          if (sessionsAdded === sessionCount) {
            return new Date(currentDate);
          }
        }
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return new Date(currentDate); // fallback
}


/**
 * Esta función recibe un objeto Date y devuelve la hora en formato HH:mm.
 * Es útil para aplicaciones donde se necesita mostrar la hora de manera uniforme.
 *
 * @param fecha Objeto Date que representa la fecha y hora a formatear.
 * @returns Cadena de texto con la hora en formato HH:mm.
 *
 * Ejemplo de uso:
 * const fechaActual = new Date();
 * console.log(getFormattedTime(fechaActual)); // "14:30" (dependiendo de la hora actual)
 */
export function getFormattedTime(fecha: Date, options?: Intl.DateTimeFormatOptions): string {
    // Verificamos que la fecha proporcionada sea válida.
    if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
        throw new Error('Fecha inválida proporcionada.');
    }

    // Convertimos la fecha a una cadena de tiempo con formato de 24 horas (HH:mm).
    return fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',      // Asegura que la hora siempre tenga dos dígitos (ej. 09, 18).
        minute: '2-digit',    // Asegura que los minutos siempre tengan dos dígitos (ej. 05, 45).
        hour12: false,         // Usa el formato de 24 horas (ej. 14:30 en vez de 2:30 PM).
        ...options,           // Permite pasar opciones adicionales para personalizar el formato.
    });
}

export function getFormattedDate(fecha: Date, options?: Intl.DateTimeFormatOptions): string {
    // Verificamos que la fecha proporcionada sea válida.
    if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
        return 'fecha inválida';
    }

    // Convertimos la fecha a una cadena de texto con formato de fecha (DD/MM/YYYY).
    return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',       // Asegura que el día siempre tenga dos dígitos (ej. 01, 31).
        month: '2-digit',     // Asegura que el mes siempre tenga dos dígitos (ej. 01, 12).
        year: 'numeric',       // Usa el formato de año completo (ej. 2022 en vez de 22).
        ...options
    });
}

export function getFormattedDateTime(fecha: Date, options?: Intl.DateTimeFormatOptions): string {
    // Verificamos que la fecha proporcionada sea válida.
    if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
        return 'fecha inválida';
    }

    // Convertimos la fecha a una cadena de texto con formato de fecha y hora.
    return `${getFormattedDate(fecha, options)} ${getFormattedTime(fecha, options)}`;
}
