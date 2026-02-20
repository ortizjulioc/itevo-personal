import AttendanceClient from './attendance-client';

export const metadata = {
  title: 'Asistencias',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const params = await searchParams;
  return <AttendanceClient searchParams={params} />;
}
