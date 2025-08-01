import CourseBranchClient from './course-branch-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Oferta Académica',
};

export default function Page({ searchParams }: { searchParams?: { [key: string]: string } }) {
  return <CourseBranchClient searchParams={searchParams} />;
}
