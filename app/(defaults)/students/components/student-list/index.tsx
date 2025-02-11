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



interface Props {
  className?: string;
  query?: string;
}

export default function StudentList({ className, query = '' }: Props) {
  const params = queryStringToObject(query);
  const { loading, error, students, totalStudents, setStudents } = useFetchStudents(query);
  if (error) {
    openNotification('error', error);
  }
  console.log('students', students);

  const onDelete = async (id: string) => {
    console.log('delete', id);
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

  if (loading) return <Skeleton rows={5} columns={['ESTUDIANTE', 'CORREO ELECTRÓNICO', 'TELÉFONO']} />;

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
            {students?.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron estudiantes registrados</td>
              </tr>
            )}
            {students?.map((student) => {
              return (
                <tr key={student.id}>
                  <td>
                    <div className="flex gap-2 items-center ml-2">
                      <Avatar initials={getInitials(student.firstName, student.lastName)} size="sm" color="primary" />
                      <div className='flex flex-col'>
                        <span>{`${student.firstName} ${student.lastName}`}</span>
                        <span className='font-semibold'>{student.identification}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="whitespace-nowrap">{student.email}</div>
                  </td>
                  <td>
                    <OptionalInfo content={formatPhoneNumber(student.phone)} />
                  </td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      <Tooltip title="Eliminar">
                        <Button onClick={() => onDelete(student.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                      </Tooltip>
                      <Tooltip title="Editar">
                        <Link href={`/students/${student.id}`}>
                          <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} />
                        </Link>
                      </Tooltip>
                      <Tooltip title="Ver">
                        <Link href={`/students/view/${student.id}`}>
                          <Button variant="outline" color='success' size="sm" icon={<IconEye className="size-4" />} />
                        </Link>
                      </Tooltip>
                      {/* ALTERNATIVA */}
                      {/* <Button onClick={() => onDelete(Student.id)} variant="outline" size="sm" color="danger" >Eliminar</Button>
                                            <Link href={`/Students/${Student.id}`}>
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
          total={totalStudents}
          top={parseInt(params?.top || '10')}
        />
      </div>
    </div>
  );
};
