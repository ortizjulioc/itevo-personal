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

  if (loading) return <Skeleton rows={5} columns={['ESTUDIANTE', 'CORREO ELECTRÓNICO', 'TELÉFONO']} />;

  return (
    <div className={className}>
      <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
        <table className="table-hover">
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>TELEFONO</th>
              <th>DIRECCION</th>
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
                    <div className="ml-2 flex items-center gap-2 min-w-64">
                      <Avatar initials={getInitials(student.firstName, student.lastName)} size="sm" color="primary" />
                      <div className="flex flex-col">
                        <span>{`${student.firstName} ${student.lastName}`}</span>
                        <span className="font-semibold"><OptionalInfo content={student.identification || ''} message="Sin identificación" /></span>
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
                      <Tooltip title="Eliminar">
                        <button onClick={() => onDelete(student.id)}>
                          <IconTrashLines className="size-5 hover:text-danger hover:cursor-pointer" />
                        </button>
                      </Tooltip>
                      {/* <CaptureFingerPrint
                        studentId={student.id}
                        showTitle={false}
                      /> */}
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
