'use client';
import Avatar from "@/components/common/Avatar";
import { confirmDialog, formatPhoneNumber, getInitials, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconEye, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import OptionalInfo from "@/components/common/optional-info";
import Skeleton from "@/components/common/Skeleton";
import useFetchStudents from "../../lib/use-fetch-students";
import { deleteStudent } from "../../lib/request";
import CaptureFingerPrint from "@/components/common/finger-print/capture-finger-print";
import TextEllipsis from "@/components/common/text-ellipsis";
import { TbDetails } from "react-icons/tb";
import Dropdown from "@/components/dropdown";
import { IRootState } from "@/store";
import { useSelector } from "react-redux";
import { IoIosMore } from "react-icons/io";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { restoreStudent } from "../../lib/request";
import { LuRotateCcw } from "react-icons/lu";
import { SUPER_ADMIN } from "@/constants/role.constant";



interface Props {
  className?: string;
  query?: string;
}

export default function StudentList({ className, query = '' }: Props) {
  const params = queryStringToObject(query);
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.roles?.some((role: any) => role.normalizedName === SUPER_ADMIN);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const { loading, error, students, totalStudents, setStudents, refetch } = useFetchStudents(query);
  if (error) {
    openNotification('error', error);
  }


  const onDelete = async (id: string) => {

    confirmDialog({
      title: 'Eliminar Estudiante',
      text: '¿Seguro que quieres eliminar este Estudiante?',
      confirmButtonText: 'Sí, eliminar',
      icon: 'error'
    }, async () => {
      const resp = await deleteStudent(id);
      if (resp.success) {
        setStudents(students?.filter((student) => student.id !== id));
        openNotification('success', 'estudiante eliminado correctamente');
        return;
      } else {
        openNotification('error', resp.message);
      }
    });
  }

  const onRestore = async (id: string) => {
    confirmDialog({
      title: 'Restaurar Estudiante',
      text: '¿Quieres restaurar este estudiante?',
      confirmButtonText: 'Sí, restaurar',
      icon: 'info'
    }, async () => {
      const resp = await restoreStudent(id);
      if (resp.success) {
        openNotification('success', 'Estudiante restaurado correctamente');
        refetch(); // Recargar la lista para reflejar el cambio de estado
        return;
      } else {
        openNotification('error', resp.message);
      }
    });
  }

  if (loading) return <Skeleton rows={5} columns={['NOMBRE', 'TELÉFONO', 'DIRECCIÓN']} />;

  return (
    <div className={className}>
      <div className="table-responsive mb-5 panel p-0 border-0 ">
        <table className="table-hover">
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>TELEFONO</th>
              <th>DIRECCIÓN</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {students?.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron estudiantes registrados</td>
              </tr>
            )}
            {students?.map((student) => {
              const isDeleted = student.deleted;
              return (
                <tr key={student.id} className={isDeleted ? "opacity-50 grayscale-[0.5]" : ""}>
                  <td>
                    <div className="ml-2 flex items-center gap-2 min-w-64">
                      <Avatar initials={getInitials(student.firstName, student.lastName)} size="sm" color="primary" />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span>{`${student.firstName} ${student.lastName}`}</span>
                          {student.isMinor && <span className="badge bg-info text-xs">Menor</span>}
                          {isDeleted && <span className="badge bg-danger text-xs">Eliminado</span>}
                        </div>
                        <span className="font-semibold"><OptionalInfo content={student.code} message="Sin identificación" /></span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      {student.phone ? student.phone.split(',').map((phone, index) => (
                        <span key={index} className="block min-w-max">
                          {formatPhoneNumber(phone.trim())}
                        </span>
                      )) : (
                        <OptionalInfo />
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="whitespace-nowrap">
                      {student.address ? (
                        <TextEllipsis text={student.address} maxLength={30} />
                      ) : <OptionalInfo />}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-3">
                      {isSuperAdmin && isDeleted ? (
                        <Tooltip title="Restaurar">
                          <Button
                            onClick={() => onRestore(student.id)}
                            variant="outline"
                            size="sm"
                            color="success"
                            icon={<LuRotateCcw className="size-4" />}
                          />
                        </Tooltip>
                      ) : (
                        <>
                          <div className="relative inline-block text-left">
                            <button
                              className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(prev => (prev === student.id ? null : student.id));
                              }}
                            >
                              <IoIosMore className="text-xl rotate-90" />
                            </button>

                            {openDropdownId === student.id && (
                              <div
                                className="fixed right-4 mt-2 w-auto z-50 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="py-1">
                                  <div className="hover:bg-gray-100">
                                    <CaptureFingerPrint
                                      studentId={student.id}
                                      showTitle={true}
                                      blackStyle={true}
                                    />
                                  </div>
                                  <Button
                                    onClick={() => onDelete(student.id)}
                                    className="flex w-full items-start justify-start text-sm shadow-none bg-white border-none text-red-600 hover:bg-white hover:text-red-600"
                                    icon={<IconTrashLines className="text-lg" />}
                                  >
                                    Eliminar
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>

                          <Tooltip title="Editar">
                            <Link href={`/students/${student.id}`}>
                              <IconEdit className="size-5 hover:text-primary hover:cursor-pointer" />
                            </Link>
                          </Tooltip>
                          <Tooltip title="Detalles">
                            <Link href={`/students/view/${student.id}`}>
                              <Button size="sm" icon={<TbDetails className="size-4 rotate-90" />} />
                            </Link>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

      </div>
      <div className="">
        <Pagination
          currentPage={parseInt(params?.page || '1')}
          total={totalStudents}
          top={parseInt(params?.top || '10')}
        />
      </div>
    </div>
  );
};
