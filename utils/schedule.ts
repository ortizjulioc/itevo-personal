import { convertTimeFrom24To12Format } from "./date";

type Schedule = {
  schedule: {
    startTime: string; // "08:00"
    endTime: string;   // "10:00"
    weekday: number;   // 0=Domingo, 1=Lunes, ..., 6=Sábado
  };
};

export const weekdaysMap: { [key: number]: string } = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

export const formatSchedule = (schedule: { weekday: number; startTime: string; endTime: string }[]): string => {
  return schedule
    .map(({ weekday, startTime, endTime }) => `${weekdaysMap[weekday]}: ${convertTimeFrom24To12Format(startTime)} - ${convertTimeFrom24To12Format(endTime)}`)
    .join(' | ');
};

export function formatScheduleList(schedules: Schedule[]): string {
    console.log("Schedules:", schedules);
  if (!schedules || schedules.length === 0 || !schedules[0].schedule) {
    return "";
  }

  const formatTime = (time24: string) => {
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
  };

  return schedules.map((s) => {
    const data = s.schedule ?? s; // permite ambos formatos
    const day = weekdaysMap[data.weekday];
    const start = formatTime(data.startTime);
    const end = formatTime(data.endTime);
    return `${day} ${start} - ${end}`;
  }).join(', ');
}
