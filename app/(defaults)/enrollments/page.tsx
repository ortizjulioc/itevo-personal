// app/enrollments/page.tsx

import Enrollment from "./enrollment-client";


export const metadata = {
  title: 'Inscripciones',
};

export default function Page({ searchParams }: { searchParams?: { [key: string]: string } }) {
  return <Enrollment searchParams={searchParams} />;
}