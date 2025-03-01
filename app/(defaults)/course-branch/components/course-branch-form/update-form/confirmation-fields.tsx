import React from 'react'
import { CourseBranchFormType } from '../form.config';
import { FormikErrors, FormikTouched } from 'formik';

interface ConfirmationFieldsProps {
  values: CourseBranchFormType;
  errors: FormikErrors<CourseBranchFormType>;
  touched: FormikTouched<CourseBranchFormType>;
  className?: string;
}

const data = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  promotionId: "promo-001",
  branchId: "branch-001",
  teacherId: "teacher-001",
  courseId: "course-001",
  amount: 200.0,
  modality: "Presencial", // Opciones: "Presencial", "Virtual", "Híbrido"
  startDate: new Date("2023-09-01T09:00:00.000Z"),
  endDate: new Date("2023-12-31T17:00:00.000Z"),
  commissionRate: 15.0,
  capacity: 40,
  sessionCount: 20,
  status: "ACTIVE", // Ejemplo: "ACTIVE", "INACTIVE", "DRAFT"
  schedules: [
    { day: "Lunes", startTime: "09:00", endTime: "11:00" },
    { day: "Miércoles", startTime: "09:00", endTime: "11:00" }
  ],
  // Los arreglos siguientes se pueden dejar vacíos para efectos de prueba:
  enrollment: [],
  accountReceivable: [],
  accountPayable: []
};

export default function ConfirmationFields({ values, errors, touched, className }: ConfirmationFieldsProps) {
  console.log(values)

  const onEdit = (index: number) => {
    console.log('Edit', index)
  }
  return (
    <div>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-md">
        <h2 className="text-2xl font-bold mb-4">Revisión y Confirmación</h2>

        {/* Sección: Datos Generales */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold border-b pb-2 mb-2">Datos Generales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-600">Promoción:</p>
              <p className="text-gray-800">{data.promotionId}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Curso:</p>
              <p className="text-gray-800">{data.courseId}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Sucursal:</p>
              <p className="text-gray-800">{data.branchId}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Profesor:</p>
              <p className="text-gray-800">{data.teacherId}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Estado:</p>
              <p className="text-gray-800">{data.status}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Capacidad:</p>
              <p className="text-gray-800">{data.capacity}</p>
            </div>
          </div>
          <button onClick={() => onEdit(1)} className="mt-2 text-blue-600 hover:underline">
            Editar Datos Generales
          </button>
        </div>

        {/* Sección: Modalidad y Horarios */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold border-b pb-2 mb-2">Modalidad y Horarios</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-600">Modalidad:</p>
              <p className="text-gray-800">{data.modality}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Sesiones:</p>
              <p className="text-gray-800">{data.sessionCount}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Fecha de Inicio:</p>
              <p className="text-gray-800">{new Date(data.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Fecha de Fin:</p>
              <p className="text-gray-800">{new Date(data.endDate).toLocaleDateString()}</p>
            </div>
          </div>
          {data.schedules && data.schedules.length > 0 && (
            <div className="mt-4">
              <p className="font-medium text-gray-600">Horarios:</p>
              <ul className="list-disc ml-6 text-gray-800">
                {data.schedules.map((schedule, index) => (
                  <li key={index}>
                    {schedule.day}: {schedule.startTime} - {schedule.endTime}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={() => onEdit(2)} className="mt-2 text-blue-600 hover:underline">
            Editar Modalidad y Horarios
          </button>
        </div>

        {/* Sección: Configuración Financiera */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold border-b pb-2 mb-2">Configuración Financiera</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-600">Monto:</p>
              <p className="text-gray-800">${data.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Comisión:</p>
              <p className="text-gray-800">{data.commissionRate}%</p>
            </div>
          </div>
          <button onClick={() => onEdit(3)} className="mt-2 text-blue-600 hover:underline">
            Editar Configuración Financiera
          </button>
        </div>

        {/* Botón de Confirmación Final */}
        <div className="flex justify-end">
          <button
            // onClick={onConfirm}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            Confirmar y Crear Curso
          </button>
        </div>
      </div>
    </div>
  )
}
