// app/enrollments/page.tsx

import Enrollment from "./enrollment-client";


export const metadata = {
  title: 'Inscripciones',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const params = await searchParams;
  return <Enrollment searchParams={params} />;
}