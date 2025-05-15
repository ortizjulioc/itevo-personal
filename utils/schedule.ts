import { convertTimeFrom24To12Format } from "./date";

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