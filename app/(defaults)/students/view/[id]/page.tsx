'use client';
import { ViewTitle } from "@/components/common";
import { useFetchStudentById } from "../../lib/use-fetch-students";
import StudentDetails from "../../components/student-details/student-details";
import { confirmDialog, objectToQueryString, openNotification } from "@/utils";
import StudentEnrollments from "../../components/student-details/student-enrollments";
import StickyFooter from "@/components/common/sticky-footer";
import Tooltip from "@/components/ui/tooltip";
import { Button } from "@/components/ui";
import { IconEdit, IconTrashLines, IconUserPlus } from "@/components/icon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteStudent } from "../../lib/request";

export default function StudentView({ params, searchParams }: { params: { id: string }, searchParams: Record<string, any> }) {
    const id = params?.id; // Extraer el ID de params
    const router = useRouter();
    const query = objectToQueryString({ ...searchParams, studentId: id }); // Combinar id con searchParams
    const { loading, student } = useFetchStudentById(id);

    const onDelete = async (id: string) => {
        confirmDialog({
            title: 'Eliminar Estudiante',
            text: '¿Seguro que quieres eliminar este Estudiante?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
            const resp = await deleteStudent(id);
            if (resp.success) {
                openNotification('success', 'estudiante eliminado correctamente');
                router.push('/students')
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }

    return (
        <div>
            <ViewTitle className='mb-6' title="Vista de estudiante" showBackPage />

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-200  dark:bg-gray-700 animate-pulse rounded-md h-70 md:col-span-2 "></div>
                    <div className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md h-70 "></div>
                </div>
            )}

            {!loading && student && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StudentDetails student={student} />
                        <StudentEnrollments query={query} />
                    </div>
                    <StickyFooter className='-mx-6 px-8 py-4' stickyClass='border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'>
                        <div className="flex justify-between gap-2 ">
                            <div>
                                <Tooltip title="Eliminar">
                                    <Button
                                        onClick={() => onDelete(student.id)}
                                        icon={<IconTrashLines className="size-4" />}
                                        color="danger"
                                        className="w-full"
                                    >
                                        Eliminar
                                    </Button>
                                </Tooltip>
                            </div>
                            <div className="flex gap-2">
                                <Tooltip title="Editar">
                                    <Link href={`/students/${student.id}`} className="w-full">
                                        <Button
                                            color="success"
                                            icon={<IconEdit className="size-4" />}
                                            className="min-w-max"
                                        >
                                            Editar Estudiante
                                        </Button>
                                    </Link>
                                </Tooltip>
                                <Tooltip title="Inscribir">
                                    <Link href={`/enrollments/new?studentId=${student.id}`} className="w-full">
                                        <Button
                                            icon={<IconUserPlus className="size-4" />}
                                            className="min-w-max"
                                        >
                                            Inscribir Estudiente
                                        </Button>
                                    </Link>
                                </Tooltip>
                            </div>
                        </div>
                    </StickyFooter>
                </>
            )}

        </div>
    )
}
