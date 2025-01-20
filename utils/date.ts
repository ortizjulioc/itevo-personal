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