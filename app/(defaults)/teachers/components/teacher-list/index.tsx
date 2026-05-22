'use client';
import Avatar from "@/components/common/Avatar";
import { confirmDialog, formatPhoneNumber, getInitials, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import OptionalInfo from "@/components/common/optional-info";
import Skeleton from "@/components/common/Skeleton";
import useFetchTeachers from "../../lib/use-fetch-teachers";
import { deleteTeacher, restoreTeacher } from "../../lib/request";
import { useSession } from "next-auth/react";
import { LuRotateCcw } from "react-icons/lu";
import { SUPER_ADMIN } from "@/constants/role.constant";

interface Props {
  className?: string;
  query?: string;
}

export default function TeacherList({ className, query = '' }: Props) {
  const params = queryStringToObject(query);
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.roles?.some((role: any) => role.normalizedName === SUPER_ADMIN);
  const { loading, error, teachers, totalTeachers, setTeachers, refetch } = useFetchTeachers(query);
  if (error) {
    openNotification('error', error);
  }

  const onDelete = async (id: string) => {
 
    confirmDialog({
      title: 'Eliminar Profesor',
      text: '¿Seguro que quieres eliminar este profesor?',
      confirmButtonText: 'Sí, eliminar',
      icon: 'error'
    }, async () => {
      const resp = await deleteTeacher(id);
      if (resp.success) {
        setTeachers(teachers?.filter((teacher) => teacher.id !== id));
        openNotification('success', 'Profesor eliminado correctamente');
        return;
      } else {
        openNotification('error', resp.message);
      }
    });
  }

  const onRestore = async (id: string) => {
    confirmDialog({
      title: 'Restaurar Profesor',
      text: '¿Quieres restaurar este profesor?',
      confirmButtonText: 'Sí, restaurar',
      icon: 'info'
    }, async () => {
      const resp = await restoreTeacher(id);
      if (resp.success) {
        openNotification('success', 'Profesor restaurado correctamente');
        refetch(); // Recargar la lista para reflejar el cambio de estado
        return;
      } else {
        openNotification('error', resp.message);
      }
    });
  }

  if (loading) return <Skeleton rows={5} columns={['PROFESOR', 'CORREO ELECTRÓNICO', 'TELÉFONO']} />;

  return (
    <div className={className}>
      <div className="table-responsive mb-5 panel p-0 border-0 ">
        <table className="table-hover">
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>CORREO ELECTRÓNICO</th>
              <th>TELEFONO</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {teachers?.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron profesores registrados</td>
              </tr>
            )}
            {teachers?.map((teacher) => {
              const isDeleted = (teacher as any).deleted;
              return (
                <tr key={teacher.id} className={isDeleted ? "opacity-50 grayscale-[0.5]" : ""}>
                  <td>
                    <div className="flex gap-2 items-center ml-2">
                      <Avatar initials={getInitials(teacher.firstName, teacher.lastName)} size="sm" color="primary" />
                      <div className='flex flex-col'>
                        <div className="flex items-center gap-2">
                          <span>{`${teacher.firstName} ${teacher.lastName}`}</span>
                          {isDeleted && <span className="badge bg-danger text-xs">Eliminado</span>}
                        </div>
                        <span className='font-semibold'>{teacher.identification}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="whitespace-nowrap">{<OptionalInfo  content={teacher.email || ''} />}</div>
                  </td>
                  <td>
                    <OptionalInfo content={formatPhoneNumber(teacher.phone)} />
                  </td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      {isSuperAdmin && isDeleted ? (
                        <Tooltip title="Restaurar">
                          <Button
                            onClick={() => onRestore(teacher.id)}
                            variant="outline"
                            size="sm"
                            color="success"
                            icon={<LuRotateCcw className="size-4" />}
                          />
                        </Tooltip>
                      ) : (
                        <>
                          <Tooltip title="Eliminar">
                            <Button onClick={() => onDelete(teacher.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                          </Tooltip>
                          <Tooltip title="Editar">
                            <Link href={`/teachers/${teacher.id}`}>
                              <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} />
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
          total={totalTeachers}
          top={parseInt(params?.top || '10')}
        />
      </div>
    </div>
  );
};
