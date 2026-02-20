import CourseBranchClient from './course-branch-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Oferta Académica',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const params = await searchParams;
  return <CourseBranchClient searchParams={params} />;
}
