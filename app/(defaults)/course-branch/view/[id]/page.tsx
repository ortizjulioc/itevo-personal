'use client';
import { ViewTitle } from "@/components/common";
import { confirmDialog, objectToQueryString, openNotification } from "@/utils";
import { useFetchCourseBranchById } from "../../lib/use-fetch-course-branch";
import CourseBranchDetails from "../../components/course-branch-details/course-branch-details";
import CourseBranchEnrollments from "../../components/course-branch-details/course-branch-enrollments";
import StickyFooter from "@/components/common/sticky-footer";
import { Button } from "@/components/ui";
import { deleteCourseBranch } from "../../lib/request";
import { IconEdit, IconTrashLines, IconUserPlus } from "@/components/icon";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CourseBranchView({ params, searchParams }: { params: { id: string }, searchParams: Record<string, any> }) {

    const id = params?.id; // Extraer el ID de params
    const router = useRouter();
    const query = objectToQueryString({ ...searchParams, courseBranchId: id }); // Combinar id con searchParams
    const { loading, courseBranch } = useFetchCourseBranchById(id);

    const onDelete = async (id: string) => {
        confirmDialog({
            title: 'Eliminar oferta academica',
            text: '¿Seguro que quieres eliminar esta oferta  academica?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
            const resp = await deleteCourseBranch(id);
            if (resp.success) {
                openNotification('success', 'oferta  academica eliminada correctamente')
                router.push('/course-branch')
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }

    return (
        <div>
            <ViewTitle className='mb-6' title="Vista de Oferta Academica" showBackPage />

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-200  dark:bg-gray-700 animate-pulse rounded-md h-70 md:col-span-2 "></div>
                    <div className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md h-70 "></div>
                </div>
            )}

            {!loading && courseBranch && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CourseBranchDetails courseBranch={courseBranch} />
                        <CourseBranchEnrollments query={query} />
                    </div>

                    <StickyFooter className='-mx-6 px-8 py-4' stickyClass='border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'>
                        <div className="flex justify-between gap-2 ">
                            <div>

                                <Button
                                    onClick={() => onDelete(courseBranch.id)}
                                    icon={<IconTrashLines className="size-4" />}
                                    color="danger"
                                    className="w-full"
                                >
                                    Eliminar
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/course-branch/${courseBranch.id}`} className="w-full">
                                    <Button
                                        icon={<IconEdit className="size-4" />}
                                        className="min-w-max "
                                        color='success'
                                    >
                                        Editar Oferta Academica
                                    </Button>
                                </Link>
                                <Link href={`/enrollments/new?courseBranchId=${courseBranch.id}`} className="w-full">
                                    <Button
                                        icon={<IconUserPlus className="size-4" />}
                                        className="w-full "
                                    >
                                        Inscribir Estudiante
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </StickyFooter>
                </>
            )}
        </div>
    )
}
