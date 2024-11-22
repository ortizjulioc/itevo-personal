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
import { deleteTeacher } from "../../lib/request";

interface Props {
  className?: string;
  query?: string;
}

export default function TeacherList({ className, query = '' }: Props) {
  const params = queryStringToObject(query);
  const { loading, error, teachers, totalTeachers, setTeachers } = useFetchTeachers(query);
  if (error) {
    openNotification('error', error);
  }

  const onDelete = async (id: string) => {
    console.log('delete', id);
    confirmDialog({
      title: 'Eliminar Profesor',
      text: '¿Seguro que quieres eliminar este Profesor?',
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

  if (loading) return <Skeleton rows={5} columns={['PROFESOR', 'CORREO ELECTRÓNICO', 'TELÉFONO']} />;

  return (
    <div className={className}>
      <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
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
                <td colSpan={4} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron Profesors registrados</td>
              </tr>
            )}
            {teachers?.map((teacher) => {
              return (
                <tr key={teacher.id}>
                  <td>
                    <div className="flex gap-2 items-center ml-2">
                      <Avatar initials={getInitials(teacher.firstName, teacher.lastName)} size="sm" color="primary" />
                      <div className='flex flex-col'>
                        <span>{`${teacher.firstName} ${teacher.lastName}`}</span>
                        <span className='font-semibold'>{teacher.identification}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="whitespace-nowrap">{teacher.email}</div>
                  </td>
                  <td>
                    <OptionalInfo content={formatPhoneNumber(teacher.phone)} />
                  </td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      <Tooltip title="Eliminar">
                        <Button onClick={() => onDelete(teacher.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                      </Tooltip>
                      <Tooltip title="Editar">
                        <Link href={`/teachers/${teacher.id}`}>
                          <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} />
                        </Link>
                      </Tooltip>
                      {/* ALTERNATIVA */}
                      {/* <Button onClick={() => onDelete(teacher.id)} variant="outline" size="sm" color="danger" >Eliminar</Button>
                                            <Link href={`/teachers/${teacher.id}`}>
                                                <Button variant="outline" size="sm">Editar</Button>
                                            </Link> */}
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
