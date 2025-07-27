import { ViewTitle } from "@/components/common";
import { Button } from "@/components/ui";
import { Metadata } from "next";
import Link from "next/link";
import { objectToQueryString } from "@/utils";
import CourseBranchList from "./components/course-branch-list";
import Dropdown from "@/components/dropdown";
import SearchCourseBranch from "./components/search-course-branch";


export const metadata: Metadata = {
  title: 'Cursos',
};
interface CoursetListProps {
  searchParams?: {
    search?: string;
    page?: string;
  };
}

export default function Coursets({ searchParams }: CoursetListProps) {
  const query = objectToQueryString(searchParams || {});
  return (
    <div>
      <ViewTitle className='mb-6' title="Oferta  Academica" rightComponent={
        <>


            <Link href="/course-branch/new">
              <Button>
                Crear Oferta
              </Button>
            </Link>
          {/* <div className="inline-flex">
            <div className="dropdown">
              <Dropdown
                btnClassName="btn dropdown-toggle btn-primary ltr:rounded-l-none rtl:rounded-r-none border-l-[#4468fd] before:border-[5px] before:border-l-transparent before:border-r-transparent before:border-t-inherit before:border-b-0 before:inline-block before:border-t-white-light h-full"

              >
                <div className="absolute right-0 mt-2 min-w-[170px] bg-white shadow-md rounded-md py-2 z-50 border border-gray-200">
                  <span className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Por sucursal</span>
                  <span className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Por curso</span>
                  <span className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Por profesor</span>
                </div>
              </Dropdown>
            </div>
          </div> */}


        </>
      } />

      <div>
        <SearchCourseBranch />
      </div>
      <CourseBranchList query={query} />
    </div>
  )
}
