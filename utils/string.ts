type Schedule = {
  schedule: {
    startTime: string; // "08:00"
    endTime: string;   // "10:00"
    weekday: number;   // 0=Domingo, 1=Lunes, ..., 6=Sábado
  };
};

export const formatPhoneNumber = (phone?: string | null): string => {
  // Si no hay número de teléfono, retornamos un string vacío
  if (!phone) {
    return '';
  }
  // Eliminar caracteres no numéricos
  const cleaned = phone.replace(/\D/g, '');

  // Verificar si tiene la longitud adecuada (10 dígitos)
  if (cleaned.length === 10) {
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
  }

  // Si no tiene la longitud esperada o no es válido, retornamos el número sin cambios
  return phone;
}

export const getInitials = (name?: string | null, lastName?: string | null): string => {
  // Verificar si name o lastName son nulos o indefinidos, y asignar un valor por defecto
  const firstInitial = name ? name[0].toUpperCase() : '';
  const lastInitial = lastName ? lastName[0].toUpperCase() : '';
  
  return `${firstInitial}${lastInitial}`;
}


export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function base64ToUint8Array(base64: string): Uint8Array {
  return new Uint8Array(Buffer.from(base64, 'base64'));
}

export function formatScheduleList(schedules: Schedule[]): string {
  const weekdays = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];

  const formatTime = (time24: string) => {
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
  };

  return schedules.map(({ schedule }) => {
    const day = weekdays[schedule.weekday];
    const start = formatTime(schedule.startTime);
    const end = formatTime(schedule.endTime);
    return `${day} ${start} - ${end}`;
  }).join(', ');
}