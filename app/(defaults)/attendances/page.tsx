import AttendanceClient from './attendance-client';

export const metadata = {
  title: 'Asistencias',
};

export default function Page({ searchParams }: { searchParams?: { [key: string]: string } }) {
  return <AttendanceClient searchParams={searchParams} />;
}
