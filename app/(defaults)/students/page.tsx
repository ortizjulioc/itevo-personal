import { SearchInput, ViewTitle } from "@/components/common";
import { IconPlusCircle } from "@/components/icon";
import { Button } from "@/components/ui";
import { Metadata } from "next";
import Link from "next/link";

import { objectToQueryString } from "@/utils";
import StudentList from "./components/student-list";
import StudentsClient from "./students-client";

export const metadata: Metadata = {
  title: 'Estudiantes',
};
interface StudentListProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}
export default async function Students({ searchParams }: StudentListProps) {
  const params = await searchParams;
  return <StudentsClient searchParams={params} />;
}
